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

export interface IStargateBridgeTokenInfo {
  stargateType: string;
  address: `0x${string}`;
  token: {
    address: `0x${string}`;
    decimals: number;
    symbol: string;
  };
  lpToken: {
    address: `0x${string}`;
    decimals: number;
    symbol: string;
  };
  farm: {
    stargateStaking: {
      address: `0x${string}`;
      rewardTokens: [
        {
          address: `0x${string}`;
          decimals: number;
          symbol: string;
        },
        {
          address: `0x${string}`;
          decimals: number;
          symbol: string;
        },
      ];
    };
  };
  id: string;
  assetId: string;
  chainKey: string;
  chainName: string;
  tokenMessaging: `0x${string}`;
  sharedDecimals: number;
}

export interface IStargateApiTokenConfig extends IStargateBridgeTokenInfo {
  endpointID?: number;
}
export interface IStargateTokenList {
  v1: IStargateBridgeTokenInfo[];
  v2: IStargateBridgeTokenInfo[];
}
