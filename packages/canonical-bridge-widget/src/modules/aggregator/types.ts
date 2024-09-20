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
    raw?: ICBridgeChain;
  };
  deBridge?: {
    isCompatible: boolean;
    raw?: IDeBridgeChain;
  };
  stargate?: {
    isCompatible: boolean;
    raw?: IStargateChain;
  };
  layerZero?: {
    isCompatible: boolean;
    raw?: ILayerZeroChain;
  };
}

export interface IBridgeToken {
  name: string;
  icon?: string;
  address: string;
  symbol: string;
  decimals: number;
  isPegged: boolean;
  displaySymbol: string;
  cBridge?: {
    isCompatible: boolean;
    symbol: string;
    raw?: ICBridgeToken;
    peggedConfig?: ICBridgePeggedPairConfig;
  };
  deBridge?: {
    isCompatible: boolean;
    symbol: string;
    raw?: IDeBridgeToken;
  };
  stargate?: {
    isCompatible: boolean;
    symbol: string;
    raw?: IStargateToken;
  };
  layerZero?: {
    isCompatible: boolean;
    symbol: string;
    raw?: ILayerZeroToken;
  };
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
  order: {
    chains: number[];
    tokens: string[];
  };
  displayTokenSymbols: Record<number, Record<string, string>>;
  chainConfigs: IChainConfig[];
  brandChains?: number[];
  externalChains?: IExternalChain[];
  cBridge: {
    config: ICBridgeTransferConfig;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: string[][];
  };
  deBridge: {
    config: IDeBridgeTransferConfig;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: string[][];
  };
  stargate: {
    config: IStargateTransferConfig;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: string[][];
  };
  layerZero: {
    config: ILayerZeroTransferConfig;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: string[][];
  };
}

export interface IChainConfig {
  id: number;
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
}

export type ChainType = 'link' | 'evm';

export type AdapterConstructorType =
  | typeof CBridgeAdapter
  | typeof DeBridgeAdapter
  | typeof StargateAdapter
  | typeof LayerZeroAdapter;

export type AdapterType = CBridgeAdapter | DeBridgeAdapter | StargateAdapter | LayerZeroAdapter;
