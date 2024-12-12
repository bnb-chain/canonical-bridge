export interface IGetMesonEstimateFeeInput {
  fromToken: string;
  toToken: string;
  fromAddr: string;
  amount: string;
}

export interface IMesonTokenLimits {
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

export interface IMesonTokenValidateParams {
  fromChainId?: number;
  toChainId?: number;
  fromTokenSymbol: string;
  fromTokenAddress: `0x${string}`;
  fromTokenDecimals: number;
  fromChainType?: string;
  toTokenAddress?: `0x${string}`;
  toTokenDecimals?: number;
  toChainType?: string;
  toTokenSymbol?: string;
  amount: number;
  mesonEndpoint: string;
}
