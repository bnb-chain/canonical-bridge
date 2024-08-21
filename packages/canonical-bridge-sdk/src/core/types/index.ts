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

export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface TransferTokenPair {
  fromTokenAddress: string;
  toTokenAddress: string;
  fromToken: any;
  toToken: any;
  isPegged?: boolean;
  peggedConfig?: any;
}

export interface CreateAdapterParameters<T> {
  configs: T;
  excludedChains?: number[];
  excludedTokens?: Record<number, string[]>;
  nativeCurrencies?: Record<number, NativeCurrency>;
  bridgedTokenGroups?: string[][];
}
