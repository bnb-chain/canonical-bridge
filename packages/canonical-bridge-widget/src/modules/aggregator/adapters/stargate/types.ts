export interface IStargateQuoteSend {
  nativeFee: bigint;
  lzTokenFee: bigint;
}

export interface IStargateBusDriveSettings {
  avgWaitTime: number;
  maxWaitTime: number;
  passengersToDrive: number;
}
