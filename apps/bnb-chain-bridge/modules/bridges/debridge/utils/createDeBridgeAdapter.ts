import { DeBridgeChain, DeBridgeTransferConfigs } from '@/modules/bridges/debridge/types';
import { DeBridgeToken } from '@/modules/bridges/debridge/types';
import { BridgeConfigsResponse, ChainConfig } from '@/modules/bridges';
import { BaseTokenPair, createAdapter } from '@/modules/bridges/main/utils/createAdapter';

export function createDeBridgeAdapter(
  data: BridgeConfigsResponse['deBridge'],
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>,
) {
  const { chains, chainMap } = getChainConfigs(data.configs, data.exclude.chains);
  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs(
    data.configs,
    chainMap,
    nativeCurrencyMap,
    data.exclude.tokens,
  );
  const relatedMap = getRelatedMap(
    chains,
    chainTokensMap,
    chainSymbolTokenMap,
    data.bridgedTokenGroups,
  );
  const supportedChains = chains.filter((chain) => relatedMap.has(chain.chainId));

  return createAdapter({
    bridgeType: 'deBridge',
    supportedChains,
    relatedMap,
    getChainId(chain) {
      return chain.chainId;
    },
    getTokenInfo(token: DeBridgeToken) {
      return {
        name: token.name,
        address: token.address,
        decimal: token.decimals,
        symbol: token.symbol,
      };
    },
  });
}

function getChainConfigs(configs: DeBridgeTransferConfigs, excludedChains: number[] = []) {
  const { chains, chain_token } = configs;

  const filteredChains = chains.filter((chain) => {
    const isExcludedChain = excludedChains.includes(chain.chainId);
    const hasToken = chain_token[chain.chainId]?.length > 0;
    return !isExcludedChain && hasToken;
  });

  const chainMap = new Map<number, DeBridgeChain>();
  filteredChains.forEach((chain) => {
    chainMap.set(chain.chainId, chain);
  });

  return {
    chains: filteredChains,
    chainMap,
  };
}

function getTokenConfigs(
  configs: DeBridgeTransferConfigs,
  chainMap: Map<number, DeBridgeChain>,
  nativeCurrencyMap: Map<number, ChainConfig['nativeCurrency']>,
  excludedTokenMap: Record<number, string[]>,
) {
  const { chain_token } = configs;

  const chainTokensMap = new Map<number, DeBridgeToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, DeBridgeToken>>();
  Object.entries(chain_token).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeCurrencyMap.get(chainId)?.symbol === token.symbol;
      const isExcludedToken = excludedTokenMap?.[chainId]?.includes(token.symbol);
      return !isNativeToken && !isExcludedToken;
    });

    if (filteredTokens.length > 0 && chainMap.has(chainId)) {
      chainSymbolTokenMap.set(chainId, new Map<string, DeBridgeToken>());

      filteredTokens.forEach((token) => {
        chainSymbolTokenMap.get(chainId)?.set(token.symbol, token);
      });

      chainTokensMap.set(chainId, filteredTokens);
    }
  });

  return {
    chainTokensMap,
    chainSymbolTokenMap,
  };
}

function getRelatedMap(
  chains: DeBridgeChain[],
  chainTokensMap: Map<number, DeBridgeToken[]>,
  chainSymbolTokenMap: Map<number, Map<string, DeBridgeToken>>,
  bridgedTokenGroups: string[][],
) {
  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken}
  const relatedMap = new Map<number, Map<number, Map<string, BaseTokenPair>>>();

  const getToToken = (toChainId: number, tokenSymbol: string) => {
    let toToken = chainSymbolTokenMap.get(toChainId)?.get(tokenSymbol);
    if (!toToken) {
      const bridgedGroup = bridgedTokenGroups.find((group) => group.includes(tokenSymbol));
      const otherTokens = bridgedGroup?.filter((item) => item !== tokenSymbol);

      otherTokens?.forEach((symbol) => {
        if (!toToken) {
          toToken = chainSymbolTokenMap.get(toChainId)?.get(symbol);
        }
      });
    }

    return toToken;
  };

  chains.forEach((fromChain) => {
    chains.forEach((toChain) => {
      if (fromChain.chainId !== toChain.chainId) {
        const fromTokens = chainTokensMap.get(fromChain.chainId) ?? [];

        const relatedTokenMap = new Map<string, BaseTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = getToToken(toChain.chainId, fromToken.symbol);

          if (toToken) {
            const tokenPair: BaseTokenPair = {
              fromToken,
              toToken,
              fromTokenAddress: fromToken.address,
              toTokenAddress: toToken.address,
            };
            relatedTokenMap.set(fromToken.symbol, tokenPair);
          }
        });

        if (relatedTokenMap.size > 0) {
          if (!relatedMap.has(fromChain.chainId)) {
            relatedMap.set(fromChain.chainId, new Map<number, Map<string, BaseTokenPair>>());
          }
          relatedMap.get(fromChain.chainId)?.set(toChain.chainId, relatedTokenMap);
        }
      }
    });
  });

  return relatedMap;
}
