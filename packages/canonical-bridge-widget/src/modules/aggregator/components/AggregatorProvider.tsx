import React, { useContext, useMemo } from 'react';
import {
  BridgeType,
  CBridgeAdapter,
  DeBridgeAdapter,
  LayerZeroAdapter,
  MesonAdapter,
  StargateAdapter,
  IChainConfig,
  INativeCurrency,
} from '@bnb-chain/canonical-bridge-sdk';
import { CanonicalBridgeSDK } from '@bnb-chain/canonical-bridge-sdk';

import { ITransferConfig } from '@/modules/aggregator/types';
import { useBridgeConfig } from '@/index';

export interface AggregatorContextProps {
  isReady: boolean;
  transferConfig: ITransferConfig;
  chainConfigs: IChainConfig[];
  nativeCurrencies: Record<number, INativeCurrency>;
  bridgeSDK: CanonicalBridgeSDK;
}

export const AggregatorContext = React.createContext({} as AggregatorContextProps);

export interface AggregatorProviderProps {
  transferConfig?: ITransferConfig;
  chains: IChainConfig[];
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { transferConfig, chains, children } = props;

  const bridgeConfig = useBridgeConfig();

  const value = useMemo(() => {
    type GetAdapterParams = {
      config: any;
      bridgedTokenGroups?: string[][];
      excludedChains?: number[];
      excludedTokens?: Record<number, string[]>;
    };

    const bridges: Array<{
      bridgeType: BridgeType;
      getAdapter: (params: GetAdapterParams) => any;
    }> = [
      {
        bridgeType: 'cBridge',
        getAdapter(params: GetAdapterParams) {
          return new CBridgeAdapter({
            ...params,
          });
        },
      },
      {
        bridgeType: 'deBridge',
        getAdapter(params: GetAdapterParams) {
          return new DeBridgeAdapter({
            accessToken: bridgeConfig.http.deBridgeAccessToken,
            ...params,
          });
        },
      },
      {
        bridgeType: 'stargate',
        getAdapter(params: GetAdapterParams) {
          return new StargateAdapter({
            ...params,
          });
        },
      },
      {
        bridgeType: 'layerZero',
        getAdapter(params: GetAdapterParams) {
          return new LayerZeroAdapter({
            ...params,
          });
        },
      },
      {
        bridgeType: 'meson',
        getAdapter(params: GetAdapterParams) {
          return new MesonAdapter({
            ...params,
          });
        },
      },
    ];

    const adapters = bridges
      .map((e) => {
        const adapterConfig = transferConfig?.[e.bridgeType];
        if (adapterConfig) {
          return e.getAdapter({
            config: adapterConfig.config,
            bridgedTokenGroups: adapterConfig.bridgedTokenGroups,
            excludedChains: adapterConfig?.exclude?.chains,
            excludedTokens: adapterConfig?.exclude?.tokens,
          });
        }
      })
      .filter(Boolean);

    const bridgeSDK = new CanonicalBridgeSDK({
      chains,
      assetPrefix: bridgeConfig.assetPrefix,
      brandChains: transferConfig?.brandChains,
      externalChains: transferConfig?.externalChains,
      displayTokenSymbols: transferConfig?.displayTokenSymbols,
      chainOrder: transferConfig?.order?.chains,
      tokenOrder: transferConfig?.order?.tokens,
      adapters,
    });

    return {
      isReady: !!transferConfig,
      transferConfig: transferConfig ?? ({} as ITransferConfig),
      bridgeSDK,
      chainConfigs: bridgeSDK.getSDKOptions().chains,
      nativeCurrencies: bridgeSDK.getNativeCurrencies(),
    };
  }, [chains, bridgeConfig.assetPrefix, bridgeConfig.http.deBridgeAccessToken, transferConfig]);

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

export function useAggregator() {
  return useContext(AggregatorContext);
}
