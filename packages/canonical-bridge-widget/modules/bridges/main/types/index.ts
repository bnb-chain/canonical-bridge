import {
  BridgeType,
  CBridgeChain,
  CBridgePeggedPairConfig,
  CBridgeToken,
  CBridgeTransferConfigs,
  DeBridgeChain,
  DeBridgeToken,
  DeBridgeTransferConfigs,
  StarGateChain,
  StarGateToken,
  StarGateTransferConfigs,
  LayerZeroToken,
  LayerZeroTransferConfigs,
  LayerZeroChain,
} from '@bnb-chain/canonical-bridge-sdk';

import { QuoteResponse } from '@/modules/bridges/debridge/types';

export type WalletType =
  | 'metaMask'
  | 'trust'
  | 'walletConnect'
  | 'okxWallet'
  | 'binanceWeb3Wallet'
  | 'solana:phantom'
  | 'solana:trust';

export type ChainType = 'evm' | 'solana';

export interface BridgeChain {
  id: number;
  name: string;
  icon?: string;
  available: {
    cBridge?: boolean;
    deBridge?: boolean;
    stargate?: boolean;
    layerZero?: boolean;
  };
  rawData: {
    cBridge?: CBridgeChain;
    deBridge?: DeBridgeChain;
    stargate?: StarGateChain;
    layerZero?: LayerZeroChain;
  };
  chainType: ChainType;
  explorerUrl: string;
  rpcUrl: string;
  tokenUrlPattern: string;
  supportedWallets: WalletType[];
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
    layerZero?: boolean;
  };
  rawData: {
    cBridge?: CBridgeToken;
    deBridge?: DeBridgeToken;
    stargate?: StarGateToken;
    layerZero?: LayerZeroToken;
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
  defaultWallets: {
    evm: {
      pc: WalletType[];
      mobile: WalletType[];
    };
    solana: {
      pc: WalletType[];
      mobile: WalletType[];
    };
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
  layerZero: {
    configs: LayerZeroTransferConfigs;
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

export interface IEstimatedAmount {
  cBridge?: any;
  deBridge?: QuoteResponse;
  stargate?: any; // TODO: response from quoteOFT
  layerZero?: any;
}

export interface ChainConfig {
  id: number;
  name: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrl: string;
  explorer: {
    name: string;
    url: string;
    tokenUrlPattern?: string;
  };
  chainType: ChainType;
  wallets?: {
    pc: WalletType[];
    mobile: WalletType[];
  };
}
