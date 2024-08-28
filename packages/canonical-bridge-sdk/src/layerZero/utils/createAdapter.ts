import {
  CreateAdapterParameters,
  NativeCurrency,
  TransferTokenPair,
} from '@/core/types';
import { createBridgeAdapter } from '@/core/utils/createBridgeAdapter';
import {
  LayerZeroChain,
  LayerZeroToken,
  LayerZeroTransferConfigs,
} from '@/layerZero/types';

/**
 * Create a bridge adapter based on provided configurations
 *
 * @param {LayerZeroTransferConfigs}        [configs] LayerZero transfer configs
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
}: CreateAdapterParameters<LayerZeroTransferConfigs>) {
  const { chains, chainMap } = getChainConfigs({ configs, excludedChains });

  const { chainTokensMap, chainSymbolTokenMap } = getTokenConfigs({
    configs,
    chainMap,
    nativeCurrencies,
    excludedTokens,
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
      bridgeType: 'layerZero',
      supportedChains,
      transferMap,
      getChainId(chain: LayerZeroChain) {
        return chain.chainId;
      },
      getTokenInfo(token: LayerZeroToken) {
        return {
          name: '',
          address: token.address,
          decimal: token.decimals,
          symbol: token.symbol,
        };
      },
    }),
  };
}

/**
 * Get available chains
 */
function getChainConfigs(params: {
  configs: LayerZeroTransferConfigs;
  excludedChains: number[];
}) {
  const { configs, excludedChains } = params;
  const { chains, tokens } = configs;

  const filteredChains = chains.filter((chain) => {
    const isExcludedChain = excludedChains.includes(chain.chainId);
    const hasToken = tokens[chain.chainId]?.length > 0;
    return !isExcludedChain && hasToken;
  });

  const chainMap = new Map<number, LayerZeroChain>();
  filteredChains.forEach((chain) => {
    chainMap.set(chain.chainId, chain);
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
  configs: LayerZeroTransferConfigs;
  chainMap: Map<number, LayerZeroChain>;
  excludedTokens: Record<number, string[]>;
  nativeCurrencies: Record<number, NativeCurrency>;
}) {
  const { configs, chainMap, excludedTokens, nativeCurrencies } = params;
  const { tokens } = configs;

  const chainTokensMap = new Map<number, LayerZeroToken[]>();
  const chainSymbolTokenMap = new Map<number, Map<string, LayerZeroToken>>();
  Object.entries(tokens).forEach(([id, tokens]) => {
    const chainId = Number(id);

    const filteredTokens = tokens.filter((token) => {
      const isNativeToken = nativeCurrencies[chainId]?.symbol === token.symbol;
      const isExcludedToken = excludedTokens[chainId]?.includes(token.symbol);
      return !isNativeToken && !isExcludedToken;
    });

    if (filteredTokens.length > 0 && chainMap.has(chainId)) {
      chainSymbolTokenMap.set(chainId, new Map<string, LayerZeroToken>());

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

/**
 * Exhaust all transferable cases and return a transfer map containing all possible transaction paths
 */
function getTransferMap(params: {
  chains: LayerZeroChain[];
  chainTokensMap: Map<number, LayerZeroToken[]>;
  chainSymbolTokenMap: Map<number, Map<string, LayerZeroToken>>;
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
      if (
        fromChain.chainId !== toChain.chainId &&
        fromChain.network === toChain.network
      ) {
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
