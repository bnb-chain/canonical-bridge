import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

import { useBridgeConfig } from '@/index';

export function useSolanaAccount() {
  const { connected, publicKey } = useSolanaWallet();
  const bridgeConfig = useBridgeConfig();

  const solana = bridgeConfig.transfer.chainConfigs.find((e) => e.chainType === 'solana');

  return {
    publicKey,
    address: publicKey?.toBase58(),
    isConnected: connected,
    chainId: connected ? solana?.id : undefined,
  };
}
