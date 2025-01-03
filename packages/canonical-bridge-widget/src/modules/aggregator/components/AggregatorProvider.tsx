import React, { useContext, useMemo } from 'react';
import { Aggregator, INativeCurrency } from '@bnb-chain/canonical-bridge-sdk';

import { getNativeCurrencies } from '@/modules/aggregator/shared/getNativeCurrencies';
import { useBridgeConfig } from '@/index';

export interface AggregatorContextProps {
  nativeCurrencies: Record<number, INativeCurrency>;
}

export const AggregatorContext = React.createContext({} as AggregatorContextProps);

export interface AggregatorProviderProps {
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();

  const value = useMemo(() => {
    const { assetPrefix, transfer } = bridgeConfig;
    const { chainConfigs, providers, brandChains, externalChains, displayTokenSymbols } = transfer;

    const nativeCurrencies = getNativeCurrencies(chainConfigs);

    const aggregator = new Aggregator({
      nativeCurrencies,
      brandChains,
      externalChains,
      displayTokenSymbols,
      assetPrefix,
      providers,
    });

    return {
      nativeCurrencies,
      getAdapter: aggregator.getAdapter,
    };
  }, [bridgeConfig]);

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

export function useAggregator() {
  return useContext(AggregatorContext);
}
