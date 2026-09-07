import { IBaseBridgeConfig } from '@/core';
import { Hex, type PublicClient, type WalletClient } from 'viem';
import { Connection } from '@solana/web3.js';
import { WalletContextState } from '@solana/wallet-adapter-react';

export interface ILayerZeroConfig
  extends Omit<IBaseBridgeConfig, 'timeout' | 'endpoint'> {}

export interface ISendEvmCakeTokenInput {
  publicClient: PublicClient;
  walletClient: WalletClient;
  toAccount: Hex;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
}

export interface ISendSolanaCakeTokenInput {
  connection: Connection;
  solanaWallet: WalletContextState;
  toAccount: string;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  details: ILayerZeroToken['details']
}

export interface IGetEstimateFeeInput {
  fromAccount: string;
  toAccount: string;
  bridgeAddress: `0x${string}`;
  amount: bigint;
  dstEndpoint: number;
  publicClient?: PublicClient;
  details?: ILayerZeroToken['details'],
  connection?: Connection;
  solanaWallet?: WalletContextState;
}

export interface ILayerZeroToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  symbol: string;
  endpointID: number;
  version: number; // LayerZero version
  name: string;
  details?: {
    innerTokenProgramId: string,
    oftProgramId: string,
    escrowTokenAccount: string,
    oftPDA: string,
    mintAuthority: string
  };
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
  fromPublicClient?: PublicClient;
  toPublicClient?: PublicClient;
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
