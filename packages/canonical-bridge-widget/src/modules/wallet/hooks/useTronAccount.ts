import { useTronWallet } from '@node-real/walletkit/tron';

export function useTronAccount() {
  const { address, connected } = useTronWallet();

  return {
    address: address || undefined,
    isConnected: connected,
  };
}
