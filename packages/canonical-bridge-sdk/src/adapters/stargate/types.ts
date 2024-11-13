import { IBaseAdapterOptions } from '@/adapters/base/types';
import { PublicClient, WalletClient } from 'viem';

export interface IStargateAdapterOptions
  extends IBaseAdapterOptions<IStargateTransferConfig> {
  timeout?: number;
  endpoint?: string;
}

export interface IStargateToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  type?: string;
  symbol: string;
  endpointID: number;
  name: string;
}

export interface IStargateTransferConfig {
  chains: IStargateChain[];
  tokens: Record<number, IStargateToken[]>;
}

export interface IStargateChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface IStargateParams {
  dstEid: number;
  to: `0x${string}`;
  amountLD: bigint;
  minAmountLD: bigint;
  extraOptions: `0x${string}`;
  composeMsg: `0x${string}`;
  oftCmd: `0x${string}`;
}

export interface IStarGateQuoteSend {
  nativeFee: bigint;
  lzTokenFee: bigint;
}

export interface IStarGateBusDriveSettings {
  avgWaitTime: number;
  maxWaitTime: number;
  passengersToDrive: number;
}

export interface IStargateQuoteOFT {
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
}

export interface IStargateOFTQuote {
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
  minAmount: bigint;
}

export interface ISendTokenInput {
  walletClient: WalletClient;
  publicClient: PublicClient;
  bridgeAddress: `0x${string}`;
  tokenAddress: `0x${string}`;
  endPointId: number;
  receiver: `0x${string}`;
  amount: bigint;
}
