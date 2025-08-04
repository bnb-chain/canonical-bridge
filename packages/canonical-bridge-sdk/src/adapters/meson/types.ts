export interface IMesonToken {
  id: string;
  symbol: string;
  name: string;
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

interface IMesonTokenLimits {
  id: string;
  decimals: number;
  addr?: `0x${string}`;
  min: string;
  max: string;
}

export interface IMesonTokenList {
  id: string;
  name: string;
  chainId: `0x${string}`;
  address: `0x${string}`;
  tokens: IMesonTokenLimits[];
}

export type IMesonTransferConfig = IMesonChain[];

export interface IGetMesonEstimateFeeInput {
  fromToken: string;
  toToken: string;
  fromAddr?: string;
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
