import { type PublicClient, type WalletClient } from 'viem';

export type BridgeType = 'cBridge' | 'deBridge' | 'stargate';

export interface BaseBridgeConfigOptions {
  timeout?: number;
  endpoint: string;
}

export interface BaseBridgeConfig extends BaseBridgeConfigOptions {
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
