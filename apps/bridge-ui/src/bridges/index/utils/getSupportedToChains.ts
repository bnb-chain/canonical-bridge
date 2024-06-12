import { CBridgeTransferConfigResponse } from '@/bridges/cbridge/types';
import { TransferConfigsContextProps, ChainInfo } from '@/bridges/index';
import { CBRIDGE_TRANSFER_CONFIGS } from '@/bridges/index/data';
import { getMultiBurnConfigs } from '@/bridges/index/utils/getMultiBurnConfigs';

export function getSupportedToChains(
  configs: TransferConfigsContextProps,
  fromChain: ChainInfo
) {
  const { chains } = configs;

  const potentialTargetChainIds = getPotentialTargetChainIds(
    CBRIDGE_TRANSFER_CONFIGS as CBridgeTransferConfigResponse,
    fromChain.id
  );

  const filteredChains = chains.filter((item) => {
    if (item.rawData.debridge) {
      return true;
    }
    if (item.rawData.cbridge && potentialTargetChainIds.has(item.id)) {
      return true;
    }
    return false;
  });

  return filteredChains;
}

function getPotentialTargetChainIds(
  config = {} as CBridgeTransferConfigResponse,
  fromChainId: number
) {
  const potentialTargetChainIds = new Set<number>();
  const { chain_token, chains, pegged_pair_configs } = config;

  const multiBurnConfigs = getMultiBurnConfigs();

  const poolBasedSupportedTokenSymbols: string[] = chain_token?.[
    fromChainId
  ]?.token
    .filter((tokenInfo) => {
      return !tokenInfo.token.xfer_disabled;
    })
    .map((tokenInfo) => {
      return tokenInfo.token.symbol;
    });

  chains?.forEach((chain) => {
    if (chain.id === fromChainId) return; /// Skip From Chain

    /// Cbridge Pool based supported tokens
    const supportedTokens = chain_token?.[chain.id]?.token?.filter(
      (tokenInfo) => {
        return !tokenInfo.token.xfer_disabled;
      }
    );
    if (supportedTokens && supportedTokens.length > 0) {
      supportedTokens?.forEach((tokenInfo) => {
        if (poolBasedSupportedTokenSymbols?.includes(tokenInfo.token.symbol)) {
          potentialTargetChainIds.add(chain.id);
        }
      });
    }
  });

  /// Pegged supported tokens
  pegged_pair_configs?.forEach((peggedPairConfig) => {
    if (peggedPairConfig.org_chain_id === fromChainId) {
      potentialTargetChainIds.add(peggedPairConfig.pegged_chain_id);
    } else if (peggedPairConfig.pegged_chain_id === fromChainId) {
      potentialTargetChainIds.add(peggedPairConfig.org_chain_id);
    }
  });

  multiBurnConfigs.forEach((multiBurnConfig) => {
    if (multiBurnConfig.burn_config_as_org.chain_id === fromChainId) {
      potentialTargetChainIds.add(multiBurnConfig.burn_config_as_dst.chain_id);
    }
  });

  return potentialTargetChainIds;
}
