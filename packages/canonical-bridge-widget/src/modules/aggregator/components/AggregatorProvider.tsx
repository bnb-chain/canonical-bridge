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
import { TokenBalancesProvider } from '@/modules/aggregator/components/TokenBalancesProvider';
import { TokenPricesProvider } from '@/modules/aggregator/components/TokenPricesProvider';
import { useBridgeConfig } from '@/index';

export interface AggregatorContextProps {
  isReady: boolean;
  transferConfig: ITransferConfig;
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
  transferConfig: {} as ITransferConfig,
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
  transferConfig: ITransferConfig;
  chainConfigs: IChainConfig[];
  children: React.ReactNode;
}

export function AggregatorProvider(props: AggregatorProviderProps) {
  const { transferConfig, chainConfigs, children } = props;

  const bridgeConfig = useBridgeConfig();

  const value = useMemo(() => {
    if (!transferConfig) {
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

    const nativeCurrencies = getNativeCurrencies(chainConfigs);
    const includedChains = chainConfigs.map((item) => item.id);
    const assetPrefix = bridgeConfig.http.assetPrefix;

    const adapters = bridges
      .filter((item) => transferConfig[item.bridgeType])
      .map(({ bridgeType, Adapter }) => {
        const adapterConfig = transferConfig[bridgeType]!;

        return new Adapter({
          config: adapterConfig.config,
          excludedChains: adapterConfig.exclude?.chains,
          excludedTokens: adapterConfig.exclude?.tokens,
          bridgedTokenGroups: adapterConfig.bridgedTokenGroups,
          includedChains,
          nativeCurrencies,
          brandChains: transferConfig.brandChains,
          externalChains: transferConfig.externalChains,
          displayTokenSymbols: transferConfig.displayTokenSymbols,
          assetPrefix,
        } as IBaseAdapterOptions<any>);
      });

    return {
      isReady: true,
      transferConfig,

      defaultSelectedInfo: transferConfig.defaultSelectedInfo,
      nativeCurrencies,
      adapters,
      chainConfigs,

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
  }, [chainConfigs, transferConfig, bridgeConfig.http.assetPrefix]);

  return (
    <AggregatorContext.Provider value={value}>
      <TokenBalancesProvider />
      <TokenPricesProvider />
      {children}
    </AggregatorContext.Provider>
  );
}

export function useAggregator() {
  return useContext(AggregatorContext);
}
