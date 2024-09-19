import React, { useContext, useMemo } from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  AdapterConstructorType,
  AdapterType,
  IBridgeChain,
  IBridgeConfig,
  IBridgeToken,
  IChainConfig,
  INativeCurrency,
} from '@/modules/aggregator/types';
import { getNativeCurrencies } from '@/modules/aggregator/shared/getNativeCurrencies';
import { CBridgeAdapter } from '@/modules/aggregator/adapters/cBridge/CBridgeAdapter';
import { DeBridgeAdapter } from '@/modules/aggregator/adapters/deBridge/DeBridgeAdapter';
import { LayerZeroAdapter } from '@/modules/aggregator/adapters/layerZero/LayerZeroAdapter';
import { StargateAdapter } from '@/modules/aggregator/adapters/stargate/StargateAdapter';
import { IBaseAdapterOptions } from '@/modules/aggregator/shared/BaseAdapter';
import {
  aggregateChains,
  IGetFromChainsParams,
  IGetToChainsParams,
} from '@/modules/aggregator/shared/aggregateChains';
import { aggregateTokens, IGetTokensParams } from '@/modules/aggregator/shared/aggregateTokens';
import { aggregateToToken, IGetToTokenParams } from '@/modules/aggregator/shared/aggregateToToken';

export interface BridgeConfigContextProps {
  isReady: boolean;
  defaultSelectedInfo: IBridgeConfig['defaultSelectedInfo'];
  chainConfigs: IChainConfig[];
  nativeCurrencies: Record<number, INativeCurrency>;
  adapters: AdapterType[];
  getFromChains: (params: IGetFromChainsParams) => IBridgeChain[];
  getToChains: (params: IGetToChainsParams) => IBridgeChain[];
  getTokens: (params: IGetTokensParams) => IBridgeToken[];
  getToToken: (params: IGetToTokenParams) => IBridgeToken | undefined;
}

const DEFAULT_CONTEXT: BridgeConfigContextProps = {
  isReady: false,
  defaultSelectedInfo: {} as IBridgeConfig['defaultSelectedInfo'],
  chainConfigs: [],
  nativeCurrencies: {},
  adapters: [],
  getFromChains: () => [],
  getToChains: () => [],
  getTokens: () => [],
  getToToken: () => undefined,
};

export const BridgeConfigContext = React.createContext(DEFAULT_CONTEXT);

export interface BridgeConfigProviderProps {
  config: IBridgeConfig;
  children: React.ReactNode;
}

export function BridgeConfigProvider(props: BridgeConfigProviderProps) {
  const { config, children } = props;

  const value = useMemo(() => {
    if (!config) {
      return DEFAULT_CONTEXT;
    }

    const nativeCurrencies = getNativeCurrencies(config.chainConfigs);

    const bridges: Array<{
      bridgeType: BridgeType;
      Adapter: AdapterConstructorType;
    }> = [
      {
        bridgeType: 'cBridge',
        Adapter: CBridgeAdapter,
      },
      {
        bridgeType: 'deBridge',
        Adapter: DeBridgeAdapter,
      },
      {
        bridgeType: 'stargate',
        Adapter: StargateAdapter,
      },
      {
        bridgeType: 'layerZero',
        Adapter: LayerZeroAdapter,
      },
    ];

    const adapters = bridges.map(({ bridgeType, Adapter }) => {
      const bridgeConfig = config[bridgeType];

      const options: IBaseAdapterOptions<any> = {
        config: bridgeConfig.config,
        excludedChains: bridgeConfig.exclude.chains,
        excludedTokens: bridgeConfig.exclude.tokens,
        nativeCurrencies,
        bridgedTokenGroups: bridgeConfig.bridgedTokenGroups,
      };

      return new Adapter(options);
    });

    return {
      isReady: true,
      defaultSelectedInfo: config.defaultSelectedInfo,

      chainConfigs: config.chainConfigs,
      nativeCurrencies,

      adapters,

      getFromChains: (params: IGetFromChainsParams) => {
        return aggregateChains({
          direction: 'from',
          adapters,
          params,
          config,
        });
      },

      getToChains: (params: IGetToChainsParams) => {
        return aggregateChains({
          direction: 'to',
          adapters,
          params,
          config,
        });
      },

      getTokens: (params: IGetTokensParams) => {
        return aggregateTokens({
          adapters,
          params,
          config,
        });
      },

      getToToken: (params: IGetToTokenParams) => {
        return aggregateToToken({
          adapters,
          params,
          config,
        });
      },
    };
  }, [config]);

  return <BridgeConfigContext.Provider value={value}>{children}</BridgeConfigContext.Provider>;
}

export function useBridgeConfig() {
  return useContext(BridgeConfigContext);
}

export function useAdapter<T = unknown>(bridgeType: BridgeType) {
  const { adapters } = useBridgeConfig();

  const adapter = useMemo(() => {
    return adapters.find((adapter) => adapter.bridgeType === bridgeType);
  }, [adapters, bridgeType]);

  return adapter as T;
}
