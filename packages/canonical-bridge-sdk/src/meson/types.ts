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
