import {
  ICBridgeChain,
  ICBridgePeggedPairConfig,
  ICBridgeToken,
} from '@/adapters/cBridge/types';
import { IDeBridgeChain, IDeBridgeToken } from '@/adapters/deBridge/types';
import { ILayerZeroChain, ILayerZeroToken } from '@/adapters/layerZero/types';
import { IMesonChain, IMesonToken } from '@/adapters/meson/types';
import { IStargateChain, IStargateToken } from '@/adapters/stargate';
import { Chain } from 'viem';

export type ValueOf<T> = T[keyof T];

export type ChainType = 'link' | 'evm' | 'tron' | 'solana';

export type BridgeType =
  | 'cBridge'
  | 'deBridge'
  | 'stargate'
  | 'layerZero'
  | 'meson';

export interface IBridgeChain {
  id: number;
  name: string;
  icon?: string;
  explorerUrl: string;
  tokenUrlPattern: string;
  chainType: ChainType;
  externalBridgeUrl?: string;
  isCompatible: boolean;
  cBridge?: {
    raw?: ICBridgeChain;
  };
  deBridge?: {
    raw?: IDeBridgeChain;
  };
  stargate?: {
    raw?: IStargateChain;
  };
  layerZero?: {
    raw?: ILayerZeroChain;
  };
  meson?: {
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
  isCompatible: boolean;
  isPegged: boolean;
  cBridge?: IBridgeTokenBaseInfo & {
    peggedConfig?: ICBridgePeggedPairConfig;
    raw?: ICBridgeToken;
  };
  deBridge?: IBridgeTokenBaseInfo & {
    raw?: IDeBridgeToken;
  };
  stargate?: IBridgeTokenBaseInfo & {
    raw?: IStargateToken;
  };
  layerZero?: IBridgeTokenBaseInfo & {
    raw?: ILayerZeroToken;
  };
  meson?: IBridgeTokenBaseInfo & {
    raw?: IMesonToken;
  };
}

export interface IBridgeTokenWithBalance extends IBridgeToken {
  balance?: number;
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

export interface IChainBlockExplorer {
  name: string;
  url: string;
  apiUrl?: string | undefined;
  tokenUrlPattern?: string | undefined;
}

export interface IChainConfig extends Chain {
  chainType: ChainType;
  id: number;
  name: string;
  nativeCurrency: INativeCurrency;
  blockExplorers?:
    | {
        [key: string]: IChainBlockExplorer;
        default: IChainBlockExplorer;
      }
    | undefined;
}
