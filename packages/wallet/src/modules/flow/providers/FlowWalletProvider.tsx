import { FlowWalletModal } from '@/modules/flow/components/FlowWalletModal';
import { useDisclosure } from '@node-real/uikit';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import * as fcl from '@onflow/fcl';

interface FlowWalletContextProps {
  isConnected: boolean;
  address: string | null;
  bloctoService: any;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const FlowWalletContext = React.createContext({} as FlowWalletContextProps);

fcl.config({
  'accessNode.api': 'https://rest-testnet.onflow.org',
  'discovery.authn.endpoint':
    'https://fcl-discovery.onflow.org/api/testnet/authn',
});

export interface FlowWalletProviderProps {
  children?: React.ReactNode;
}

export function FlowWalletProvider(props: FlowWalletProviderProps) {
  const { children } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [bloctoService, setBloctoService] = useState<any>();
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    fcl.discovery.authn.subscribe((res: any) => {
      const bloctoService = res?.results?.find((item: any) =>
        item.uid.includes('blocto')
      );
      setBloctoService(bloctoService);
    });

    fcl.currentUser().subscribe((user: any) => {
      const { loggedIn, addr } = user;

      setIsConnected(loggedIn);
      setAddress(addr);

      if (loggedIn) {
        onClose();
      }
    });
  }, [onClose]);

  const value = useMemo(() => {
    return {
      isConnected,
      address,
      isOpen,
      bloctoService,
      onOpen,
      onClose,
    };
  }, [address, bloctoService, isConnected, isOpen, onClose, onOpen]);

  return (
    <FlowWalletContext.Provider value={value}>
      {children}
      <FlowWalletModal />
    </FlowWalletContext.Provider>
  );
}

export function useFlowWallet() {
  return useContext(FlowWalletContext);
}
