import {
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigs,
} from '../../cbridge/types';
import {
  DeBridgeChain,
  DeBridgeToken,
  DeBridgeTransferConfigs,
} from '../../debridge/types';
import {
  StarGateChain,
  StarGateToken,
  StarGateTransferConfigs,
} from '../../stargate/types';
import { BigNumber, Contract, Signer } from 'ethers';
import type {
  Provider,
  TransactionReceipt,
  TransactionResponse,
} from '@ethersproject/abstract-provider'

export type BridgeType = 'cBridge' | 'deBridge' | 'stargate';

export interface BridgeChain {
  id: number;
  name: string;
  icon?: string;
  available: {
    cBridge?: boolean;
    deBridge?: boolean;
    stargate?: boolean;
  };
  rawData: {
    cBridge?: CBridgeChain;
    deBridge?: DeBridgeChain;
    stargate?: StarGateChain;
  };
}

export interface BridgeToken {
  name: string;
  icon?: string;
  address: string;
  symbol: string;
  decimal: number;
  available: {
    cBridge?: boolean;
    deBridge?: boolean;
    stargate?: boolean;
  };
  rawData: {
    cBridge?: CBridgeToken;
    deBridge?: DeBridgeToken;
    stargate?: StarGateToken;
  };
  isPegged: boolean;
  peggedRawData: {
    cBridge?: CBridgePeggedPairConfig;
  };
}

export interface BridgeConfigsResponse {
  version: string;
  defaultSelectedInfo: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
    tokenAddress: string;
    amount: string;
  };
  order: {
    chain: number[];
    token: string[];
  };
  cBridge: {
    configs: CBridgeTransferConfigs;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: Array<string[]>;
  };
  deBridge: {
    configs: DeBridgeTransferConfigs;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: Array<string[]>;
  };
  stargate: {
    configs: StarGateTransferConfigs;
    exclude: {
      chains: number[];
      tokens: Record<number, string[]>;
    };
    bridgedTokenGroups: Array<string[]>;
  };
}

/**
 * Evm network connection data.
 */
export interface IEvmConnectData {
  chain_id: number;
  decimals: number;
  explorer: string;
  name: string;
  network: string;
  rpc: string;
  symbol: string;
}

/**
 * Stuff that can be coerced into an address.
 */
export type AddressLike = string | Contract

/**
 * Stuff that can be coerced into a transaction.
 */
export type TransactionLike = string | TransactionReceipt | TransactionResponse

/**
 * Stuff that can be coerced into a number.
 */
export type NumberLike = string | number | BigNumber


/**
 * Stuff that can be coerced into a provider.
 */
export type ProviderLike = string | Provider

/**
 * Stuff that can be coerced into a signer.
 */
export type SignerLike = string | Signer

/**
 * Stuff that can be coerced into a signer or provider.
 */
export type SignerOrProviderLike = SignerLike | ProviderLike