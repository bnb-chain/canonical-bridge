import { Address } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { INativeCurrency } from '@/modules/aggregator/types';
import { isBSC, isOpBNB } from '@/core/utils/chains';
import { BSC_CHAIN_ID, OP_BNB_CHAIN_ID, OP_BNB_SUPPORTED_TOKENS } from '@/core/constants';
import { intersectionSet } from '@/core/utils/common';

export interface ITransferTokenPair<T, P = unknown> {
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: T;
  toToken: T;
  isPegged?: boolean;
  peggedConfig?: P;
}

export interface IBaseAdapterOptions<G> {
  config: G;
  includedChains?: number[];
  excludedChains?: number[];
  excludedTokens?: Record<number, Array<string | Address>>;
  nativeCurrencies?: Record<number, INativeCurrency>;
  bridgedTokenGroups?: string[][];
}

export abstract class BaseAdapter<G extends object, C = unknown, T = unknown> {
  public abstract bridgeType: BridgeType;

  protected readonly config: G;

  protected readonly includedChains: number[] = [];
  protected readonly excludedChains: number[] = [];
  protected readonly excludedTokens: Record<number, Array<string | Address>> = {};
  protected readonly nativeCurrencies: Record<number, INativeCurrency> = {};
  protected readonly bridgedTokenGroups: string[][] = [];

  protected chains: C[] = [];
  protected chainMap = new Map<number, C>();

  protected tokenMap = new Map<number, T[]>();
  protected symbolMap = new Map<number, Map<string, T>>();

  protected transferMap = new Map<number, Map<number, Map<string, ITransferTokenPair<T>>>>();

  protected fromChainIds = new Set<number>();
  protected fromChains: C[] = [];
  protected toChainIds = new Set<number>();
  protected toChains: C[] = [];

  constructor(options: IBaseAdapterOptions<G>) {
    this.config = options.config ?? {};

    this.includedChains = options.includedChains ?? [];
    this.excludedChains = options.excludedChains ?? [];
    this.excludedTokens = options.excludedTokens ?? {};
    this.nativeCurrencies = options.nativeCurrencies ?? {};
    this.bridgedTokenGroups = options.bridgedTokenGroups ?? [];

    this.init();
  }

  protected init() {
    this.initChains();
    this.initTokens();

    this.initTransferMap();
    this.filterTransferMap();

    this.initFromChains();
    this.initToChains();
  }

  protected abstract initChains(): void;
  protected abstract initTokens(): void;
  protected abstract initTransferMap(): void;

  protected initFromChains() {
    this.fromChainIds = new Set(this.transferMap.keys());
    this.fromChains = this.chains.filter((chain) => this.transferMap.has(this.getChainId(chain)));
  }

  protected initToChains() {
    this.toChainIds = new Set<number>();
    this.transferMap.forEach((toMap) => {
      toMap.forEach((_, toChainId) => {
        this.toChainIds.add(toChainId);
      });
    });
    this.toChains = this.chains.filter((chain) => this.toChainIds.has(this.getChainId(chain)));
  }

  protected getTransferMap() {
    return this.transferMap;
  }

  protected filterTransferMap() {
    const filteredTransferMap = new Map<number, Map<number, Map<string, ITransferTokenPair<T>>>>();

    this.transferMap.forEach((toMap, fromChainId) => {
      if (isBSC(fromChainId)) {
        filteredTransferMap.set(fromChainId, toMap);
      } else {
        const tokenPairMap = toMap.get(BSC_CHAIN_ID);

        if (tokenPairMap) {
          if (!filteredTransferMap.has(fromChainId)) {
            filteredTransferMap.set(
              fromChainId,
              new Map<number, Map<string, ITransferTokenPair<T>>>(),
            );
          }
          filteredTransferMap.get(fromChainId)?.set(BSC_CHAIN_ID, tokenPairMap);
        }
      }
    });

    this.transferMap = filteredTransferMap;
  }

  protected filterToChains(params: {
    fromChainId: number;
    compatibleChainIds: Set<number>;
    chains: C[];
    tokenSymbol?: string;
  }) {
    const { fromChainId, compatibleChainIds, chains, tokenSymbol } = params;

    if (isBSC(fromChainId)) {
      if (tokenSymbol && OP_BNB_SUPPORTED_TOKENS.includes(tokenSymbol)) {
        return {
          compatibleChainIds: new Set([...compatibleChainIds, OP_BNB_CHAIN_ID]),
          chains: chains.filter((chain) => !isBSC(this.getChainId(chain))),
        };
      }

      return {
        compatibleChainIds,
        chains: chains.filter(
          (chain) => !isBSC(this.getChainId(chain)) && !isOpBNB(this.getChainId(chain)),
        ),
      };
    } else {
      return {
        compatibleChainIds: intersectionSet(compatibleChainIds, new Set([BSC_CHAIN_ID])),
        chains: chains.filter((chain) => isBSC(this.getChainId(chain))),
      };
    }
  }

  protected checkIsExcludedToken({
    excludedList,
    tokenSymbol,
    tokenAddress,
  }: {
    excludedList: string[];
    tokenSymbol: string;
    tokenAddress: string;
  }) {
    return excludedList?.some(
      (e) =>
        e.toUpperCase() === tokenSymbol.toUpperCase() ||
        e.toLowerCase() === tokenAddress.toLowerCase(),
    );
  }

  // 1. Native currency is ETH -> Native currency is ETH, all transfer to ETH
  // 2. Native currency is ETH -> Native currency is NOT ETH, transfer to ETH first, if not, WETH
  // 3. Native currency is NOT ETH -> Native currency is ETH, all transfer to ETH
  protected getToToken({
    fromChainId,
    toChainId,
    fromTokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    fromTokenSymbol: string;
  }) {
    const fromNativeSymbol = this.nativeCurrencies[fromChainId].symbol?.toUpperCase();
    const toNativeSymbol = this.nativeCurrencies[toChainId].symbol?.toUpperCase();

    if (['ETH', 'WETH'].includes(fromTokenSymbol)) {
      if (fromNativeSymbol === 'ETH') {
        if (toNativeSymbol === 'ETH') {
          return this.symbolMap.get(toChainId)?.get(fromTokenSymbol);
        } else {
          return (
            this.symbolMap.get(toChainId)?.get('ETH') || this.symbolMap.get(toChainId)?.get('WETH')
          );
        }
      } else {
        if (toNativeSymbol === 'ETH') {
          return this.symbolMap.get(toChainId)?.get('ETH');
        }
      }
    }

    let toToken = this.symbolMap.get(toChainId)?.get(fromTokenSymbol);
    if (!toToken) {
      const bridgedGroup = this.bridgedTokenGroups.find((group) => group.includes(fromTokenSymbol));
      const otherTokens = bridgedGroup?.filter((item) => item.toUpperCase() !== fromTokenSymbol);

      otherTokens?.forEach((symbol) => {
        if (!toToken) {
          toToken = this.symbolMap.get(toChainId)?.get(symbol?.toUpperCase());
        }
      });
    }

    return toToken;
  }

  public abstract getChainId(chain: C): number;

  public abstract getTokenInfo(token: T): {
    symbol: string;
    name: string;
    address: string;
    decimals: number;
  };

  public getFromChains({ toChainId, tokenSymbol }: { toChainId?: number; tokenSymbol?: string }) {
    let compatibleChainIds = new Set<number>();

    if (!toChainId && !tokenSymbol) {
      compatibleChainIds = this.fromChainIds;
    }

    if (toChainId && !tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        if (toMap.get(toChainId)) {
          compatibleChainIds.add(fromChainId);
        }
      });
    }

    if (!toChainId && tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        toMap.forEach((tokenPairMap) => {
          if (tokenPairMap.get(tokenSymbol)) {
            compatibleChainIds.add(fromChainId);
          }
        });
      });
    }

    if (toChainId && tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        if (toMap.get(toChainId)?.get(tokenSymbol)) {
          compatibleChainIds.add(fromChainId);
        }
      });
    }

    return {
      compatibleChainIds,
      chains: this.fromChains,
    };
  }

  public getToChains({ fromChainId, tokenSymbol }: { fromChainId?: number; tokenSymbol?: string }) {
    let compatibleChainIds = new Set<number>();

    if (!fromChainId && !tokenSymbol) {
      compatibleChainIds = this.toChainIds;
    }

    if (fromChainId && !tokenSymbol) {
      const toMap = this.transferMap.get(fromChainId);
      compatibleChainIds = new Set(toMap?.keys());
    }

    if (!fromChainId && tokenSymbol) {
      this.transferMap.forEach((toMap) => {
        toMap.forEach((tokenPairMap, toChainId) => {
          if (tokenPairMap.get(tokenSymbol)) {
            compatibleChainIds.add(toChainId);
          }
        });
      });
    }

    if (fromChainId && tokenSymbol) {
      const toMap = this.transferMap.get(fromChainId);
      toMap?.forEach((tokenPairMap, toChainId) => {
        if (tokenPairMap.get(tokenSymbol)) {
          compatibleChainIds.add(toChainId);
        }
      });
    }

    return {
      compatibleChainIds,
      chains: this.toChains,
    };
  }

  public getTokens({ fromChainId, toChainId }: { fromChainId: number; toChainId: number }) {
    const compatibleTokens = new Set<string>();

    const toMap = this.transferMap.get(fromChainId);
    const tokenPairMap = toMap?.get(toChainId);
    tokenPairMap?.forEach((_, tokenSymbol) => {
      compatibleTokens.add(tokenSymbol);
    });

    let tokenPairs: ITransferTokenPair<T>[] = [];
    if (tokenPairMap) {
      tokenPairs = [...tokenPairMap?.values()];
    }

    return {
      compatibleTokens,
      tokenPairs,
    };
  }

  public getTokenPair({
    fromChainId,
    toChainId,
    tokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
  }) {
    const tokenPair = this.transferMap.get(fromChainId)?.get(toChainId)?.get(tokenSymbol);
    return {
      tokenPair,
    };
  }
}
