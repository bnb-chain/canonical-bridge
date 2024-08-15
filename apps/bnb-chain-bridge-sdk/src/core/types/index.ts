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
