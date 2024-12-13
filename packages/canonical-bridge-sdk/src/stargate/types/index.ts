import { type PublicClient, type WalletClient } from 'viem';

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

export interface IStargateTokenValidateParams {
  fromBridgeAddress: `0x${string}`;
  toBridgeAddress: `0x${string}`;
  fromTokenAddress: `0x${string}`;
  fromTokenSymbol: string;
  fromTokenDecimals: number;
  fromChainId?: number;
  toTokenAddress: `0x${string}`;
  toTokenSymbol: string;
  toTokenDecimals: number;
  toChainId?: number;
  amount: number;
  toPublicClient: PublicClient;
  fromPublicClient: PublicClient;
  dstEndpointId: number;
  stargateEndpoint: string;
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
        }
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
export interface IStargateTokenList {
  v1: IStargateBridgeTokenInfo[];
  v2: IStargateBridgeTokenInfo[];
}
