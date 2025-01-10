import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Aggregator } from '@bnb-chain/canonical-bridge-sdk';

import { useBridgeConfig } from '@/index';

export interface AggregatorProviderProps {
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { children } = props;

  const bridgeConfig = useBridgeConfig();
  const [aggregator, setAggregator] = useState<Aggregator>();

  useEffect(() => {
    const createAggregator = async () => {
      const { assetPrefix, transfer, http } = bridgeConfig;
      const {
        chainConfigs,
        providers,
        brandChains,
        externalChains,
        displayTokenSymbols,
        chainSorter,
        tokenSorter,
      } = transfer;

      const instance = await Aggregator.create({
        providers,
        brandChains,
        externalChains,
        displayTokenSymbols,
        assetPrefix,
        chainConfigs,
        configApiEndpoint: http.serverEndpoint,
        chainSorter,
        tokenSorter,
      });

      setAggregator(instance);
    };

    createAggregator();

    // output all token pairs
    // const result: any[] = [];
    // const fromChains = aggregator.getFromChains();
    // fromChains.forEach((fromChain) => {
    //   const toChains = aggregator.getToChains({ fromChainId: fromChain.id });
    //   toChains.forEach((toChain) => {
    //     if (fromChain.id !== toChain.id) {
    //       const tokens = aggregator.getTokens({
    //         fromChainId: fromChain.id,
    //         toChainId: toChain.id,
    //       });
    //       tokens.forEach((token) => {
    //         if (token.isCompatible) {
    //           const toTokens = aggregator.getToTokens({
    //             fromChainId: fromChain.id,
    //             toChainId: toChain.id,
    //             tokenAddress: token.address,
    //           });

    //           result.push({
    //             fromChainId: fromChain.id,
    //             fromChainName: fromChain.name,
    //             toChainId: toChain.id,
    //             toChainName: toChain.name,
    //             toTokenCount: toTokens.length,
    //             fromToken: token.symbol,
    //             fromTokenAddress: token.address,
    //             toTokens: toTokens.map((e) => ({
    //               symbol: e.symbol,
    //               address: e.address,
    //             })),
    //           });
    //         }
    //       });
    //     }
    //   });
    // });
    // console.log(JSON.stringify(result));
  }, [bridgeConfig]);

  const value = useMemo<AggregatorContextProps>(() => {
    return {
      aggregator,
    };
  }, [aggregator]);

  return <AggregatorContext.Provider value={value}>{children}</AggregatorContext.Provider>;
}

interface AggregatorContextProps {
  aggregator?: Aggregator;
}

const AggregatorContext = React.createContext({} as AggregatorContextProps);

export function useAggregator() {
  return useContext(AggregatorContext).aggregator;
}
