import { useWallet } from '@solana/wallet-adapter-react';

import { useBridgeConfigs } from '@/modules/bridges';

export function useSolanaAccount() {
  const { publicKey, wallet, connected } = useWallet();

  const { chainConfigs } = useBridgeConfigs();
  const config = chainConfigs.find((item) => item.chainType === 'solana')!;

  return {
    address: wallet?.adapter.publicKey?.toBase58(),
    isConnected: connected,
    publicKey,
    chain: connected
      ? {
          name: config.name,
          id: config.id,
        }
      : undefined,
  };
}
