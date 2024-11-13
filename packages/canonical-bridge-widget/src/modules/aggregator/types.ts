import {
  IBridgeToken,
  ICBridgeTransferConfig,
  IDeBridgeTransferConfig,
  IExternalChain,
  ILayerZeroTransferConfig,
  IMesonChain,
  IStargateTransferConfig,
} from '@bnb-chain/canonical-bridge-sdk';

export interface IBridgeTokenWithBalance extends IBridgeToken {
  balance?: number;
  value?: number;
}

export interface ITransferConfig {
  defaultSelectedInfo: {
    fromChainId: number;
    toChainId: number;
    tokenSymbol: string;
    amount: string;
  };
  order?: {
    chains?: number[];
    tokens?: string[];
  };
  displayTokenSymbols: Record<number, Record<string, string>>;
  brandChains?: number[];
  externalChains?: IExternalChain[];
  cBridge?: {
    config: ICBridgeTransferConfig;
    exclude: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  deBridge?: {
    config: IDeBridgeTransferConfig;
    exclude: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  stargate?: {
    config: IStargateTransferConfig;
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  layerZero?: {
    config: ILayerZeroTransferConfig;
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
  meson?: {
    config: IMesonChain[];
    exclude?: {
      chains?: number[];
      tokens?: Record<number, string[]>;
    };
    bridgedTokenGroups?: string[][];
  };
}
