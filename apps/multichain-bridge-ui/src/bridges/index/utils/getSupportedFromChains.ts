import { CBridgeTransferConfigResponse } from '@/bridges/cbridge/types';
import { TransferConfigsContextProps } from '@/bridges/index';
import { CBRIDGE_TRANSFER_CONFIGS } from '@/bridges/index/data';
import { getMultiBurnConfigs } from '@/bridges/index/utils/getMultiBurnConfigs';

export function getSupportedFromChains(configs: TransferConfigsContextProps) {
  const { chains } = configs;

  const cBridgeChains = chains.filter((item) => item.rawData.cbridge) ?? [];
  const allCBridgeChainIds = cBridgeChains.map((chain) => {
    return chain.id;
  });

  const bridgedIds = new Set<number>();

  allCBridgeChainIds.forEach((id1) => {
    if (bridgedIds.has(id1)) {
      return;
    }

    allCBridgeChainIds.forEach((id2) => {
      if (id1 === id2) {
        return;
      }

      if (
        isTwoChainsBridged(
          id1,
          id2,
          CBRIDGE_TRANSFER_CONFIGS as CBridgeTransferConfigResponse
        )
      ) {
        bridgedIds.add(id1);
        bridgedIds.add(id2);
      }
    });
  });

  const filteredChains = chains.filter((item) => {
    if (item.rawData.debridge) {
      return true;
    }
    if (item.rawData.cbridge && bridgedIds.has(item.id)) {
      return true;
    }
    return false;
  });

  return filteredChains;
}

const isTwoChainsBridged = (
  chainId1: number,
  chainId2: number,
  transferConfig: CBridgeTransferConfigResponse
) => {
  let peggedBridged = false;

  const multiBurnConfigs = getMultiBurnConfigs();
  const burnConfig = multiBurnConfigs.find((multiBurnConfig) => {
    return (
      (multiBurnConfig.burn_config_as_org.chain_id === chainId1 &&
        multiBurnConfig.burn_config_as_dst.chain_id === chainId2) ||
      (multiBurnConfig.burn_config_as_dst.chain_id === chainId1 &&
        multiBurnConfig.burn_config_as_org.chain_id === chainId2)
    );
  });

  if (burnConfig) {
    return true;
  }

  transferConfig.pegged_pair_configs.forEach((peggedPairConfig) => {
    const bridged =
      (peggedPairConfig.org_chain_id === chainId1 &&
        peggedPairConfig.pegged_chain_id === chainId2) ||
      (peggedPairConfig.org_chain_id === chainId2 &&
        peggedPairConfig.pegged_chain_id === chainId1);
    peggedBridged = peggedBridged || bridged;
  });

  /// Skip pool based bridge check if two chains have pegged bridge
  if (peggedBridged) {
    return true;
  }

  const poolBasedTokensForChainId1 = transferConfig.chain_token[chainId1];
  const poolBasedTokensForChainId2 = transferConfig.chain_token[chainId2];

  let poolBasedBridged = false;
  if (
    poolBasedTokensForChainId1 &&
    poolBasedTokensForChainId1 !== undefined &&
    poolBasedTokensForChainId2 &&
    poolBasedTokensForChainId2 !== undefined
  ) {
    const poolBasedTokenSymbolsForChainId1: string[] =
      poolBasedTokensForChainId1.token
        .filter((tokenInfo) => {
          return !tokenInfo.token.xfer_disabled;
        })
        .map((tokenInfo) => {
          return tokenInfo.token.symbol;
        });
    poolBasedTokensForChainId2.token.forEach((tokenInfo) => {
      poolBasedBridged =
        poolBasedBridged ||
        (poolBasedTokenSymbolsForChainId1.includes(tokenInfo.token.symbol) &&
          !tokenInfo.token.xfer_disabled);
    });
  }
  return poolBasedBridged || peggedBridged;
};
