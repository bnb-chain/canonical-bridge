import { IBridgeTokenBaseInfo } from '@/adapters/base/types';
import {
  ICBridgeChain,
  ICBridgePeggedPairConfig,
  ICBridgeToken,
} from '@/adapters/cBridge/types';
import { IDeBridgeChain, IDeBridgeToken } from '@/adapters/deBridge/types';
import { ILayerZeroChain, ILayerZeroToken } from '@/adapters/layerZero/types';
import { IMesonChain, IMesonToken } from '@/adapters/meson/types';
import { IStargateChain, IStargateToken } from '@/adapters/stargate/types';
import { PublicClient, WalletClient } from 'viem';

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
  rpcUrl: string;
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

export interface IBridgeToken extends IBridgeTokenBaseInfo {
  isPegged: boolean;
  isCompatible: boolean;
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
  contracts?: any;
  chainType?: ChainType;
}

export interface IApproveTokenInput {
  walletClient: WalletClient;
  tokenAddress: `0x${string}`;
  amount: bigint;
  address: `0x${string}`;
  spender: `0x${string}`;
}

export interface IGetAllowanceInput {
  publicClient: PublicClient;
  tokenAddress: `0x${string}`;
  owner: `0x${string}`;
  spender: `0x${string}`;
}

export interface IGetTokenBalanceInput {
  publicClient: PublicClient;
  tokenAddress: `0x${string}`;
  owner: `0x${string}`;
}

export interface IBridgeEndpointId {
  layerZeroV1?: number;
  layerZeroV2?: number;
}

export interface IBridgeAddress {
  stargate?: `0x${string}`;
  layerZero?: `0x${string}`;
}
