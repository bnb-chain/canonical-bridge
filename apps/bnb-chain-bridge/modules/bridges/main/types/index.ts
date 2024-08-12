import {
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigs,
} from '@/modules/bridges/cbridge/types';
import {
  DeBridgeChain,
  DeBridgeToken,
  DeBridgeTransferConfigs,
  QuoteResponse,
} from '@/modules/bridges/debridge/types';

export type BridgeType = 'cBridge' | 'deBridge';

export interface BridgeChain {
  id: number;
  name: string;
  icon?: string;
  available: {
    cBridge?: boolean;
    deBridge?: boolean;
  };
  rawData: {
    cBridge?: CBridgeChain;
    deBridge?: DeBridgeChain;
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
  };
  rawData: {
    cBridge?: CBridgeToken;
    deBridge?: DeBridgeToken;
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
}

export interface TransferActionInfo {
  data?: `0x${string}`;
  bridgeAddress?: `0x${string}`;
  value?: string;
  bridgeType?: BridgeType;
  orderId?: string; // deBridge order id. May be used for tracking history
}

export interface ReceiveValue {
  deBridge?: string;
  cBridge?: string;
}

export interface IEvmConnectData {
  chain_id: number;
  decimals: number;
  explorer: string;
  name: string;
  network: string;
  rpc: string;
  symbol: string;
}

export interface IEstimatedAmount {
  cBridge?: any;
  deBridge?: QuoteResponse;
}
