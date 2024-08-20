import {
  CBridgeBurnPairConfig,
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigs,
} from '@/modules/bridges/cbridge/types';
import { BridgeConfigsResponse, ChainConfig } from '@/modules/bridges';
import { BaseTokenPair, createAdapter } from '@/modules/bridges/main/utils/createAdapter';

export function createCBridgeAdapter(
  data: BridgeConfigsResponse['cBridge'],
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>,
) {
  const { chains, chainMap } = getChainConfigs(data.configs, data.exclude.chains);
  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs(
    data.configs,
    chainMap,
    nativeCurrencyMap,
    data.exclude.tokens,
  );
  const peggedPairConfigs = getPeggedPairConfigs(
    data,
    chainMap,
    nativeCurrencyMap,
    data.exclude.tokens,
  );
  const burnPairConfigs = getBurnPairConfigs(peggedPairConfigs);

  const relatedMap = getRelatedMap(chains, peggedPairConfigs, chainTokensMap, chainSymbolTokenMap);
  const supportedChains = chains.filter((chain) => relatedMap.has(chain.id));

  return {
    ...createAdapter({
      bridgeType: 'cBridge',
      supportedChains,
      relatedMap,
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

function getChainConfigs(configs: CBridgeTransferConfigs, excludedChains: number[]) {
  const { chains, chain_token, pegged_pair_configs } = configs;

  const filteredChains = chains.filter((chain) => {
    const isExcludedChain = excludedChains.includes(chain.id);
    const hasEnabledToken = chain_token[chain.id]?.token?.some((e) => !e.token.xfer_disabled);
    const hasPeggedToken = pegged_pair_configs.some(
      (e) =>
        (e.org_chain_id === chain.id || e.pegged_chain_id === chain.id) &&
        !e.org_token.token.xfer_disabled &&
        !e.pegged_token.token.xfer_disabled,
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

function getTokenConfigs(
  configs: CBridgeTransferConfigs,
  chainMap: Map<number, CBridgeChain>,
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>,
  excludedTokenMap: Record<number, string[]>,
) {
  const { chain_token } = configs;

  const chainTokensMap = new Map<number, CBridgeToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, CBridgeToken>>();
  Object.entries(chain_token).forEach(([id, { token: tokens }]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isEnabledToken = !token.token.xfer_disabled;
      const isNativeToken = nativeCurrencyMap.get(chainId)?.symbol === token.token.symbol;
      const isExcludedToken = excludedTokenMap?.[chainId]?.includes(token.token.symbol);
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

function getPeggedPairConfigs(
  data: BridgeConfigsResponse['cBridge'],
  chainMap: Map<number, CBridgeChain>,
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>,
  excludedTokenMap: Record<number, string[]>,
) {
  const { pegged_pair_configs } = data.configs;

  const isAvailablePair = (chainId: number, token: CBridgeToken) => {
    const hasChain = chainMap.has(chainId);
    const isEnabledToken = !token.token.xfer_disabled;
    const isNativeToken = nativeCurrencyMap.get(chainId)?.symbol === token.token.symbol;
    const isExcludedToken = excludedTokenMap?.[chainId]?.includes(token.token.symbol);
    return hasChain && isEnabledToken && !isNativeToken && !isExcludedToken;
  };

  const filteredPeggedPairConfigs = pegged_pair_configs.filter(
    (item) =>
      isAvailablePair(item.org_chain_id, item.org_token) &&
      isAvailablePair(item.pegged_chain_id, item.pegged_token),
  );

  return filteredPeggedPairConfigs;
}

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

function getRelatedMap(
  chains: CBridgeChain[],
  peggedPairConfigs: CBridgePeggedPairConfig[],
  chainTokensMap: Map<number, CBridgeToken[]>,
  chainSymbolTokenMap: Map<number, Map<string, CBridgeToken>>,
) {
  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken, isPegged, peggedPair}
  const relatedMap = new Map<number, Map<number, Map<string, BaseTokenPair>>>();

  chains.forEach((fromChain) => {
    chains.forEach((toChain) => {
      if (fromChain.id !== toChain.id) {
        const fromTokens = chainTokensMap.get(fromChain.id) ?? [];

        const relatedTokenMap = new Map<string, BaseTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = chainSymbolTokenMap.get(toChain.id)?.get(fromToken.token.symbol);
          if (toToken) {
            const tokenPair = {
              fromTokenAddress: fromToken.token.address,
              toTokenAddress: toToken.token.address,
              fromToken,
              toToken,
            };
            relatedTokenMap.set(fromToken.token.symbol, tokenPair);
          }
        });

        if (relatedTokenMap.size > 0) {
          if (!relatedMap.has(fromChain.id)) {
            relatedMap.set(fromChain.id, new Map<number, Map<string, BaseTokenPair>>());
          }
          relatedMap.get(fromChain.id)?.set(toChain.id, relatedTokenMap);
        }
      }
    });
  });

  const addPeggedTokenPair = (
    fromChainId: number,
    fromToken: CBridgeToken,
    toChainId: number,
    toToken: CBridgeToken,
    item: CBridgePeggedPairConfig,
  ) => {
    if (!relatedMap.get(fromChainId)?.get(toChainId)?.get(fromToken.token.symbol)) {
      if (!relatedMap.has(fromChainId)) {
        relatedMap.set(fromChainId, new Map<number, Map<string, BaseTokenPair>>());
      }

      const peggedTokenPair = {
        fromTokenAddress: fromToken.token.address,
        toTokenAddress: toToken.token.address,
        fromToken,
        toToken,
        isPegged: true,
        peggedPair: item,
      };

      if (relatedMap.get(fromChainId)?.get(toChainId)) {
        relatedMap.get(fromChainId)?.get(toChainId)?.set(fromToken.token.symbol, peggedTokenPair);
      } else {
        const relatedTokenMap = new Map<string, BaseTokenPair>();
        relatedTokenMap.set(fromToken.token.symbol, peggedTokenPair);
        relatedMap.get(fromChainId)?.set(toChainId, relatedTokenMap);
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

  return relatedMap;
}
