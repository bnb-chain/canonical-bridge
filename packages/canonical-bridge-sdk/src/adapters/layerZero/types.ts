import { IBaseBridgeConfig } from '@/core';
import { type PublicClient, type WalletClient } from 'viem';

export interface ILayerZeroConfig
  extends Omit<IBaseBridgeConfig, 'timeout' | 'endpoint'> {}

export interface ISendCakeTokenInput {
  userAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  gasAmount?: bigint;
  version?: number;
  publicClient: PublicClient;
  walletClient: WalletClient;
  dstAddress?: `0x${string}`;
  airDropGas?: bigint;
}

export interface IGetEstimateFeeInput {
  userAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  gasAmount?: bigint;
  version?: number;
  publicClient: PublicClient;
  dstAddress?: `0x${string}`;
  airDropGas?: bigint;
}

export interface ILayerZeroToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  symbol: string;
  endpointID: number;
  version: number; // LayerZero version
  name: string;
}

export interface ILayerZeroChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface ILayerZeroTransferConfigs {
  chains: ILayerZeroChain[];
  tokens: Record<number, ILayerZeroToken[]>;
}

export interface ILayerZeroTokenValidateParams {
  fromPublicClient: PublicClient;
  toPublicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  fromTokenAddress: `0x${string}`;
  fromTokenSymbol: string;
  fromTokenDecimals: number;
  toTokenAddress: `0x${string}`;
  toTokenSymbol: string;
  toTokenDecimals: number;
  toBridgeAddress: `0x${string}`;
  dstEndpoint?: number;
  amount: number;
}

export interface ILayerZeroTransferConfig {
  chains: ILayerZeroChain[];
  tokens: Record<number, ILayerZeroToken[]>;
}
