export interface StarGateToken {
  address: string;
  bridgeAddress: string;
  decimals: number;
  type?: string;
  symbol: string;
  endpointID: number;
}

export interface StarGateTransferConfigs {
  chains: StarGateChain[];
  tokens: Record<number, StarGateToken[]>;
}

export interface StarGateChain {
  chainId: number;
  chainName: string;
  network?: string;
}

export interface IStarGateParams {
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