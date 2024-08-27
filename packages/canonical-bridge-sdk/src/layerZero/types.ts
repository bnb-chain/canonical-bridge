import { type PublicClient, type WalletClient } from 'viem';

export interface ISendCakeTokenInput {
  userAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  gasAmount?: bigint;
  version?: number;
  publicClient: PublicClient;
  walletClient: WalletClient;
}

export interface IGetEstimateFeeInput {
  userAddress: `0x${string}`;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  gasAmount?: bigint;
  version?: number;
  publicClient: PublicClient;
}
