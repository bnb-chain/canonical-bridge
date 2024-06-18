import { EVMWalletProvider } from '@/modules/evm/providers/EVMWalletProvider';
import { FlowWalletProvider } from '@/modules/flow/providers/FlowWalletProvider';
import { WalletType } from '@/types';
import React, { useContext, useMemo, useState } from 'react';

export interface WalletContextProps {
  walletType: WalletType;
  setWalletType: (type: WalletType) => void;
}

const WalletContext = React.createContext({} as WalletContextProps);

export function useWallet() {
  return useContext(WalletContext);
}

export interface WalletProviderProps {
  children: React.ReactNode;
}

export function WalletProvider(props: WalletProviderProps) {
  const { children } = props;

  const [walletType, setWalletType] = useState<WalletType>('evm');

  const value = useMemo(() => {
    return {
      walletType,
      setWalletType,
    };
  }, [walletType]);

  return (
    <WalletContext.Provider value={value}>
      <EVMWalletProvider>
        <FlowWalletProvider>{children}</FlowWalletProvider>
      </EVMWalletProvider>
    </WalletContext.Provider>
  );
}
