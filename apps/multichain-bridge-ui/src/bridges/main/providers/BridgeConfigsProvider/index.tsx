import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import { useFetchBridgeConfigs } from '@/bridges/main/api/useFetchBridgeConfigs';
import { BridgeConfigsResponse, ChainInfo, MultiBurnPairConfig } from '@/bridges/main/types';
import { getMultiBurnConfigs } from '@/bridges/main/utils/getMultiBurnConfigs';
import { getPeggedPairConfigs } from '@/bridges/main/utils/getPeggedPairConfigs';
import { getSupportedFromChains } from '@/bridges/main/utils/getSupportedFromChains';
import React, { useContext, useMemo } from 'react';

export interface BridgeConfigsContextProps {
  peggedPairConfigs: CBridgePeggedPairConfig[];
  multiBurnConfigs: MultiBurnPairConfig[];
  rawData: BridgeConfigsResponse;
  chains: ChainInfo[];
}

export const BridgeConfigContext = React.createContext({} as BridgeConfigsContextProps);

export interface BridgeConfigsProviderProps {
  children: React.ReactNode;
}

export function BridgeConfigsProvider(props: BridgeConfigsProviderProps) {
  const { children } = props;

  const { data } = useFetchBridgeConfigs();

  const value = useMemo(() => {
    if (!data) {
      return {
        chains: [],
        peggedPairConfigs: [],
        multiBurnConfigs: [],
        rawData: {} as any,
      };
    }

    const peggedPairConfigs = getPeggedPairConfigs({
      cbridgeChains: data.cbridge.chains,
      peggedPairConfigs: data.cbridge.pegged_pair_configs,
    });

    const multiBurnConfigs = getMultiBurnConfigs({
      peggedPairConfigs,
    });

    const chains = getSupportedFromChains({
      peggedPairConfigs,
      multiBurnConfigs,
      rawData: data,
    });

    return {
      chains,
      peggedPairConfigs,
      multiBurnConfigs,
      rawData: data,
    };
  }, []);

  return <BridgeConfigContext.Provider value={value}>{children}</BridgeConfigContext.Provider>;
}

export function useBridgeConfigs() {
  return useContext(BridgeConfigContext);
}

export function usePeggedPairConfigs() {
  return useBridgeConfigs().peggedPairConfigs;
}

export function useMultiBurnConfigs() {
  return useBridgeConfigs().multiBurnConfigs;
}
