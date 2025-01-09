import { BridgeType } from '@/shared/types';
import { type PublicClient, type WalletClient } from 'viem';

export interface IBaseBridgeConfigOptions {
  timeout?: number;
  endpoint: string;
}

export interface IBaseBridgeConfig extends IBaseBridgeConfigOptions {
  bridgeType: BridgeType;
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
