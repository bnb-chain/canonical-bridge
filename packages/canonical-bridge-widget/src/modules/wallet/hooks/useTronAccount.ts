import { useTronWallet } from '@node-real/walletkit/tron';
import { useEffect, useState } from 'react';

export function useTronAccount() {
  const { address, connected, wallet } = useTronWallet();
  const [chainId, setChainId] = useState<number | undefined>();

  useEffect(() => {
    const adapter = wallet?.adapter;
    if (!adapter) return;

    const onUpdateChainId = (chain: any) => {
      setChainId(Number(chain.chainId));
    };

    const getNetwork = async () => {
      const chain = await (adapter as any).network?.();
      onUpdateChainId(chain);
    };

    if (connected) {
      getNetwork();
    }

    adapter.on('chainChanged', onUpdateChainId);
    return () => {
      adapter.off('chainChanged', onUpdateChainId);
    };
  }, [connected, wallet?.adapter]);

  return {
    address: address || undefined,
    isConnected: connected,
    chainId,
  };
}
