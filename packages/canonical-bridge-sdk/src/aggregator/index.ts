import {
  IBaseAdapterCommonOptions,
  IBaseAdapterOptions,
  IBridgeProvider,
} from '@/adapters/base/types';
import { CBridgeAdapter } from '@/adapters/cBridge/adapter';
import {
  ICBridgePeggedPairConfig,
  ICBridgeToken,
} from '@/adapters/cBridge/types';
import { DeBridgeAdapter } from '@/adapters/deBridge/adapter';
import { LayerZeroAdapter } from '@/adapters/layerZero/adapter';
import { MesonAdapter } from '@/adapters/meson/adapter';
import { StargateAdapter } from '@/adapters/stargate/adapter';
import { DISPLAY_TOKEN_SYMBOLS } from '@/constants/displayTokenSymbols';
import { isEmpty } from '@/shared/object';
import {
  BridgeType,
  IBridgeChain,
  IBridgeToken,
  INativeCurrency,
  ValueOf,
} from '@/shared/types';

export interface Adapters {
  cBridge: CBridgeAdapter;
  deBridge: DeBridgeAdapter;
  layerZero: LayerZeroAdapter;
  meson: MesonAdapter;
  stargate: StargateAdapter;
}

export interface AggregatorOptions
  extends Omit<IBaseAdapterCommonOptions, 'nativeCurrencies'> {
  providers: IBridgeProvider[];
  chainSorter?: (a: IBridgeChain, b: IBridgeChain) => number;
  tokenSorter?: (a: IBridgeToken, b: IBridgeToken) => number;
}

export class Aggregator {
  private options: AggregatorOptions;
  public adapters: Array<ValueOf<Adapters>> = [];
  public nativeCurrencies: Record<string, INativeCurrency> = {};

  constructor(options: AggregatorOptions) {
    this.options = {
      ...options,
    };

    this.initNativeCurrencies();
    this.initAdapters();
  }

  private initNativeCurrencies() {
    this.nativeCurrencies = {};
    this.options.chainConfigs?.forEach((chain) => {
      if (chain.id && chain.nativeCurrency) {
        this.nativeCurrencies[chain.id] = chain.nativeCurrency;
      }
    });
  }

  private initAdapters() {
    const { providers, chainSorter, tokenSorter, ...customizedOptions } =
      this.options;

    const displayTokenSymbols = isEmpty(customizedOptions.displayTokenSymbols)
      ? DISPLAY_TOKEN_SYMBOLS
      : customizedOptions.displayTokenSymbols;

    this.adapters = providers
      .filter((item) => !!item.config && item.enabled)
      .map((item) => {
        const adapterOptions: IBaseAdapterOptions<any> = {
          ...customizedOptions,
          ...item,
          nativeCurrencies: this.nativeCurrencies,
          displayTokenSymbols,
        };

        switch (item.id) {
          case 'cBridge':
            return new CBridgeAdapter(adapterOptions).init();
          case 'deBridge':
            return new DeBridgeAdapter(adapterOptions).init();
          case 'layerZero':
            return new LayerZeroAdapter(adapterOptions).init();
          case 'meson':
            return new MesonAdapter(adapterOptions).init();
          default:
            return new StargateAdapter(adapterOptions).init();
        }
      });
  }

  public getAdapter<P extends BridgeType>(id: P) {
    return this.adapters.find((item) => item.id === id) as
      | Adapters[P]
      | undefined;
  }

  public getNativeCurrency(chainId?: number) {
    if (!chainId) return;
    return this.nativeCurrencies?.[chainId];
  }

  public getFromChains() {
    const chainMap = new Map<number, IBridgeChain>();

    this.adapters.forEach((adapter) => {
      const fromChains = adapter.getFromChains();

      fromChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);
        const baseInfo = adapter.getChainBaseInfo(chainId);

        let bridgeChain = chainMap.get(chainId);
        bridgeChain = {
          ...(bridgeChain ?? baseInfo),
          isCompatible: true,
        };

        chainMap.set(chainId, bridgeChain);
      });
    });

    const chains = Array.from(chainMap.values());

    return chains.sort((a, b) => {
      return this.options.chainSorter?.(a, b) ?? 0;
    });
  }

  public getToChains({ fromChainId }: { fromChainId: number }) {
    const chainMap = new Map<number, IBridgeChain>();

    this.adapters.forEach((adapter) => {
      const toChains = adapter.getToChains({
        fromChainId,
      });

      toChains.forEach((item: any) => {
        const chainId = adapter.getChainId(item);
        const baseInfo = adapter.getChainBaseInfo(chainId);

        let bridgeChain = chainMap.get(chainId);

        const isCompatible =
          bridgeChain?.isCompatible ||
          adapter.isToChainCompatible({
            fromChainId,
            toChainId: chainId,
          });

        bridgeChain = {
          ...(bridgeChain ?? baseInfo),
          isCompatible,
        };

        chainMap.set(chainId, bridgeChain);
      });
    });

    const chains = Array.from(chainMap.values());
    return chains.sort((a, b) => {
      return this.options.chainSorter?.(a, b) ?? 0;
    });
  }

  public getTokens({
    fromChainId,
    toChainId,
  }: {
    fromChainId: number;
    toChainId: number;
  }) {
    const tokenMap = new Map<string, IBridgeToken>();

    this.adapters.forEach((adapter) => {
      const allTokenPairs = adapter.getAllTokenPairsOnFromChain({
        fromChainId,
        toChainId,
      });

      allTokenPairs.forEach((item: any[]) => {
        const tokenPair = item[0];
        const baseInfo = adapter.getTokenBaseInfo({
          chainId: fromChainId,
          token: tokenPair.fromToken, // fromToken
        });

        const addressKey = baseInfo.address.toLowerCase();
        let bridgeToken = tokenMap.get(addressKey);

        const isCompatible =
          bridgeToken?.isCompatible ||
          adapter.isTokenCompatible({
            fromChainId,
            toChainId,
            tokenAddress: baseInfo.address,
          });

        const isPegged = bridgeToken?.isPegged || !!tokenPair.isPegged;

        bridgeToken = {
          ...(bridgeToken ?? baseInfo),
          isCompatible,
          isPegged,
        };

        tokenMap.set(addressKey, bridgeToken);
      });
    });

    const tokens = Array.from(tokenMap.values());
    return tokens.sort((a, b) => {
      return this.options.tokenSorter?.(a, b) ?? 0;
    });
  }

  public getToTokens({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    const tokenMap = new Map<string, IBridgeToken>();

    this.adapters.forEach((adapter) => {
      const tokenPairs = adapter.getTokenPairs({
        fromChainId,
        toChainId,
        tokenAddress,
      });
      if (tokenPairs) {
        tokenPairs.forEach((item: any) => {
          const baseInfo = adapter.getTokenBaseInfo({
            chainId: fromChainId,
            token: item.toToken, // toToken
          });

          const addressKey = baseInfo.address.toLowerCase();
          let bridgeToken = tokenMap.get(addressKey);

          const isPegged = bridgeToken?.isPegged || !!item.isPegged;

          bridgeToken = {
            ...(bridgeToken ?? baseInfo),
            isCompatible: true,
            isPegged,
          };

          tokenMap.set(addressKey, bridgeToken);
        });
      }
    });

    const tokens = Array.from(tokenMap.values());
    return tokens.sort((a, b) => {
      return this.options.tokenSorter?.(a, b) ?? 0;
    });
  }

  public getFromChainDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let chainDetail: IBridgeChain | undefined;

    this.adapters.forEach((adapter) => {
      const tokenPairs = adapter.getTokenPairs({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPairs) {
        const baseInfo = adapter.getChainBaseInfo(fromChainId);

        chainDetail = {
          ...(chainDetail ?? baseInfo),
          isCompatible: true,
          [adapter.id]: {
            raw: adapter.getChainById(fromChainId),
          },
        };
      }
    });

    return chainDetail;
  }

  public getToChainDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let chainDetail: IBridgeChain | undefined;

    this.adapters.forEach((adapter) => {
      const tokenPairs = adapter.getTokenPairs({
        fromChainId,
        toChainId,
        tokenAddress,
      });

      if (tokenPairs) {
        const baseInfo = adapter.getChainBaseInfo(toChainId);

        const isCompatible =
          chainDetail?.isCompatible ||
          adapter.isToChainCompatible({
            fromChainId,
            toChainId,
          });

        chainDetail = {
          ...(chainDetail ?? baseInfo),
          isCompatible,
          [adapter.id]: {
            raw: adapter.getChainById(toChainId),
          },
        };
      }
    });

    return chainDetail;
  }

  public getTokenDetail({
    fromChainId,
    toChainId,
    tokenAddress,
  }: {
    fromChainId: number;
    toChainId: number;
    tokenAddress: string;
  }) {
    let tokenDetail: IBridgeToken | undefined;

    this.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPairs({
        fromChainId,
        toChainId,
        tokenAddress,
      })?.[0];

      if (tokenPair) {
        const baseInfo = adapter.getTokenBaseInfo({
          chainId: fromChainId,
          token: tokenPair.fromToken as any,
        });

        const isCompatible =
          tokenDetail?.isCompatible ||
          adapter.isTokenCompatible({
            fromChainId,
            toChainId,
            tokenAddress,
          });

        const isPegged = tokenDetail?.isPegged || !!tokenPair.isPegged;

        tokenDetail = {
          ...(tokenDetail ?? baseInfo),
          isPegged,
          isCompatible,
        };

        if (adapter.id === 'cBridge' && tokenPair.peggedConfig) {
          tokenDetail.cBridge = {
            ...baseInfo,
            peggedConfig: tokenPair.peggedConfig as ICBridgePeggedPairConfig,
            raw: tokenPair.fromToken as ICBridgeToken,
          };
        } else {
          tokenDetail = {
            ...tokenDetail,
            [adapter.id]: {
              ...baseInfo,
              raw: tokenPair.fromToken,
            },
          };
        }
      }
    });

    return tokenDetail;
  }

  public getToTokenDetail({
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
    let tokenDetail: IBridgeToken | undefined;

    this.adapters.forEach((adapter) => {
      const tokenPair = adapter.getTokenPair({
        fromChainId,
        toChainId,
        fromTokenAddress,
        toTokenAddress,
      });

      if (tokenPair) {
        const baseInfo = adapter.getTokenBaseInfo({
          chainId: toChainId,
          token: tokenPair.toToken as any,
        });

        const isPegged = tokenDetail?.isPegged || !!tokenPair.isPegged;

        tokenDetail = {
          ...(tokenDetail ?? baseInfo),
          isPegged,
          isCompatible: true,
        };

        if (adapter.id === 'cBridge' && tokenPair.peggedConfig) {
          tokenDetail.cBridge = {
            ...baseInfo,
            peggedConfig: tokenPair.peggedConfig as ICBridgePeggedPairConfig,
            raw: tokenPair.toToken as ICBridgeToken,
          };
        } else {
          tokenDetail = {
            ...tokenDetail,
            [adapter.id]: {
              ...baseInfo,
              raw: tokenPair.toToken,
            },
          };
        }
      }
    });

    return tokenDetail;
  }
}
