import React, { useContext, useMemo } from 'react';
import { BridgeType } from '@bnb-chain/canonical-bridge-sdk';

import {
  AdapterConstructorType,
  AdapterType,
  IBridgeChain,
  IBridgeToken,
  INativeCurrency,
} from '@/modules/aggregator/types';
import { getNativeCurrencies } from '@/modules/aggregator/shared/getNativeCurrencies';
import { CBridgeAdapter } from '@/modules/aggregator/adapters/cBridge/CBridgeAdapter';
import { DeBridgeAdapter } from '@/modules/aggregator/adapters/deBridge/DeBridgeAdapter';
import { LayerZeroAdapter } from '@/modules/aggregator/adapters/layerZero/LayerZeroAdapter';
import { StargateAdapter } from '@/modules/aggregator/adapters/stargate/StargateAdapter';
import { MesonAdapter } from '@/modules/aggregator/adapters/meson/MesonAdapter';
import { IBaseAdapterOptions } from '@/modules/aggregator/shared/BaseAdapter';
import {
  aggregateChains,
  IGetFromChainsParams,
  IGetToChainsParams,
} from '@/modules/aggregator/shared/aggregateChains';
import { aggregateTokens, IGetTokensParams } from '@/modules/aggregator/shared/aggregateTokens';
import { aggregateToToken, IGetToTokenParams } from '@/modules/aggregator/shared/aggregateToToken';
import { useBridgeConfig } from '@/index';

export interface AggregatorContextProps {
  nativeCurrencies: Record<number, INativeCurrency>;
  adapters: AdapterType[];
  getFromChains: (params: IGetFromChainsParams) => IBridgeChain[];
  getToChains: (params: IGetToChainsParams) => IBridgeChain[];
  getTokens: (params: IGetTokensParams) => IBridgeToken[];
  getToToken: (params: IGetToTokenParams) => IBridgeToken | undefined;
}

export const AggregatorContext = React.createContext({} as AggregatorContextProps);

export interface AggregatorProviderProps {
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();

  const value = useMemo(() => {
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
      { bridgeType: 'meson', Adapter: MesonAdapter },
    ];

    const { chainConfigs, providers, brandChains, externalChains, displayTokenSymbols } =
      bridgeConfig.transfer;
    const nativeCurrencies = getNativeCurrencies(chainConfigs);

    const includedChains = chainConfigs.map((item) => item.id);
    const assetPrefix = bridgeConfig.assetPrefix;

    const adapters = bridges
      .filter(({ bridgeType }) => {
        const provider = providers.find((p) => p.id === bridgeType);
        return provider && provider.config;
      })
      .map(({ bridgeType, Adapter }) => {
        const provider = providers.find((p) => p.id === bridgeType)!;

        return new Adapter({
          config: provider.config,
          excludedChains: provider.excludedChains,
          excludedTokens: provider.excludedTokens,
          bridgedTokenGroups: provider.bridgedTokenGroups,
          includedChains,
          nativeCurrencies,
          brandChains,
          externalChains,
          displayTokenSymbols,
          assetPrefix,
        } as IBaseAdapterOptions<any>);
      });

    return {
      nativeCurrencies,
      adapters,

      getFromChains: (params: IGetFromChainsParams) => {
        return aggregateChains({
          direction: 'from',
          transferConfig,
          chainConfigs,
          assetPrefix,
          adapters,
          params,
        });
      },
      getToChains: (params: IGetToChainsParams) => {
        return aggregateChains({
          direction: 'to',
          transferConfig,
          chainConfigs,
          assetPrefix,
          adapters,
          params,
        });
      },
      getTokens: (params: IGetTokensParams) => {
        return aggregateTokens({
          adapters,
          params,
        });
      },
      getToToken: (params: IGetToTokenParams) => {
        return aggregateToToken({
          adapters,
          params,
        });
      },
    };
  }, [bridgeConfig.assetPrefix]);

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

export function useAggregator() {
  return useContext(AggregatorContext);
}
