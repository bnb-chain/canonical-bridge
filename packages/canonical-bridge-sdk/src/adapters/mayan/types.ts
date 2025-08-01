import { ReferrerAddresses } from '@mayanfinance/swap-sdk';
import { ILayerZeroToken } from '@/adapters/layerZero/types';

export interface IMayanChainBaseToken {
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

export interface IMayanChain {
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
  baseToken: IMayanChainBaseToken;
}

export interface IMayanToken {
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
  chains: IMayanChain[];
  tokens: Record<string, IMayanToken[]>;
}

export interface IMayanQuotaInputExtra {
  slippageBps?: number | 'auto';
  gasDrop?: number;
  referrer?: ReferrerAddresses;
  referrerBps?: number;
}

export interface IMayanQuotaInput {
  amount: number;
  fromToken: string;
  toToken: string;
  fromChain: string;
  toChain: string;
  extra: IMayanQuotaInputExtra
}

export interface IMayanTokenValidateParams {
  fromTokenAddress: string;
  fromBridgeAddress: string;
  fromTokenSymbol: string;
  fromChainNameId?: string;
  fromChainType?: string;
  toTokenAddress: string;
  toTokenSymbol?: string;
  toChainId?: number;
  toChainNameId?: string;
  toChainType?: string;
  amount: number;
  fromTokenDecimals?: number;
  toTokenDecimals?: number;
}

export interface ILayerZeroQuotaInput {
  details: Required<ILayerZeroToken['details']>
}