import React, { useMemo, useState } from 'react';

export interface StoreContextProps {
  fromChainId: number;
  // fromTokenAddress: string;
  fromTokenInfo: {
    fromTokenAddress: string;
    fromTokenSymbol: string;
    fromTokenDecimal: number;
    fromTokenMethod?: string;
    bridgeAddress: string;
  };
  transferValue: string;
  setFromChainId: (value: number) => void;
  setFromTokenInfo: (value: {
    fromTokenAddress: string;
    fromTokenSymbol: string;
    fromTokenMethod?: string;
    fromTokenDecimal: number;
    bridgeAddress: string;
  }) => void;
  setTransferValue: (value: string) => void;

  toChainId: number;
  setToChainId: (value: number) => void;
  toTokenInfo: {
    toTokenAddress: string;
    toTokenSymbol: string;
    toTokenDecimal: number;
  };
  setToTokenInfo: (value: {
    toTokenAddress: string;
    toTokenSymbol: string;
    toTokenDecimal: number;
  }) => void;
}

export const StoreContext = React.createContext({} as StoreContextProps);

export interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider(props: StoreProviderProps) {
  const { children } = props;

  const [fromChainId, setFromChainId] = useState<number>(97);
  const [fromTokenInfo, setFromTokenInfo] = useState<{
    fromTokenAddress: string;
    fromTokenSymbol: string;
    fromTokenDecimal: number;
    fromTokenMethod?: string;
    bridgeAddress: string;
  }>({
    fromTokenAddress: '',
    fromTokenSymbol: '',
    fromTokenDecimal: 0,
    fromTokenMethod: '',
    bridgeAddress: '',
  });
  const [transferValue, setTransferValue] = useState<string>('0');
  const [toChainId, setToChainId] = useState<number>(137);
  const [toTokenInfo, setToTokenInfo] = useState<{
    toTokenAddress: string;
    toTokenSymbol: string;
    toTokenDecimal: number;
  }>({
    toTokenAddress: '',
    toTokenSymbol: '',
    toTokenDecimal: 0,
  });

  const value = useMemo(() => {
    return {
      fromChainId,
      fromTokenInfo,
      setFromTokenInfo,
      transferValue,
      setFromChainId,
      setTransferValue,

      toChainId,
      toTokenInfo,
      setToChainId,
      setToTokenInfo,
    };
  }, [
    fromChainId,
    fromTokenInfo,
    setFromTokenInfo,
    toChainId,
    setToTokenInfo,
    toTokenInfo,
    transferValue,
  ]);

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
