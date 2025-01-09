import { IBaseAdapterOptions, ITokenPair } from '@/adapters/base/types';
import { isSameAddress } from '@/shared/address';
import { uniqueArr } from '@/shared/object';
import {
  BridgeType,
  ChainType,
  IBridgeTokenBaseInfo,
  IChainBlockExplorer,
  IChainConfig,
  IExternalChain,
  INativeCurrency,
} from '@/shared/types';

export abstract class BaseAdapter<G extends object, C = unknown, T = unknown> {
  public abstract id: BridgeType;
  protected abstract bridgedTokenGroups: string[][];

  protected options: IBaseAdapterOptions<G>;

  protected config: G;
  protected excludedChains: number[] = [];
  protected excludedTokens: Record<number, Array<string>> = {};

  protected assetPrefix: string = '';
  protected nativeCurrencies: Record<number, INativeCurrency> = {};
  protected brandChains: number[] = [];
  protected externalChains: IExternalChain[] = [];
  protected displayTokenSymbols: Record<number, Record<string, string>> = {};
  protected chainConfigs: IChainConfig[] = [];

  protected chains: C[] = [];
  protected chainMap = new Map<number, C>();
  protected tokenMap = new Map<number, T[]>();
  protected symbolMap = new Map<number, Map<string, T[]>>();
  protected transferMap = new Map<
    number,
    Map<number, Map<string, ITokenPair<T>[]>>
  >();

  constructor(options: IBaseAdapterOptions<G>) {
    this.options = options;
    this.config = options.config ?? {};
    this.excludedChains = options.excludedChains ?? [];
    this.excludedTokens = options.excludedTokens ?? {};

    this.assetPrefix = options?.assetPrefix ?? '';
    this.brandChains = options?.brandChains ?? [];
    this.externalChains = options?.externalChains ?? [];
    this.displayTokenSymbols = options?.displayTokenSymbols ?? {};
    this.chainConfigs = options?.chainConfigs ?? [];
    this.nativeCurrencies = options?.nativeCurrencies ?? {};
  }

  public init() {
    this.initChains();
    this.initTokens();
    this.initTransferMap();
    this.filterTransferMap();
    return this;
  }

  protected abstract initChains(): void;
  protected abstract initTokens(): void;
  protected abstract initTransferMap(): void;

  protected filterTransferMap() {
    if (!this.brandChains.length) {
      return;
    }

    const filteredTransferMap = new Map<
      number,
      Map<number, Map<string, ITokenPair<T>[]>>
    >();

    this.transferMap.forEach((toMap, fromChainId) => {
      if (this.brandChains.includes(fromChainId)) {
        filteredTransferMap.set(fromChainId, toMap);
      } else {
        toMap.forEach((tokenPairMap, toChainId) => {
          if (this.brandChains.includes(toChainId)) {
            if (!filteredTransferMap.has(fromChainId)) {
              filteredTransferMap.set(
                fromChainId,
                new Map<number, Map<string, ITokenPair<T>[]>>()
              );
            }
            filteredTransferMap.get(fromChainId)?.set(toChainId, tokenPairMap);
          }
        });
      }
    });

    this.transferMap = filteredTransferMap;
  }

  public abstract getChainId(chain: C): number;

  public abstract getTokenBaseInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: T;
  }): IBridgeTokenBaseInfo;

  public getChainBaseInfo(chainId: number) {
    const chainConfig = this.chainConfigs.find((e) => e.id === chainId);
    const explorerConfig =
      chainConfig?.blockExplorers?.default ?? ({} as IChainBlockExplorer);

    const explorerUrl = explorerConfig?.url?.replace(/\/$/, '') ?? '';
    const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
    const tokenUrlPattern = explorerConfig?.tokenUrlPattern || tmpUrlPattern;

    const externalConfig = this.externalChains?.find(
      (item) => item.chainId === chainId
    );

    const chainType: ChainType = externalConfig
      ? 'link'
      : chainConfig?.chainType ?? 'evm';
    const externalBridgeUrl = externalConfig?.bridgeUrl;

    return {
      id: chainId,
      name: chainConfig?.name ?? '',
      icon: `${this.assetPrefix}/images/chains/${chainId}.png?v=${__APP_VERSION__}`,
      explorerUrl,
      tokenUrlPattern,
      chainType,
      externalBridgeUrl,
    };
  }

  protected getTokenDisplaySymbolAndIcon({
    chainId,
    defaultSymbol,
    tokenAddress,
  }: {
    chainId: number;
    defaultSymbol: string;
    tokenAddress: string;
  }) {
    const symbolMap = this.displayTokenSymbols[chainId] ?? {};

    const target = Object.entries(symbolMap).find(([address]) =>
      isSameAddress(address, tokenAddress)
    );

    const displaySymbol = target?.[1] ?? defaultSymbol;
    const iconSymbol = displaySymbol?.toUpperCase();
    const icon = `${this.assetPrefix}/images/tokens/${iconSymbol}.png?v=${__APP_VERSION__}`;

    return {
      displaySymbol,
      icon,
    };
  }

  protected getToTokensForPair({
    fromChainId,
    toChainId,
    fromTokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    fromTokenSymbol: string;
  }) {
    const fromNativeSymbol =
      this.nativeCurrencies[fromChainId].symbol.toUpperCase();
    const toNativeSymbol =
      this.nativeCurrencies[toChainId].symbol.toUpperCase();
    const tokenMap = this.symbolMap.get(toChainId);

    const toTokens = [...(tokenMap?.get(fromTokenSymbol) ?? [])];
    if (
      ['ETH', 'WETH'].includes(fromTokenSymbol) &&
      (fromNativeSymbol === 'ETH' || toNativeSymbol === 'ETH') &&
      this.id === 'deBridge'
    ) {
      const ethTokens = tokenMap?.get('ETH') ?? [];
      const wethTokens = tokenMap?.get('WETH') ?? [];

      toTokens.push(...ethTokens);
      toTokens.push(...wethTokens);
    }

    const bridgedGroup = this.bridgedTokenGroups.find((e) =>
      e.includes(fromTokenSymbol)
    );
    bridgedGroup?.forEach((anotherTokenSymbol) => {
      const anotherToTokens = tokenMap?.get(anotherTokenSymbol.toUpperCase());
      if (anotherToTokens?.length) {
        toTokens.push(...anotherToTokens);
      }
    });

    return uniqueArr(toTokens);
  }

  protected getTokenSymbolByTokenAddress({
    chainId,
    tokenAddress,
  }: {
    chainId: number;
    tokenAddress: string;
  }) {
    const tokens = this.tokenMap.get(chainId);

    let baseInfo: IBridgeTokenBaseInfo | undefined;
    const token = tokens?.find((t) => {
      baseInfo = this.getTokenBaseInfo({
        chainId,
        token: t,
      });
      return isSameAddress(baseInfo.address, tokenAddress);
    });

    if (token) {
      return baseInfo?.symbol?.toUpperCase();
    }
  }

  public getChainById(chainId: number) {
    return this.chainMap.get(chainId);
  }

  public getFromChains() {
    const fromChainIds = new Set(this.transferMap.keys());
    const fromChains = this.chains.filter((chain) =>
      fromChainIds.has(this.getChainId(chain))
    );
    return fromChains;
  }

  public getToChains({ fromChainId }: { fromChainId: number }) {
    const toChainIds = new Set(this.transferMap.get(fromChainId)?.keys());
    const toChains = this.chains.filter((chain) =>
      toChainIds.has(this.getChainId(chain))
    );
    return toChains;
  }

  public getAllTokenPairsOnFromChain({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    const all = new Map<string, ITokenPair<T, unknown>[]>();
    this.transferMap.get(fromChainId)?.forEach((toMap) => {
      toMap.forEach((tokenPairs, tokenAddress) => {
        all.set(tokenAddress, tokenPairs);
      });
    });

    // The tokenPairs in `allMap` may not be the `tokenPairs` in the toChain,
    // so it needs to be overwritten
    this.transferMap
      .get(fromChainId)
      ?.get(toChainId)
      ?.forEach((tokenPairs, tokenAddress) => {
        all.set(tokenAddress, tokenPairs);
      });

    return Array.from(all.values());
  }

  public getTokenPairs({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    return this.transferMap
      .get(fromChainId)
      ?.get(toChainId)
      ?.get(tokenAddress?.toLowerCase());
  }

  public getTokenPair({
    fromChainId,
    toChainId,
    fromTokenAddress,
    toTokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    fromTokenAddress: string;
    toTokenAddress: string;
  }) {
    const tokenPairs = this.getTokenPairs({
      fromChainId,
      toChainId,
      tokenAddress: fromTokenAddress,
    });

    return tokenPairs?.find((e) =>
      isSameAddress(e.toTokenAddress, toTokenAddress)
    );
  }

  protected isExcludedToken({
    chainId,
    tokenSymbol,
    tokenAddress,
  }: {
    chainId: number;
    tokenSymbol: string;
    tokenAddress: string;
  }) {
    const excludedTokens = this.excludedTokens[chainId] ?? [];
    return excludedTokens?.some(
      (e) =>
        e.toUpperCase() === tokenSymbol.toUpperCase() ||
        isSameAddress(e, tokenAddress)
    );
  }

  public isToChainCompatible({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    return !!this.transferMap.get(fromChainId)?.get(toChainId);
  }

  public isTokenCompatible(params: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    return !!this.getTokenPairs(params);
  }
}
