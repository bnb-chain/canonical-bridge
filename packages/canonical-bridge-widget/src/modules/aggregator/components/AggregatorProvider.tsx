import React, { useContext, useMemo } from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  AdapterConstructorType,
  AdapterType,
  IBridgeChain,
  ITransferConfig,
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

export interface AggregatorContextProps {
  isReady: boolean;
  defaultSelectedInfo: ITransferConfig['defaultSelectedInfo'];
  chainConfigs: IChainConfig[];
  nativeCurrencies: Record<number, INativeCurrency>;
  adapters: AdapterType[];
  getFromChains: (params: IGetFromChainsParams) => IBridgeChain[];
  getToChains: (params: IGetToChainsParams) => IBridgeChain[];
  getTokens: (params: IGetTokensParams) => IBridgeToken[];
  getToToken: (params: IGetToTokenParams) => IBridgeToken | undefined;
}

const DEFAULT_CONTEXT: AggregatorContextProps = {
  isReady: false,
  defaultSelectedInfo: {} as ITransferConfig['defaultSelectedInfo'],
  chainConfigs: [],
  nativeCurrencies: {},
  adapters: [],
  getFromChains: () => [],
  getToChains: () => [],
  getTokens: () => [],
  getToToken: () => undefined,
};

export const AggregatorContext = React.createContext(DEFAULT_CONTEXT);

export interface AggregatorProviderProps {
  config: ITransferConfig;
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { config, children } = props;

  const value = useMemo(() => {
    if (!config) {
      return DEFAULT_CONTEXT;
    }

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

    const nativeCurrencies = getNativeCurrencies(config.chainConfigs);
    const includedChains = config.chainConfigs.map((item) => item.id);
    const brandChains = config.brandChains;
    const externalChains = config.externalChains;

    const adapters = bridges
      .filter((item) => config[item.bridgeType])
      .map(({ bridgeType, Adapter }) => {
        const bridgeConfig = config[bridgeType];

        const options: IBaseAdapterOptions<any> = {
          config: bridgeConfig.config,
          excludedChains: bridgeConfig.exclude.chains,
          excludedTokens: bridgeConfig.exclude.tokens,
          bridgedTokenGroups: bridgeConfig.bridgedTokenGroups,
          includedChains,
          nativeCurrencies,
          brandChains,
          externalChains,
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

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

export function useAggregator() {
  return useContext(AggregatorContext);
}

export function useAdapter<T = unknown>(bridgeType: BridgeType) {
  const { adapters } = useAggregator();

  const adapter = useMemo(() => {
    return adapters.find((adapter) => adapter.bridgeType === bridgeType);
  }, [adapters, bridgeType]);

  return adapter as T;
}