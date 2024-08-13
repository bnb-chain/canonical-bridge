export interface DeBridgeChain {
  chainId: number;
  chainName: string;
}

export interface DeBridgeToken {
  address: string;
  symbol: string;
  decimals: number;
  name: string;
  logoURI: string | null;
  eip2612?: boolean;
  tags: string[];
  domainVersion?: string;
}

export interface DeBridgeTransferConfigs {
  chains: DeBridgeChain[];
  chain_token: Record<number, DeBridgeToken[]>;
}

// https://deswap.debridge.finance/v1.0/#/DLN
export type DeBridgeCreateQuoteResponse = {
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
};

export interface DeBridgeGetSupportedFuncParams {
  fromChainId?: number;
  toChainId?: number;
  fromTokenSymbol?: string;
  data: DeBridgeTransferConfigs;
}
