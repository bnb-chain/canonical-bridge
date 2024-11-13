import {
  IBaseAdapterOptions,
  IBridgeTokenBaseInfo,
  IInitialOptions,
  ITransferTokenPair,
} from '@/adapters/base/types';
import {
  BridgeType,
  ChainType,
  IChainConfig,
  IExternalChain,
  INativeCurrency,
} from '@/aggregator/types';
import { isSameAddress } from '@/shared/address';

export abstract class BaseAdapter<G extends object, C = unknown, T = unknown> {
  public abstract bridgeType: BridgeType;

  protected config: G;
  protected excludedChains: number[] = [];
  protected excludedTokens: Record<number, Array<string>> = {};
  protected bridgedTokenGroups: string[][] = [];

  protected assetPrefix: string = '';
  protected includedChains: number[] = [];
  protected nativeCurrencies: Record<number, INativeCurrency> = {};
  protected brandChains: number[] = [];
  protected externalChains: IExternalChain[] = [];
  protected displayTokenSymbols: Record<number, Record<string, string>> = {};

  protected chains: C[] = [];
  protected chainMap = new Map<number, C>();
  protected tokenMap = new Map<number, T[]>();
  protected symbolMap = new Map<number, Map<string, T>>();
  protected transferMap = new Map<
    number,
    Map<number, Map<string, ITransferTokenPair<T>>>
  >();

  constructor(options: IBaseAdapterOptions<G>) {
    this.config = options.config ?? {};
    this.excludedChains = options.excludedChains ?? [];
    this.excludedTokens = options.excludedTokens ?? {};
    this.bridgedTokenGroups = options.bridgedTokenGroups ?? [];
  }

  public init(initialOptions?: IInitialOptions) {
    this.initOptions(initialOptions);
    this.initChains();
    this.initTokens();
    this.initTransferMap();
    this.filterTransferMap();
  }

  protected initOptions(initialOptions?: IInitialOptions) {
    this.assetPrefix = initialOptions?.assetPrefix ?? '';
    this.includedChains = initialOptions?.includedChains ?? [];
    this.nativeCurrencies = initialOptions?.nativeCurrencies ?? {};
    this.brandChains = initialOptions?.brandChains ?? [];
    this.externalChains = initialOptions?.externalChains ?? [];
    this.displayTokenSymbols = initialOptions?.displayTokenSymbols ?? {};
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
      Map<number, Map<string, ITransferTokenPair<T>>>
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
                new Map<number, Map<string, ITransferTokenPair<T>>>()
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

  public abstract getTokenInfo({
    chainId,
    token,
  }: {
    chainId: number;
    token: T;
  }): IBridgeTokenBaseInfo;

  public getChainInfo({
    chainId,
    chainConfig,
  }: {
    chainId: number;
    chainConfig: IChainConfig;
  }) {
    const explorerUrl = chainConfig?.explorer.url?.replace(/\/$/, '') ?? '';
    const tmpUrlPattern = explorerUrl ? `${explorerUrl}/token/{0}` : '';
    const tokenUrlPattern =
      chainConfig?.explorer?.tokenUrlPattern || tmpUrlPattern;

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
      icon: `${this.assetPrefix}/images/chains/${chainId}.png`,
      explorerUrl,
      rpcUrl: chainConfig?.rpcUrl ?? '',
      tokenUrlPattern,
      chainType,
      externalBridgeUrl,
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
        e.toLowerCase() === tokenAddress.toLowerCase()
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
      isSameAddress(address, tokenAddress)
    );

    const displaySymbol = target?.[1] ?? defaultSymbol;
    const iconSymbol = displaySymbol.replace(/[+]$/, '_ICON')?.toUpperCase();
    const icon = `${this.assetPrefix}/images/tokens/${iconSymbol}.png`;

    return {
      displaySymbol,
      icon,
    };
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
    const fromNativeSymbol =
      this.nativeCurrencies[fromChainId]?.symbol?.toUpperCase();
    const toNativeSymbol =
      this.nativeCurrencies[toChainId]?.symbol?.toUpperCase();
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
        group.includes(fromTokenSymbol)
      );
      const nextToken = bridgedGroup?.find(
        (item) => item.toUpperCase() !== fromTokenSymbol
      );
      if (nextToken) {
        toToken = tokenMap?.get(nextToken?.toUpperCase());
      }
    }

    return toToken;
  }

  public getRealTokenSymbol({
    fromChainId,
    toChainId,
    tokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
  }) {
    return tokenSymbol;
  }

  public getChain({ chainId }: { chainId: number }) {
    return this.chainMap.get(chainId);
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
    const realTokenSymbol = this.getRealTokenSymbol({
      fromChainId,
      toChainId,
      tokenSymbol,
    });

    const tokenPair = this.transferMap
      .get(fromChainId)
      ?.get(toChainId)
      ?.get(realTokenSymbol);
    return {
      tokenPair,
    };
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

  public getTokenPairs({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    const tokenPairs: ITransferTokenPair<T, unknown>[] = [];

    const tokenPairsMap = this.transferMap.get(fromChainId)?.get(toChainId);
    tokenPairsMap?.forEach((tokenPair) => {
      tokenPairs.push(tokenPair);
    });

    return tokenPairs;
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

  public isTokenCompatible({
    fromChainId,
    toChainId,
    tokenSymbol,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
  }) {
    const realTokenSymbol = this.getRealTokenSymbol({
      fromChainId,
      toChainId,
      tokenSymbol,
    });

    return !!this.transferMap
      .get(fromChainId)
      ?.get(toChainId)
      ?.get(realTokenSymbol);
  }
}
