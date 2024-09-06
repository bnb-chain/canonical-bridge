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

export interface DeBridgeGetSupportedFuncParams {
  fromChainId?: number;
  toChainId?: number;
  fromTokenSymbol?: string;
  data: DeBridgeTransferConfigs;
}
