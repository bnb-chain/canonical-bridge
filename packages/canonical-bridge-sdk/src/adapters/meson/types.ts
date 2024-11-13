import { IBaseAdapterOptions } from '@/adapters/base/types';

export interface IMesonAdapterOptions
  extends IBaseAdapterOptions<IMesonChain[]> {
  timeout?: number;
  endpoint?: string;
}

export interface IMesonToken {
  id: string;
  addr: string;
  decimals: number;
  min: string;
  max: string;
}

export interface IMesonChain {
  id: string;
  name: string;
  chainId: string;
  address: string; // bridge address
  tokens: IMesonToken[];
}

export interface IGetMesonEstimateFeeInput {
  fromToken: string;
  toToken: string;
  fromAddr: string;
  amount: string;
}

export interface IMesonEncodeSwapInput {
  fromToken: string;
  toToken: string;
  amount: string;
  fromAddress: string;
  recipient: string;
}

export interface IMesonSendTokenInput {
  fromAddress: string;
  recipient: string;
  signature: string;
  encodedData: string;
}
