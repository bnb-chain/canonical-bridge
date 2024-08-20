import { isSameAddress } from '@/core/utils/address';
import { BridgeType } from '@/modules/bridges/main/types';

export interface GetSupportedFromChainsParams {
  toChainId?: number;
}

export interface GetSupportedToChainsParams {
  fromChainId?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
}

export interface GetSupportedTokensParams {
  fromChainId?: number;
  toChainId?: number;
}

export interface GetSelectedTokenPairParams {
  fromChainId?: number;
  toChainId?: number;
  tokenSymbol?: string;
  tokenAddress?: string;
}

export interface BaseTokenPair {
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: any;
  toToken: any;
  isPegged?: boolean;
  peggedPair?: any;
}

export interface BaseTokenInfo {
  name: string;
  symbol: string;
  address: string;
  decimal: number;
}

interface CreateAdapterParams<T, P extends BaseTokenPair> {
  bridgeType: BridgeType;
  supportedChains: T[];
  relatedMap: Map<number, Map<number, Map<string, P>>>;
  getChainId: (chain: any) => number;
  getTokenInfo: (token: any) => BaseTokenInfo;
}

export type CreateAdapterFuncReturnType = ReturnType<typeof createAdapter>;

export function createAdapter<T, P extends BaseTokenPair>(params: CreateAdapterParams<T, P>) {
  const { supportedChains, relatedMap, ...restParams } = params;

  const supportedChainIds = new Set(relatedMap.keys());

  return {
    isSelfChainId(chainId: number) {
      return supportedChainIds.has(chainId);
    },

    getSupportedFromChains(params: GetSupportedFromChainsParams) {
      const { toChainId } = params;

      if (toChainId) {
        if (this.isSelfChainId(toChainId)) {
          const availableChainIds = new Set<number>();
          relatedMap.forEach((toMap, fromChainId) => {
            if (toMap.has(toChainId)) {
              availableChainIds.add(fromChainId);
            }
          });

          return {
            availableChainIds,
            chains: supportedChains,
          };
        } else {
          return {
            availableChainIds: new Set<number>(),
            chains: supportedChains,
          };
        }
      } else {
        return {
          availableChainIds: supportedChainIds,
          chains: supportedChains,
        };
      }
    },

    getSupportedToChains(params: GetSupportedToChainsParams) {
      const { fromChainId, tokenSymbol, tokenAddress } = params;

      if (fromChainId) {
        if (this.isSelfChainId(fromChainId)) {
          if (tokenSymbol && tokenAddress) {
            const availableChainIds = new Set<number>();
            const toMap = relatedMap.get(fromChainId);
            toMap?.forEach((tokenPairMap, toChainId) => {
              const tokenPair = tokenPairMap.get(tokenSymbol);
              if (isSameAddress(tokenPair?.fromTokenAddress, tokenAddress)) {
                availableChainIds.add(toChainId);
              }
            });

            return {
              availableChainIds,
              chains: supportedChains,
            };
          } else {
            const toChainIds = relatedMap.get(fromChainId)?.keys() ?? [];
            const availableChainIds = new Set([...toChainIds]);
            return {
              availableChainIds,
              chains: supportedChains,
            };
          }
        } else {
          return {
            availableChainIds: new Set<number>(),
            chains: supportedChains,
          };
        }
      } else {
        return {
          availableChainIds: supportedChainIds,
          chains: supportedChains,
        };
      }
    },

    getSupportedTokens(params: GetSupportedTokensParams) {
      const { fromChainId, toChainId } = params;

      if (!fromChainId || !this.isSelfChainId(fromChainId)) {
        return {
          availableTokens: new Set<string>(),
          tokenPairs: [],
        };
      }

      const pickMap = new Map<string, P>();

      const toMap = relatedMap.get(fromChainId);
      toMap?.forEach((tokenPairMap) => {
        tokenPairMap.forEach((tokenPair, symbol) => {
          pickMap.set(symbol, tokenPair);
        });
      });

      const tokenPairs = [...pickMap.values()];

      if (toChainId) {
        if (this.isSelfChainId(toChainId)) {
          const tokenPairMap = relatedMap.get(fromChainId)?.get(toChainId);
          const availableTokens = new Set<string>(tokenPairMap ? tokenPairMap.keys() : []);

          tokenPairMap?.forEach((tokenPair, symbol) => {
            pickMap.set(symbol, tokenPair);
          });

          const tokenPairs = [...pickMap.values()];

          return {
            availableTokens,
            tokenPairs,
          };
        } else {
          return {
            availableTokens: new Set<string>(),
            tokenPairs,
          };
        }
      } else {
        return {
          availableTokens: new Set([...pickMap.keys()]),
          tokenPairs,
        };
      }
    },

    getSelectedTokenPair(params: GetSelectedTokenPairParams) {
      const { fromChainId, toChainId, tokenSymbol, tokenAddress } = params;

      if (
        !fromChainId ||
        !toChainId ||
        !tokenSymbol ||
        !tokenAddress ||
        !this.isSelfChainId(fromChainId) ||
        !this.isSelfChainId(toChainId)
      ) {
        return {
          tokenPair: undefined,
        };
      }

      const tokenPair = relatedMap.get(fromChainId)?.get(toChainId)?.get(tokenSymbol);
      if (isSameAddress(tokenPair?.fromTokenAddress, tokenAddress)) {
        return {
          tokenPair,
        };
      }

      return {
        tokenPair: undefined,
      };
    },

    ...restParams,
  };
}
