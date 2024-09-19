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

export interface IStargateQuoteSend {
  nativeFee: bigint;
  lzTokenFee: bigint;
}

export interface IStargateBusDriveSettings {
  avgWaitTime: number;
  maxWaitTime: number;
  passengersToDrive: number;
}
