import { BridgeConfigsResponse } from '@/src/core';
import { createAdapter } from '@/src/core/utils/createAdapter'; 
import {
  StarGateChain,
  StarGateToken,
  StarGateTransferConfigs,
} from '@/src/stargate/types';

export type StarGateTokenPair = {
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: StarGateToken;
  toToken: StarGateToken;
};

export function createStarGateAdapter(
  data: BridgeConfigsResponse['stargate'],
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

function getChainConfigs(configs: StarGateTransferConfigs, excludedChains: number[] = []) {
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

function getTokenConfigs(
  configs: StarGateTransferConfigs,
  chainMap: Map<number, StarGateChain>,
  nativeTokenMap: Map<number, string>,
  excludedTokenMap: Record<number, string[]>,
) {
  const { tokens } = configs;

  const chainTokensMap = new Map<number, StarGateToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, StarGateToken>>();
  Object.entries(tokens).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeTokenMap.get(chainId) === token.symbol;
      const isExcludedToken = excludedTokenMap?.[chainId]?.includes(token.symbol);
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

function getRelatedMap(
  chains: StarGateChain[],
  chainTokensMap: Map<number, StarGateToken[]>,
  chainSymbolTokenMap: Map<number, Map<string, StarGateToken>>,
  bridgedTokenGroups: string[][],
) {
  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken}
  const relatedMap = new Map<number, Map<number, Map<string, StarGateTokenPair>>>();

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
      if (fromChain.chainId !== toChain.chainId && fromChain.network === toChain.network) {
        const fromTokens = chainTokensMap.get(fromChain.chainId) ?? [];

        const relatedTokenMap = new Map<string, StarGateTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = getToToken(toChain.chainId, fromToken.symbol);

          if (toToken) {
            const tokenPair: StarGateTokenPair = {
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
            relatedMap.set(fromChain.chainId, new Map<number, Map<string, StarGateTokenPair>>());
          }
          relatedMap.get(fromChain.chainId)?.set(toChain.chainId, relatedTokenMap);
        }
      }
    });
  });

  return relatedMap;
}
