import React, { useContext, useMemo } from 'react';
import { Aggregator } from '@bnb-chain/canonical-bridge-sdk';

import { useBridgeConfig } from '@/index';

export interface AggregatorProviderProps {
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();

  const value = useMemo(() => {
    const { assetPrefix, transfer } = bridgeConfig;
    const {
      chainConfigs,
      providers,
      brandChains,
      externalChains,
      displayTokenSymbols,
      chainSorter,
      tokenSorter,
    } = transfer;

    const aggregator = new Aggregator({
      providers,
      brandChains,
      externalChains,
      displayTokenSymbols,
      assetPrefix,
      chainConfigs,
      chainSorter,
      tokenSorter,
    });

    return {
      aggregator,
    };
  }, [bridgeConfig]);

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

interface AggregatorContextProps {
  aggregator: Aggregator;
}

const AggregatorContext = React.createContext({} as AggregatorContextProps);

export function useAggregator() {
  return useContext(AggregatorContext).aggregator;
}
