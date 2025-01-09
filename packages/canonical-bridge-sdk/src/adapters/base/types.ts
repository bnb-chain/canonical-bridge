import {
  BridgeType,
  IChainConfig,
  IExternalChain,
  INativeCurrency,
} from '@/shared/types';

export interface ITokenPair<T, P = unknown> {
  fromChainId: number;
  toChainId: number;
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: T;
  toToken: T;
  isPegged?: boolean;
  peggedConfig?: P;
}

export interface IBaseAdapterCommonOptions {
  assetPrefix?: string;
  nativeCurrencies?: Record<number, INativeCurrency>;
  brandChains?: number[];
  externalChains?: IExternalChain[];
  displayTokenSymbols?: Record<number, Record<string, string>>;
  chainConfigs?: IChainConfig[];
}

export interface IBaseAdapterOptions<G>
  extends IBaseAdapterCommonOptions,
    IBridgeProviderOptions<G> {}

export interface IBridgeProviderOptions<T = unknown> {
  config: T;
  enabled?: boolean;
  excludedTokens?: Record<number, string[]>;
  excludedChains?: number[];
}

export interface IBridgeProvider<T = unknown>
  extends IBridgeProviderOptions<T> {
  enabled: boolean;
  id: BridgeType;
}
