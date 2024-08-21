import {
  CreateAdapterParameters,
  NativeCurrency,
  TransferTokenPair,
} from '@/core/types';
import {
  StarGateChain,
  StarGateToken,
  StarGateTransferConfigs,
} from '@/stargate/types';

export function createAdapter({
  configs,
  excludedChains = [],
  excludedTokens = {},
  nativeCurrencies = {},
  bridgedTokenGroups = [],
}: CreateAdapterParameters<StarGateTransferConfigs>) {
  const { chains, chainMap } = getChainConfigs({ configs, excludedChains });

  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs({
    configs,
    chainMap,
    nativeCurrencies,
    excludedTokens,
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
    bridgeType: 'stargate',
    supportedChains,
    relatedMap,
    getChainId(chain: StarGateChain) {
      return chain.chainId;
    },
    getTokenInfo(token: StarGateToken) {
      return {
        name: '',
        address: token.address,
        decimal: token.decimals,
        symbol: token.symbol,
      };
    },
  };
}

function getChainConfigs(params: {
  configs: StarGateTransferConfigs;
  excludedChains: number[];
}) {
  const { configs, excludedChains } = params;
  const { chains, tokens } = configs;

  const filteredChains = chains.filter((chain) => {
    const isExcludedChain = excludedChains.includes(chain.chainId);
    const hasToken = tokens[chain.chainId]?.length > 0;
    return !isExcludedChain && hasToken;
  });

  const chainMap = new Map<number, StarGateChain>();
  filteredChains.forEach((chain) => {
    chainMap.set(chain.chainId, chain);
  });

  return {
    chains: filteredChains,
    chainMap,
  };
}

function getTokenConfigs(params: {
  configs: StarGateTransferConfigs;
  chainMap: Map<number, StarGateChain>;
  excludedTokens: Record<number, string[]>;
  nativeCurrencies: Record<number, NativeCurrency>;
}) {
  const { configs, chainMap, excludedTokens, nativeCurrencies } = params;
  const { tokens } = configs;

  const chainTokensMap = new Map<number, StarGateToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, StarGateToken>>();
  Object.entries(tokens).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeCurrencies[chainId]?.symbol === token.symbol;
      const isExcludedToken = excludedTokens[chainId]?.includes(token.symbol);
      return !isNativeToken && !isExcludedToken;
    });

    if (filteredTokens.length > 0 && chainMap.has(chainId)) {
      chainSymbolTokenMap.set(chainId, new Map<string, StarGateToken>());

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
  chains: StarGateChain[];
  chainTokensMap: Map<number, StarGateToken[]>;
  chainSymbolTokenMap: Map<number, Map<string, StarGateToken>>;
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
      if (
        fromChain.chainId !== toChain.chainId &&
        fromChain.network === toChain.network
      ) {
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
