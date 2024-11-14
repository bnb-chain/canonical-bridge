import {
  INativeCurrency,
  IExternalChain,
  IChainConfig,
} from '@/aggregator/types';

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
  excludedChains?: number[];
  excludedTokens?: Record<number, Array<string>>;
  bridgedTokenGroups?: string[][];
}

export interface IInitialOptions {
  assetPrefix?: string;
  includedChains: number[];
  nativeCurrencies?: Record<number, INativeCurrency>;
  brandChains?: number[];
  externalChains?: IExternalChain[];
  displayTokenSymbols?: Record<number, Record<string, string>>;
  chainConfigs?: IChainConfig[];
}

export interface IBridgeTokenBaseInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displaySymbol: string;
  icon: string;
}
