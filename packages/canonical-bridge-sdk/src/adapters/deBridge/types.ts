import { type WalletClient } from 'viem';

export interface IDeBridgeChain {
  chainId: number;
  chainName: string;
}

export interface IDeBridgeToken {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string | null;
  eip2612?: boolean;
  tags: string[];
  domainVersion?: string;
}

export interface IDeBridgeTransferConfig {
  chains: IDeBridgeChain[];
  tokens: Record<number, IDeBridgeToken[]>;
}

// https://deswap.debridge.finance/v1.0/#/DLN
export interface IDeBridgeCreateQuoteResponse {
  estimation: {
    srcChainTokenIn: {
      address: `0x${string}`;
      name: string;
      symbol: string;
      chainId: number;
      decimals: number;
      amount: string;
      approximateOperatingExpense: string;
      mutatedWithOperatingExpense: boolean;
    };
    srcChainTokenOut: {
      address: `0x${string}`;
      name: string;
      symbol: string;
      decimals: number;
      amount: string;
      chainId: number;
      maxRefundAmount: string;
    };
    dstChainTokenOut: {
      address: `0x${string}`;
      name: string;
      symbol: string;
      decimals: number;
      amount: string;
      recommendedAmount: string;
      withoutAdditionalTakerRewardsAmount: string;
      maxTheoreticalAmount: string;
      chainId: number;
    };
    costsDetails: any[];
    recommendedSlippage: number;
  };
  tx: {
    allowanceTarget?: `0x${string}`;
    allowanceValue?: string;
    data: `0x${string}`;
    to: `0x${string}`; // Bridge address
    value: string;
  };
  prependedOperatingExpenseCost: string;
  order: {
    approximateFulfillmentDelay: number;
  };
  fixFee: string;
  userPoints: number;
  integratorPoints: number;
  orderId: string;
}

export interface IDeBridgeEstimatedFeesInput {
  fromChainId: number;
  fromTokenAddress: `0x${string}`;
  amount: bigint;
  toChainId: number;
  toTokenAddress: `0x${string}`;
  userAddress: string;
  toUserAddress?: string;
  affiliateFeePercent?: number;
  prependOperatingExpenses?: boolean;
  accesstoken?: string;
  referralCode?: string;
}

export interface ISendDebridgeTokenInput {
  walletClient: WalletClient;
  bridgeAddress: string;
  data: `0x${string}`;
  amount: bigint;
  address: `0x${string}`;
}

export interface ITokenQueryParams {
  chainId: number;
  address: string;
}

export interface IDeBridgeToken {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string | null;
  eip2612?: boolean;
  tags: string[];
  domainVersion?: string;
}

export interface IDeBridgeTokenValidateParams {
  fromTokenAddress: string;
  fromBridgeAddress: string;
  fromTokenSymbol: string;
  fromChainId?: number;
  fromChainType?: string;
  toTokenAddress: string;
  toTokenSymbol?: string;
  toChainId?: number;
  toChainType?: string;
  amount: number;
  fromTokenDecimals?: number;
  toTokenDecimals?: number;
  deBridgeEndpoint: string;
}
