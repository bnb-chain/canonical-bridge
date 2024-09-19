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

export interface ILayerZeroToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  symbol: string;
  endpointID: number;
  version: number; // LayerZero version
}

export interface ILayerZeroChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface ILayerZeroTransferConfig {
  chains: ILayerZeroChain[];
  tokens: Record<number, ILayerZeroToken[]>;
}
