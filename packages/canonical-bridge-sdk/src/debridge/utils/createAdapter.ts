import {
  CreateAdapterParameters,
  NativeCurrency,
  TransferTokenPair,
} from '@/core/types';
import { createBridgeAdapter } from '@/core/utils/createBridgeAdapter';
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
  const transferMap = getTransferMap({
    chains,
    chainTokensMap,
    chainSymbolTokenMap,
    bridgedTokenGroups,
  });
  const supportedChains = chains.filter((chain) =>
    transferMap.has(chain.chainId)
  );

  return {
    ...createBridgeAdapter({
      bridgeType: 'deBridge',
      supportedChains,
      transferMap,
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
    }),
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

function getTransferMap(params: {
  chains: DeBridgeChain[];
  chainTokensMap: Map<number, DeBridgeToken[]>;
  chainSymbolTokenMap: Map<number, Map<string, DeBridgeToken>>;
  bridgedTokenGroups: string[][];
}) {
  const { chains, chainTokensMap, chainSymbolTokenMap, bridgedTokenGroups } =
    params;

  // [fromChainId][toChainId][tokenSymbol]{fromToken, toToken}
  const transferMap = new Map<
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

        const transferableTokenMap = new Map<string, TransferTokenPair>();
        fromTokens.forEach((fromToken) => {
          const toToken = getToToken(toChain.chainId, fromToken.symbol);

          if (toToken) {
            const tokenPair: TransferTokenPair = {
              fromToken,
              toToken,
              fromTokenAddress: fromToken.address,
              toTokenAddress: toToken.address,
            };
            transferableTokenMap.set(fromToken.symbol, tokenPair);
          }
        });

        if (transferableTokenMap.size > 0) {
          if (!transferMap.has(fromChain.chainId)) {
            transferMap.set(
              fromChain.chainId,
              new Map<number, Map<string, TransferTokenPair>>()
            );
          }
          transferMap
            .get(fromChain.chainId)
            ?.set(toChain.chainId, transferableTokenMap);
        }
      }
    });
  });

  return transferMap;
}
