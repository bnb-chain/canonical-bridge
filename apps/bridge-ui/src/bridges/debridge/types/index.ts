export type DeBridgeSupportedChainsInfo = {
  chains: { chainId: number; chainName: string }[];
};

export interface TokenDetails {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string;
  eip2612: boolean;
  tags: string[];
  domainVersion?: string;
}

export type DeBridgeTokenList = {
  tokens: {
    [address: string]: TokenDetails;
  };
};

// https://deswap.debridge.finance/v1.0/#/DLN
export type QuoteResponse = {
  estimation: {
    srcChainTokenIn: {
      address: `0x${string}`;
      name: string;
      symbol: string;
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
      maxTheoreticalAmount: boolean;
    };
    costsDetails: any[];
    recommendedSlippage: number;
  };
  tx: { allowanceTarget: `0x${string}`; allowanceValue: string };
  prependedOperatingExpenseCost: string;
  order: {
    approximateFulfillmentDelay: number;
  };
  fixFee: string;
  userPoints: number;
  integratorPoints: number;
};
