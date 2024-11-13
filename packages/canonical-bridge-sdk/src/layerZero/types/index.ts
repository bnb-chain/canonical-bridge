import { BaseBridgeConfig } from '@/core';
import { type PublicClient, type WalletClient } from 'viem';

export type LayerZeroConfig = Omit<BaseBridgeConfig, 'timeout' | 'endpoint'>;
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

export interface LayerZeroToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  symbol: string;
  endpointID: number;
  version: number; // LayerZero version
}

export interface LayerZeroChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface LayerZeroTransferConfigs {
  chains: LayerZeroChain[];
  tokens: Record<number, LayerZeroToken[]>;
}
