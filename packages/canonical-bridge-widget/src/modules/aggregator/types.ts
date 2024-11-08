import { CBridgeAdapter } from '@/modules/aggregator/adapters/cBridge/CBridgeAdapter';
import {
  ICBridgeChain,
  ICBridgePeggedPairConfig,
  ICBridgeToken,
  ICBridgeTransferConfig,
} from '@/modules/aggregator/adapters/cBridge/types';
import { DeBridgeAdapter } from '@/modules/aggregator/adapters/deBridge/DeBridgeAdapter';
import {
  IDeBridgeChain,
  IDeBridgeToken,
  IDeBridgeTransferConfig,
} from '@/modules/aggregator/adapters/deBridge/types';
import { LayerZeroAdapter } from '@/modules/aggregator/adapters/layerZero/LayerZeroAdapter';
import {
  ILayerZeroChain,
  ILayerZeroToken,
  ILayerZeroTransferConfig,
} from '@/modules/aggregator/adapters/layerZero/types';
import { StargateAdapter } from '@/modules/aggregator/adapters/stargate/StargateAdapter';
import {
  IStargateChain,
  IStargateToken,
  IStargateTransferConfig,
} from '@/modules/aggregator/adapters/stargate/types';
import { IMesonChain, IMesonToken } from '@/modules/aggregator/adapters/meson/types';
import { MesonAdapter } from '@/modules/aggregator/adapters/meson/MesonAdapter';

export interface IBridgeChain {
  id: number;
  name: string;
  icon?: string;
  explorerUrl: string;
  rpcUrl: string;
  tokenUrlPattern: string;
  chainType: ChainType;
  externalBridgeUrl?: string;
  cBridge?: {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: ICBridgeChain;
  };
  deBridge?: {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IDeBridgeChain;
  };
  stargate?: {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IStargateChain;
  };
  layerZero?: {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: ILayerZeroChain;
  };
  meson?: {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IMesonChain;
  };
}

export interface IBridgeTokenBaseInfo {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
  displaySymbol: string;
  icon: string;
}

export interface IBridgeToken extends IBridgeTokenBaseInfo {
  isPegged: boolean;
  cBridge?: IBridgeTokenBaseInfo & {
    isCompatible: boolean;
    isMatched: boolean;
    peggedConfig?: ICBridgePeggedPairConfig;
    raw?: ICBridgeToken;
  };
  deBridge?: IBridgeTokenBaseInfo & {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IDeBridgeToken;
  };
  stargate?: IBridgeTokenBaseInfo & {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IStargateToken;
  };
  layerZero?: IBridgeTokenBaseInfo & {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: ILayerZeroToken;
  };
  meson?: IBridgeTokenBaseInfo & {
    isCompatible: boolean;
    isMatched: boolean;
    raw?: IMesonToken;
  };
}

export interface IBridgeTokenWithBalance extends IBridgeToken {
  balance?: string;
  value?: number;
}

export interface INativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface IExternalChain {
  chainId: number;
  bridgeUrl: string;
  tokens: Record<number, string[]>;
}

export interface ITransferConfig {
  defaultSelectedInfo: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
    amount: string;
  };
  order?: {
    chains?: number[];
    tokens?: string[];
  };
  displayTokenSymbols: Record<number, Record<string, string>>;
  brandChains?: number[];
  externalChains?: IExternalChain[];
  cBridge?: {
    config: ICBridgeTransferConfig;
    exclude: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  deBridge?: {
    config: IDeBridgeTransferConfig;
    exclude: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  stargate?: {
    config: IStargateTransferConfig;
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  layerZero?: {
    config: ILayerZeroTransferConfig;
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  meson?: {
    config: IMesonChain[];
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
}

export interface IChainConfig {
  id: number | string;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorer: {
    name: string;
    url: string;
    tokenUrlPattern?: string;
  };
  contracts?: any;
  chainType?: ChainType;
}

export type ChainType = 'link' | 'evm' | 'tron';

export type AdapterConstructorType =
  | typeof CBridgeAdapter
  | typeof DeBridgeAdapter
  | typeof StargateAdapter
  | typeof LayerZeroAdapter
  | typeof MesonAdapter;

export type AdapterType =
  | CBridgeAdapter
  | DeBridgeAdapter
  | StargateAdapter
  | LayerZeroAdapter
  | MesonAdapter;
