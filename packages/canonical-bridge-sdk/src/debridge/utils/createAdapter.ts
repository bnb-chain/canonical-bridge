import {
  CreateAdapterParameters,
  NativeCurrency,
  TransferTokenPair,
} from '@/core/types';
import {
  DeBridgeChain,
  DeBridgeToken,
  DeBridgeTransferConfigs,
} from '@/debridge/types';

export function createAdapter({
  configs,
  excludedChains = [],
  excludedTokens = {},
  nativeCurrencies = {},
  bridgedTokenGroups = [],
}: CreateAdapterParameters<DeBridgeTransferConfigs>) {
  const { chains, chainMap } = getChainConfigs({
    configs,
    excludedChains,
  });
  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs({
    configs,
    chainMap,
    excludedTokens,
    nativeCurrencies,
  });
  const relatedMap = getRelatedMap({
    chains,
    chainTokensMap,
    chainSymbolTokenMap,
    bridgedTokenGroups,
  });
  const supportedChains = chains.filter((chain) =>
    relatedMap.has(chain.chainId)
  );

  return {
    bridgeType: 'deBridge',
    supportedChains,
    relatedMap,
    getChainId(chain: DeBridgeChain) {
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
  };
}

function getChainConfigs(params: {
  configs: DeBridgeTransferConfigs;
  excludedChains: number[];
}) {
  const { configs, excludedChains } = params;
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

function getTokenConfigs(params: {
  configs: DeBridgeTransferConfigs;
  chainMap: Map<number, DeBridgeChain>;
  excludedTokens: Record<number, string[]>;
  nativeCurrencies: Record<number, NativeCurrency>;
}) {
  const { configs, chainMap, excludedTokens, nativeCurrencies } = params;
  const { chain_token } = configs;

  const chainTokensMap = new Map<number, DeBridgeToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, DeBridgeToken>>();
  Object.entries(chain_token).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeCurrencies[chainId]?.symbol === token.symbol;
      const isExcludedToken = excludedTokens[chainId]?.includes(token.symbol);
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

function getRelatedMap(params: {
  chains: DeBridgeChain[];
  chainTokensMap: Map<number, DeBridgeToken[]>;
  chainSymbolTokenMap: Map<number, Map<string, DeBridgeToken>>;
  bridgedTokenGroups: string[][];
}) {
  const { chains, chainTokensMap, chainSymbolTokenMap, bridgedTokenGroups } =
    params;

  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken}
  const relatedMap = new Map<
    number,
    Map<number, Map<string, TransferTokenPair>>
  >();

  const getToToken = (toChainId: number, tokenSymbol: string) => {
    let toToken = chainSymbolTokenMap.get(toChainId)?.get(tokenSymbol);
    if (!toToken) {
      const bridgedGroup = bridgedTokenGroups.find((group) =>
        group.includes(tokenSymbol)
      );
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

        const relatedTokenMap = new Map<string, TransferTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = getToToken(toChain.chainId, fromToken.symbol);

          if (toToken) {
            const tokenPair: TransferTokenPair = {
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
            relatedMap.set(
              fromChain.chainId,
              new Map<number, Map<string, TransferTokenPair>>()
            );
          }
          relatedMap
            .get(fromChain.chainId)
            ?.set(toChain.chainId, relatedTokenMap);
        }
      }
    });
  });

  return relatedMap;
}
