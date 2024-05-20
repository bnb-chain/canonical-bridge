import React, { useMemo, useState } from 'react';

export interface StoreContextProps {
  fromChainId: number;
  fromTokenAddress: string;
  transferValue: string;
  setFromChainId: (value: number) => void;
  setFromTokenAddress: (value: string) => void;
  setTransferValue: (value: string) => void;

  toChainId: number;
  toTokenAddress: string;
  setToChainId: (value: number) => void;
  setToTokenAddress: (value: string) => void;
}

export const StoreContext = React.createContext({} as StoreContextProps);

export interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider(props: StoreProviderProps) {
  const { children } = props;

  const [fromChainId, setFromChainId] = useState<number>(97);
  const [fromTokenAddress, setFromTokenAddress] = useState<string>('');
  const [transferValue, setTransferValue] = useState<string>('0');
  const [toChainId, setToChainId] = useState<number>(0);
  const [toTokenAddress, setToTokenAddress] = useState<string>('');

  const value = useMemo(() => {
    return {
      fromChainId,
      fromTokenAddress,
      transferValue,
      setFromChainId,
      setFromTokenAddress,
      setTransferValue,

      toChainId,
      toTokenAddress,
      setToChainId,
      setToTokenAddress,
    };
  }, [fromChainId, fromTokenAddress, toChainId, toTokenAddress, transferValue]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
