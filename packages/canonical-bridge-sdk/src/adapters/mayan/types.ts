export interface IMayanBridgeChainBaseToken {
  mint: string;
  name: string;
  symbol: string;
  wChainId: number;
  chainId: number;
  decimals: number;
  contract: string;
  coingeckoId: string;
  wrappedAddress: string;
  logoURI: string;
}

export interface IMayanBridgeChain {
  mode: string;
  tokenBridgeAddress: string;
  wChainId: number;
  chainId: number;
  nameId: string;
  chainName: string;
  fullChainName: string;
  rpcURL: string;
  currencySymbol: string;
  blockExplorer: string;
  logoURI: string;
  mayanContractAddress: string;
  wrapContractAddress: string;
  originActive: boolean;
  destinationActive: boolean;
  baseToken: IMayanBridgeChainBaseToken;
}

export interface IMayanBridgeToken {
  name: string;
  standard: string;
  symbol: string;
  mint: string;
  verified: boolean;
  contract: string;
  chainId: number;
  wChainId: number;
  decimals: number;
  logoURI: string;
  wrappedAddress: string;
  coingeckoId: string;
  pythUsdPriceId: string;
  realOriginContractAddress: string;
  realOriginChainId: number;
  supportsPermit: boolean;
  hasAuction: boolean;
}

export interface IMayanTransferConfig {
  chains: IMayanBridgeChain[];
  tokens: Record<string, IMayanBridgeToken[]>;
}