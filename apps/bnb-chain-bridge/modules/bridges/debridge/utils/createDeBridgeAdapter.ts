import { DeBridgeChain, DeBridgeTransferConfigs } from '@/modules/bridges/debridge/types';
import { DeBridgeToken } from '@/modules/bridges/debridge/types';
import { BridgeConfigsResponse } from '@/modules/bridges/main';
import { createAdapter } from '@/modules/bridges/main/utils/createAdapter';

export type DeBridgeTokenPair = {
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: DeBridgeToken;
  toToken: DeBridgeToken;
};

export function createDeBridgeAdapter(
  data: BridgeConfigsResponse['deBridge'],
  nativeTokenMap: Map<number, string>,
) {
  const { chains, chainMap } = getChainConfigs(data.configs, data.exclude.chains);
  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs(
    data.configs,
    chainMap,
    nativeTokenMap,
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
    supportedChains,
    relatedMap,
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
  nativeTokenMap: Map<number, string>,
  excludedTokenMap: Record<number, string[]>,
) {
  const { chain_token } = configs;

  const chainTokensMap = new Map<number, DeBridgeToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, DeBridgeToken>>();
  Object.entries(chain_token).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeTokenMap.get(chainId) === token.symbol;
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
  const relatedMap = new Map<number, Map<number, Map<string, DeBridgeTokenPair>>>();

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

        const relatedTokenMap = new Map<string, DeBridgeTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = getToToken(toChain.chainId, fromToken.symbol);

          if (toToken) {
            const tokenPair: DeBridgeTokenPair = {
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
            relatedMap.set(fromChain.chainId, new Map<number, Map<string, DeBridgeTokenPair>>());
          }
          relatedMap.get(fromChain.chainId)?.set(toChain.chainId, relatedTokenMap);
        }
      }
    });
  });

  return relatedMap;
}
