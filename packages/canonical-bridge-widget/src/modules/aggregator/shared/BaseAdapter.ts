import { Address } from 'viem';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import { IBridgeTokenBaseInfo, IExternalChain, INativeCurrency } from '@/modules/aggregator/types';
import { isSameAddress } from '@/core/utils/address';
import { includesIgnoreCase } from '@/core/utils/string';

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
  includedChains: number[];
  excludedChains?: number[];
  excludedTokens?: Record<number, Array<string | Address>>;
  nativeCurrencies?: Record<number, INativeCurrency>;
  bridgedTokenGroups?: string[][];
  brandChains?: number[];
  externalChains?: IExternalChain[];
  displayTokenSymbols?: Record<number, Record<string, string>>;
  assetPrefix?: string;
}

export abstract class BaseAdapter<G extends object, C = unknown, T = unknown> {
  public abstract bridgeType: BridgeType;

  protected readonly config: G;

  protected readonly includedChains: number[] = [];
  protected readonly excludedChains: number[] = [];
  protected readonly excludedTokens: Record<number, Array<string | Address>> = {};
  protected readonly nativeCurrencies: Record<number, INativeCurrency> = {};
  protected readonly bridgedTokenGroups: string[][] = [];
  protected readonly brandChains: number[] = [];
  protected readonly externalChains: IExternalChain[] = [];
  protected readonly displayTokenSymbols: Record<number, Record<string, string>> = {};
  protected readonly assetPrefix: string;

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
    this.brandChains = options.brandChains ?? [];
    this.externalChains = options.externalChains ?? [];
    this.displayTokenSymbols = options.displayTokenSymbols ?? {};
    this.assetPrefix = options.assetPrefix ?? '';

    this.init();
  }

  protected init() {
    try {
      this.initChains();
      this.initTokens();

      this.initTransferMap();
      this.filterTransferMap();

      this.initFromChains();
      this.initToChains();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to init base adapter', error);
    }
  }

  protected abstract initChains(): void;
  protected abstract initTokens(): void;
  protected abstract initTransferMap(): void;
  protected abstract getChainIdAsObject(chainId: number): unknown;

  public abstract getChainId(chain: C): number;
  public abstract getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: T;
  }): IBridgeTokenBaseInfo;

  protected initFromChains() {
    this.fromChainIds = new Set(this.transferMap.keys());
    this.fromChains = this.chains.filter((chain) => this.fromChainIds.has(this.getChainId(chain)));
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

  protected filterTransferMap() {
    if (!this.brandChains.length) {
      return;
    }

    const filteredTransferMap = new Map<number, Map<number, Map<string, ITransferTokenPair<T>>>>();

    this.transferMap.forEach((toMap, fromChainId) => {
      if (this.brandChains.includes(fromChainId)) {
        filteredTransferMap.set(fromChainId, toMap);
      } else {
        toMap.forEach((tokenPairMap, toChainId) => {
          if (this.brandChains.includes(toChainId)) {
            if (!filteredTransferMap.has(fromChainId)) {
              filteredTransferMap.set(
                fromChainId,
                new Map<number, Map<string, ITransferTokenPair<T>>>(),
              );
            }
            filteredTransferMap.get(fromChainId)?.set(toChainId, tokenPairMap);
          }
        });
      }
    });

    this.transferMap = filteredTransferMap;
  }

  protected filterToChains({
    fromChainId,
    matchedChainIds,
    compatibleChainIds,
    chains,
    tokenSymbol,
  }: {
    fromChainId?: number;
    matchedChainIds: Set<number>;
    compatibleChainIds: Set<number>;
    chains: C[];
    tokenSymbol?: string;
  }) {
    let finalMatchedChainIds = new Set(matchedChainIds);
    let finalCompatibleChainIds = new Set(compatibleChainIds);
    let finalChains = [...chains];

    if (this.brandChains.length && fromChainId) {
      if (this.brandChains.includes(fromChainId)) {
        finalChains = chains.filter((chain) => this.getChainId(chain) !== fromChainId);
      } else {
        finalChains = chains.filter((chain) => this.brandChains.includes(this.getChainId(chain)));
      }
    }

    if (this.externalChains.length && tokenSymbol && fromChainId) {
      this.externalChains.forEach((item) => {
        const targetIndex = finalChains.findIndex(
          (chain) => this.getChainId(chain) === item.chainId,
        );

        if (item.tokens[fromChainId]?.includes(tokenSymbol)) {
          finalMatchedChainIds = new Set([...finalMatchedChainIds, item.chainId]);
          finalCompatibleChainIds = new Set([...finalCompatibleChainIds, item.chainId]);

          if (targetIndex === -1) {
            const chain = this.getChainIdAsObject(item.chainId) as C;
            finalChains.push(chain);
          }
        } else {
          finalMatchedChainIds.delete(item.chainId);
          finalCompatibleChainIds.delete(item.chainId);

          if (targetIndex > -1) {
            finalChains.splice(targetIndex, 1);
          }
        }
      });
    }

    return {
      matchedChainIds: finalMatchedChainIds,
      compatibleChainIds: finalCompatibleChainIds,
      chains: finalChains,
    };
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

  protected getTokenDisplaySymbolAndIcon({
    defaultSymbol,
    chainId,
    tokenAddress,
  }: {
    chainId: number;
    defaultSymbol: string;
    tokenAddress: string;
  }) {
    const symbolMap = this.displayTokenSymbols[chainId] ?? {};

    const target = Object.entries(symbolMap).find(([address]) =>
      isSameAddress(address, tokenAddress),
    );

    const displaySymbol = target?.[1] ?? defaultSymbol;
    const icon = this.formatTokenIcon(displaySymbol);

    return {
      displaySymbol,
      icon,
    };
  }

  protected formatTokenIcon(tokenSymbol: string) {
    const iconSymbol = tokenSymbol.replace(/[+]$/, '_ICON')?.toUpperCase();
    return `${this.assetPrefix}/images/tokens/${iconSymbol}.png`;
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
    const fromNativeSymbol = this.nativeCurrencies[fromChainId]?.symbol?.toUpperCase();
    const toNativeSymbol = this.nativeCurrencies[toChainId]?.symbol?.toUpperCase();
    const tokenMap = this.symbolMap.get(toChainId);

    if (['ETH', 'WETH'].includes(fromTokenSymbol)) {
      if (fromNativeSymbol === 'ETH') {
        if (toNativeSymbol === 'ETH') {
          return tokenMap?.get(fromTokenSymbol);
        } else {
          return tokenMap?.get('ETH') || tokenMap?.get('WETH');
        }
      } else {
        if (toNativeSymbol === 'ETH') {
          return tokenMap?.get('ETH');
        }
      }
    }

    let toToken = tokenMap?.get(fromTokenSymbol);
    if (!toToken) {
      const bridgedGroup = this.bridgedTokenGroups.find((group) =>
        includesIgnoreCase(group, fromTokenSymbol),
      );
      const nextToken = bridgedGroup?.find((item) => item.toUpperCase() !== fromTokenSymbol);
      if (nextToken) {
        toToken = tokenMap?.get(nextToken?.toUpperCase());
      }
    }

    return toToken;
  }

  public getFromChains({ toChainId, tokenSymbol }: { toChainId?: number; tokenSymbol?: string }) {
    let matchedChainIds = new Set<number>();

    if (!toChainId && !tokenSymbol) {
      matchedChainIds = this.fromChainIds;
    }

    if (toChainId && !tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        if (toMap.get(toChainId)) {
          matchedChainIds.add(fromChainId);
        }
      });
    }

    if (!toChainId && tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        toMap.forEach((tokenPairMap) => {
          if (tokenPairMap.get(tokenSymbol)) {
            matchedChainIds.add(fromChainId);
          }
        });
      });
    }

    if (toChainId && tokenSymbol) {
      this.transferMap.forEach((toMap, fromChainId) => {
        if (toMap.get(toChainId)?.get(tokenSymbol)) {
          matchedChainIds.add(fromChainId);
        }
      });
    }

    return {
      matchedChainIds,
      compatibleChainIds: this.fromChainIds,
      chains: this.fromChains,
    };
  }

  public getToChains({ fromChainId, tokenSymbol }: { fromChainId?: number; tokenSymbol?: string }) {
    let matchedChainIds = new Set<number>();

    if (!fromChainId && !tokenSymbol) {
      matchedChainIds = this.toChainIds;
    }

    if (fromChainId && !tokenSymbol) {
      const toMap = this.transferMap.get(fromChainId);
      matchedChainIds = new Set(toMap?.keys());
    }

    if (!fromChainId && tokenSymbol) {
      this.transferMap.forEach((toMap) => {
        toMap.forEach((tokenPairMap, toChainId) => {
          if (tokenPairMap.get(tokenSymbol)) {
            matchedChainIds.add(toChainId);
          }
        });
      });
    }

    if (fromChainId && tokenSymbol) {
      const toMap = this.transferMap.get(fromChainId);
      toMap?.forEach((tokenPairMap, toChainId) => {
        if (tokenPairMap.get(tokenSymbol)) {
          matchedChainIds.add(toChainId);
        }
      });
    }

    let compatibleChainIds = this.toChainIds;
    let toChains = this.fromChains;

    if (fromChainId) {
      const toMap = this.transferMap.get(fromChainId);
      compatibleChainIds = new Set(toMap?.keys());

      const toChainIds = new Set(toMap?.keys());
      toChains = this.chains.filter((c) => toChainIds.has(this.getChainId(c)));
    }

    return this.filterToChains({
      fromChainId,
      matchedChainIds,
      compatibleChainIds,
      chains: toChains,
      tokenSymbol,
    });
  }

  public getTokens({ fromChainId, toChainId }: { fromChainId: number; toChainId: number }) {
    const allTokenPairMap = new Map<string, ITransferTokenPair<T>>();

    const toMap = this.transferMap.get(fromChainId);
    toMap?.forEach((tokenPairMap) => {
      tokenPairMap.forEach((tokenPair, tokenSymbol) => {
        allTokenPairMap.set(tokenSymbol, tokenPair);
      });
    });

    // update info
    const tokenPairMap = this.transferMap.get(fromChainId)?.get(toChainId);
    tokenPairMap?.forEach((tokenPair, tokenSymbol) => {
      allTokenPairMap.set(tokenSymbol, tokenPair);
    });

    const matchedTokens = new Set<string>(tokenPairMap ? tokenPairMap.keys() : []);

    return {
      matchedTokens,
      compatibleTokens: matchedTokens,
      tokenPairs: [...allTokenPairMap.values()],
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
