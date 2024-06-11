import {
  CBridgeChain,
  CBridgeTransferConfigResponse,
  MultiBurnPairConfig,
} from '@/bridges/cbridge/types';
import { ethers } from 'ethers';

export const isTwoChainsBridged = (
  chainId1: number,
  chainId2: number,
  transferConfig: CBridgeTransferConfigResponse
) => {
  let peggedBridged = false;

  const multiBurnConfigs = getMultiBurnConfigs(transferConfig);
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

const getMultiBurnConfigs = (config: CBridgeTransferConfigResponse) => {
  const multiBurnConfigs: MultiBurnPairConfig[] = [];
  if (config?.pegged_pair_configs?.length === 0) {
    return [];
  }
  const configsLength = config?.pegged_pair_configs?.length;

  for (let i = 0; i < configsLength; i++) {
    for (let j = i + 1; j < configsLength; j++) {
      const peggedConfigI = config.pegged_pair_configs[i];
      const peggedConfigJ = config.pegged_pair_configs[j];
      if (
        peggedConfigI.org_chain_id === peggedConfigJ.org_chain_id &&
        peggedConfigI.org_token.token.symbol ===
          peggedConfigJ.org_token.token.symbol
      ) {
        /// Only upgraded PegBridge can support multi burn to other pegged chain
        if (
          peggedConfigI.bridge_version === 2 &&
          peggedConfigJ.bridge_version === 2
        ) {
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: peggedConfigI.pegged_chain_id,
              token: peggedConfigI.pegged_token,
              burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigI.canonical_token_contract_addr,
              burn_contract_version: peggedConfigI.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: peggedConfigJ.pegged_chain_id,
              token: peggedConfigJ.pegged_token,
              burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigJ.canonical_token_contract_addr,
              burn_contract_version: peggedConfigJ.bridge_version,
            },
          });
          multiBurnConfigs.push({
            burn_config_as_org: {
              chain_id: peggedConfigJ.pegged_chain_id,
              token: peggedConfigJ.pegged_token,
              burn_contract_addr: peggedConfigJ.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigJ.canonical_token_contract_addr,
              burn_contract_version: peggedConfigJ.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: peggedConfigI.pegged_chain_id,
              token: peggedConfigI.pegged_token,
              burn_contract_addr: peggedConfigI.pegged_burn_contract_addr,
              canonical_token_contract_addr:
                peggedConfigI.canonical_token_contract_addr,
              burn_contract_version: peggedConfigI.bridge_version,
            },
          });
        }
      }
    }
  }

  return multiBurnConfigs;
};

export const getSupportedFromChains = (
  config = {} as CBridgeTransferConfigResponse
): CBridgeChain[] => {
  const allChainIds: number[] =
    config?.chains?.map((chain) => {
      return chain.id;
    }) || [];
  const bridgedIds = new Set<number>();

  allChainIds?.forEach((id1) => {
    if (bridgedIds.has(id1)) {
      return;
    }
    allChainIds.forEach((id2) => {
      if (id1 === id2) {
        return;
      }
      if (isTwoChainsBridged(id1, id2, config)) {
        bridgedIds.add(id1);
        bridgedIds.add(id2);
      }
    });
  });

  const supportedChains =
    config?.chains?.filter((chain) => {
      return bridgedIds.has(chain.id);
    }) || [];

  return supportedChains;
};

export const getSupportedTargetChains = (
  config = {} as CBridgeTransferConfigResponse,
  fromChainId: number
): CBridgeChain[] => {
  const potentialTargetChainIds = new Set<number>();
  const { chain_token, chains, pegged_pair_configs } = config;
  const multiBurnConfigs = getMultiBurnConfigs(config);

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

  const targetChains: CBridgeChain[] = [];

  potentialTargetChainIds?.forEach((chainId) => {
    const foundChains = chains.filter((chain) => {
      return chain.id === chainId;
    });
    if (foundChains.length > 0) {
      targetChains.push(foundChains[0]);
    }
  });

  return targetChains;
};

// CBridge Transfer ID for tracking status
export const getTransferId = (
  transferType:
    | 'deposit'
    | 'deposit2' // vault_version 2
    | 'withdraw'
    | 'withdraw2' // vault_version 2
    | 'pool',
  args: any
) => {
  let type = null;
  if (transferType === 'pool') {
    type = [
      'address', // user's wallet address
      'address', // user's wallet address
      'address', // ERC20 token address
      'uint256', //amount
      'uint64', // destination chain id
      'uint64', // nonce
      'uint64', // source chain id
    ];
  } else if (transferType === 'deposit') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
    ];
  } else if (transferType === 'deposit2') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
      'address', // bridge address
    ];
  } else if (transferType === 'withdraw') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
    ];
  } else if (transferType === 'withdraw2') {
    type = [
      'address', // user wallet
      'address', // token address
      'uint256', // amount
      'uint64', // dst chain id
      'address', // user wallet
      'uint64', // nonce
      'uint64', // src chain id
      'address', // bridge address
    ];
  } else {
    // eslint-disable-next-line no-console
    console.log('Invalid transfer type');
    return '';
  }
  return ethers.utils.solidityKeccak256(type, args);
};
