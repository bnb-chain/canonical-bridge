import {
  getSupportedChains,
  getSupportedTokens,
} from '@/providers/TransferConfigsProvider/utils';
import { ChainInfo, TokenInfo } from '@/types';
import React, { useContext, useMemo } from 'react';

export interface TransferConfigsContextProps {
  chains: ChainInfo[];
  tokens: {
    [k in string]: TokenInfo[];
  };
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
    return {
      chains: getSupportedChains(),
      tokens: getSupportedTokens(),
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

export function useSupportedTokenByChainId(chainId: number) {
  return useTransferConfigs().tokens[chainId];
}
