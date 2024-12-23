import {
  CBridgeBurnPairConfig,
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigs,
} from '@/cbridge/types';
import {
  CreateAdapterParameters,
  NativeCurrency,
  TransferTokenPair,
} from '@/core/types';
import { createBridgeAdapter } from '@/core/utils/createBridgeAdapter';

/**
 * Create a bridge adapter based on provided configurations
 *
 * @param {CBridgeTransferConfigs}          configs cBridge transfer configs
 * @param {number[]}                        [excludedChains] Optional chain IDs that should be excluded
 * @param {Record<number, string[]>}        [excludedTokens] Optional tokens that should be excluded
 * @param {Record<number, NativeCurrency>}  [nativeCurrencies] Optional nativeCurrencies, the information to exclude native tokens
 * @param {string[][]}                      [bridgedTokenGroups] Optional bridgedTokenGroups, tokens within a group can be swapped with each other
 *
 * @returns An adapter object contains normalized configuration of the bridge
 */
export function createAdapter({
  configs,
  excludedChains = [],
  excludedTokens = {},
  nativeCurrencies = {},
  bridgedTokenGroups = [],
}: CreateAdapterParameters<CBridgeTransferConfigs>) {
  const { chains, chainMap } = getChainConfigs({
    configs,
    excludedChains,
  });

  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs({
    configs,
    chainMap,
    nativeCurrencies,
    excludedTokens,
  });

  const peggedPairConfigs = getPeggedPairConfigs({
    peggedPairConfigs: configs.pegged_pair_configs,
    chainMap,
    nativeCurrencies,
    excludedTokens,
  });

  const burnPairConfigs = getBurnPairConfigs(peggedPairConfigs);

  const transferMap = getTransferMap({
    chains,
    peggedPairConfigs,
    chainTokensMap,
    chainSymbolTokenMap,
    bridgedTokenGroups,
  });

  const supportedChains = chains.filter((chain) => transferMap.has(chain.id));

  return {
    ...createBridgeAdapter({
      bridgeType: 'cBridge',
      supportedChains,
      transferMap,
      getChainId(chain: CBridgeChain) {
        return chain.id;
      },
      getTokenInfo(token: CBridgeToken) {
        return {
          name: token.name,
          address: token.token.address,
          decimal: token.token.decimal,
          symbol: token.token.symbol,
        };
      },
    }),
    getPeggedPairConfigs() {
      return peggedPairConfigs;
    },
    getBurnPairConfigs() {
      return burnPairConfigs;
    },
  };
}

/**
 * Get available chains
 */
function getChainConfigs(params: {
  configs: CBridgeTransferConfigs;
  excludedChains: number[];
}) {
  const { configs, excludedChains } = params;
  const { chains, chain_token, pegged_pair_configs } = configs;

  const filteredChains = chains.filter((chain) => {
    const isExcludedChain = excludedChains.includes(chain.id);
    const hasEnabledToken = chain_token[chain.id]?.token?.some(
      (e) => !e.token.xfer_disabled
    );
    const hasPeggedToken = pegged_pair_configs.some(
      (e) =>
        (e.org_chain_id === chain.id || e.pegged_chain_id === chain.id) &&
        !e.org_token.token.xfer_disabled &&
        !e.pegged_token.token.xfer_disabled
    );
    return !isExcludedChain && (hasEnabledToken || hasPeggedToken);
  });

  const chainMap = new Map<number, CBridgeChain>();
  filteredChains.forEach((chain) => {
    chainMap.set(chain.id, chain);
  });

  return {
    chains: filteredChains,
    chainMap,
  };
}

/**
 * Get available tokens
 */
function getTokenConfigs(params: {
  configs: CBridgeTransferConfigs;
  chainMap: Map<number, CBridgeChain>;
  excludedTokens: Record<number, string[]>;
  nativeCurrencies: Record<number, NativeCurrency>;
}) {
  const { configs, chainMap, nativeCurrencies, excludedTokens } = params;
  const { chain_token } = configs;

  const chainTokensMap = new Map<number, CBridgeToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, CBridgeToken>>();
  Object.entries(chain_token).forEach(([id, { token: tokens }]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isEnabledToken = !token.token.xfer_disabled;
      const isNativeToken =
        nativeCurrencies[chainId]?.symbol === token.token.symbol;
      const isExcludedToken = excludedTokens?.[chainId]?.includes(
        token.token.symbol
      );
      return isEnabledToken && !isNativeToken && !isExcludedToken;
    });

    if (filteredTokens.length > 0 && chainMap.has(chainId)) {
      chainSymbolTokenMap.set(chainId, new Map<string, CBridgeToken>());

      filteredTokens.forEach((token) => {
        chainSymbolTokenMap.get(chainId)?.set(token.token.symbol, token);
      });

      chainTokensMap.set(chainId, filteredTokens);
    }
  });

  return {
    chainTokensMap,
    chainSymbolTokenMap,
  };
}

/**
 * Get available pegged pair configs
 */
function getPeggedPairConfigs(params: {
  peggedPairConfigs: CBridgePeggedPairConfig[];
  chainMap: Map<number, CBridgeChain>;
  excludedTokens: Record<number, string[]>;
  nativeCurrencies: Record<number, NativeCurrency>;
}) {
  const { peggedPairConfigs, chainMap, excludedTokens, nativeCurrencies } =
    params;

  const isAvailablePair = (chainId: number, token: CBridgeToken) => {
    const hasChain = chainMap.has(chainId);
    const isEnabledToken = !token.token.xfer_disabled;
    const isNativeToken =
      nativeCurrencies[chainId]?.symbol === token.token.symbol;
    const isExcludedToken = excludedTokens[chainId]?.includes(
      token.token.symbol
    );
    return hasChain && isEnabledToken && !isNativeToken && !isExcludedToken;
  };

  const filteredPeggedPairConfigs = peggedPairConfigs.filter(
    (item) =>
      isAvailablePair(item.org_chain_id, item.org_token) &&
      isAvailablePair(item.pegged_chain_id, item.pegged_token)
  );

  return filteredPeggedPairConfigs;
}

/**
 * Get available burn pair configs
 */
function getBurnPairConfigs(peggedPairConfigs: CBridgePeggedPairConfig[]) {
  const burnPairConfigs: CBridgeBurnPairConfig[] = [];

  for (let i = 0; i < peggedPairConfigs.length; i++) {
    for (let j = i + 1; j < peggedPairConfigs.length; j++) {
      const A = peggedPairConfigs[i];
      const B = peggedPairConfigs[j];
      if (
        A.org_chain_id === B.org_chain_id &&
        A.org_token.token.symbol === B.org_token.token.symbol
      ) {
        /// Only upgraded PegBridge can support multi burn to other pegged chain
        if (A.bridge_version === 2 && B.bridge_version === 2) {
          burnPairConfigs.push({
            burn_config_as_org: {
              chain_id: A.pegged_chain_id,
              token: A.pegged_token,
              burn_contract_addr: A.pegged_burn_contract_addr,
              canonical_token_contract_addr: A.canonical_token_contract_addr,
              burn_contract_version: A.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: B.pegged_chain_id,
              token: B.pegged_token,
              burn_contract_addr: B.pegged_burn_contract_addr,
              canonical_token_contract_addr: B.canonical_token_contract_addr,
              burn_contract_version: B.bridge_version,
            },
          });
          burnPairConfigs.push({
            burn_config_as_org: {
              chain_id: B.pegged_chain_id,
              token: B.pegged_token,
              burn_contract_addr: B.pegged_burn_contract_addr,
              canonical_token_contract_addr: B.canonical_token_contract_addr,
              burn_contract_version: B.bridge_version,
            },
            burn_config_as_dst: {
              chain_id: A.pegged_chain_id,
              token: A.pegged_token,
              burn_contract_addr: A.pegged_burn_contract_addr,
              canonical_token_contract_addr: A.canonical_token_contract_addr,
              burn_contract_version: A.bridge_version,
            },
          });
        }
      }
    }
  }

  return burnPairConfigs;
}

/**
 * Exhaust all transferable cases and return a transfer map containing all possible transaction paths
 */
function getTransferMap(params: {
  chains: CBridgeChain[];
  peggedPairConfigs: CBridgePeggedPairConfig[];
  chainTokensMap: Map<number, CBridgeToken[]>;
  chainSymbolTokenMap: Map<number, Map<string, CBridgeToken>>;
  bridgedTokenGroups: string[][];
}) {
  const { chains, peggedPairConfigs, chainTokensMap, chainSymbolTokenMap } =
    params;

  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken, isPegged, peggedConfig}
  const transferMap = new Map<
    number,
    Map<number, Map<string, TransferTokenPair>>
  >();

  chains.forEach((fromChain) => {
    chains.forEach((toChain) => {
      if (fromChain.id !== toChain.id) {
        const fromTokens = chainTokensMap.get(fromChain.id) ?? [];

        const transferableTokenMap = new Map<string, TransferTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = chainSymbolTokenMap
            .get(toChain.id)
            ?.get(fromToken.token.symbol);
          if (toToken) {
            const tokenPair = {
              fromTokenAddress: fromToken.token.address,
              toTokenAddress: toToken.token.address,
              fromToken,
              toToken,
            };
            transferableTokenMap.set(fromToken.token.symbol, tokenPair);
          }
        });

        if (transferableTokenMap.size > 0) {
          if (!transferMap.has(fromChain.id)) {
            transferMap.set(
              fromChain.id,
              new Map<number, Map<string, TransferTokenPair>>()
            );
          }
          transferMap.get(fromChain.id)?.set(toChain.id, transferableTokenMap);
        }
      }
    });
  });

  const addPeggedTokenPair = (
    fromChainId: number,
    fromToken: CBridgeToken,
    toChainId: number,
    toToken: CBridgeToken,
    item: CBridgePeggedPairConfig
  ) => {
    if (
      !transferMap.get(fromChainId)?.get(toChainId)?.get(fromToken.token.symbol)
    ) {
      if (!transferMap.has(fromChainId)) {
        transferMap.set(
          fromChainId,
          new Map<number, Map<string, TransferTokenPair>>()
        );
      }

      const peggedTokenPair: TransferTokenPair = {
        fromTokenAddress: fromToken.token.address,
        toTokenAddress: toToken.token.address,
        fromToken,
        toToken,
        isPegged: true,
        peggedConfig: item,
      };

      if (transferMap.get(fromChainId)?.get(toChainId)) {
        transferMap
          .get(fromChainId)
          ?.get(toChainId)
          ?.set(fromToken.token.symbol, peggedTokenPair);
      } else {
        const transferableTokenMap = new Map<string, TransferTokenPair>();
        transferableTokenMap.set(fromToken.token.symbol, peggedTokenPair);
        transferMap.get(fromChainId)?.set(toChainId, transferableTokenMap);
      }
    }
  };

  peggedPairConfigs.forEach((item) => {
    const fromChainId = item.org_chain_id;
    const fromToken = item.org_token;

    const toChainId = item.pegged_chain_id;
    const toToken = item.pegged_token;

    addPeggedTokenPair(fromChainId, fromToken, toChainId, toToken, item);
    addPeggedTokenPair(toChainId, toToken, fromChainId, fromToken, item);
  });

  return transferMap;
}
