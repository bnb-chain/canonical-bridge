import { CBridgePeggedPairConfig } from '@/bridges/cbridge/types';
import {
  ChainInfo,
  MultiBurnPairConfig,
  TokenInfo,
} from '@/bridges/index/types';
import { getAllChains } from '@/bridges/index/utils/getAllChains';
import { getAllChainTokensMap } from '@/bridges/index/utils/getAllChainTokensMap';
import { getMultiBurnConfigs } from '@/bridges/index/utils/getMultiBurnConfigs';
import { getPeggedPairConfigs } from '@/bridges/index/utils/getPeggedPairConfigs';
import React, { useContext, useMemo } from 'react';

export interface TransferConfigsContextProps {
  chains: ChainInfo[];
  chainTokensMap: {
    [k in string]: TokenInfo[];
  };
  peggedPairConfigs: CBridgePeggedPairConfig[];
  multiBurnConfigs: MultiBurnPairConfig[];
}

export const TransferConfigContext = React.createContext(
  {} as TransferConfigsContextProps
);

export interface TransferConfigsProviderProps {
  children: React.ReactNode;
}

export function TransferConfigsProvider(props: TransferConfigsProviderProps) {
  const { children } = props;

  const value = useMemo(() => {
    const chains = getAllChains();
    const chainTokensMap = getAllChainTokensMap();
    const peggedPairConfigs = getPeggedPairConfigs(chains);
    const multiBurnConfigs = getMultiBurnConfigs();

    return {
      chains,
      chainTokensMap,
      peggedPairConfigs,
      multiBurnConfigs,
    };
  }, []);

  return (
    <TransferConfigContext.Provider value={value}>
      {children}
    </TransferConfigContext.Provider>
  );
}

export function useTransferConfigs() {
  return useContext(TransferConfigContext);
}

export function usePeggedPairConfigs() {
  return useTransferConfigs().peggedPairConfigs;
}

export function useMultiBurnConfigs() {
  return useTransferConfigs().multiBurnConfigs;
}
