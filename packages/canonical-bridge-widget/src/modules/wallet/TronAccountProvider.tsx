import { useWallet as useTronWallet } from '@tronweb3/tronwallet-adapter-react-hooks';
import React, { useMemo } from 'react';
import { useEffect, useState } from 'react';

interface TronAccountContextProps {
  address?: string;
  chainId?: number;
  isConnected: boolean;
}

const TRON_CHAIN_ID = 728126428;

export const TronAccountContext = React.createContext({} as TronAccountContextProps);

export function TronAccountProvider(props: React.PropsWithChildren) {
  const { children } = props;

  const { address, connected, wallet } = useTronWallet();
  const [chainId, setChainId] = useState<number | undefined>();

  useEffect(() => {
    const adapter = wallet?.adapter;
    if (!adapter) return;

    const onUpdateChainId = (chain: any) => {
      const chainId = Number(chain.chainId);
      setChainId(chainId);
    };

    const getNetwork = async () => {
      const chain = await (adapter as any).network?.();
      onUpdateChainId(chain);
    };

    if (connected) {
      getNetwork();
    } else {
      setChainId(undefined);
    }

    adapter.on('chainChanged', onUpdateChainId);
    return () => {
      adapter.off('chainChanged', onUpdateChainId);
    };
  }, [connected, wallet?.adapter]);

  const value = useMemo(() => {
    return {
      address: address ? address : undefined,
      isConnected: connected,
      chainId: chainId || TRON_CHAIN_ID,
    };
  }, [address, chainId, connected]);

  return <TronAccountContext.Provider value={value}>{children}</TronAccountContext.Provider>;
}
