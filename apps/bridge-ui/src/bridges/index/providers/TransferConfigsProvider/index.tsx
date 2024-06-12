import {
  ChainInfo,
  MultiBurnPairConfig,
  TokenInfo,
} from '@/bridges/index/types';
import { getAllChains } from '@/bridges/index/utils/getAllChains';
import { getAllTokens } from '@/bridges/index/utils/getAllTokens';
import { getMultiBurnConfigs } from '@/bridges/index/utils/getMultiBurnConfigs';
import { getPeggedPairConfigs } from '@/bridges/index/utils/getPeggedPairConfigs';
import React, { useContext, useMemo } from 'react';

export interface TransferConfigsContextProps {
  chains: ChainInfo[];
  tokens: {
    [k in string]: TokenInfo[];
  };
  peggedPairConfigs: any[];
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
    const tokens = getAllTokens();
    const peggedPairConfigs = getPeggedPairConfigs(chains);
    const multiBurnConfigs = getMultiBurnConfigs();

    return {
      chains,
      tokens,
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

export function useSupportedChains() {
  return useTransferConfigs().chains;
}

export function useSupportedChainTokens(chainId: number) {
  return useTransferConfigs().tokens[chainId];
}

export function usePeggedPairConfigs() {
  return useTransferConfigs().peggedPairConfigs;
}

export function useMultiBurnConfigs() {
  return useTransferConfigs().multiBurnConfigs;
}
