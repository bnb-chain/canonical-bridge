import { useWallet as useSolanaWallet } from '@solana/wallet-adapter-react';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';

export function useSolanaAccount() {
  const { connected, publicKey } = useSolanaWallet();
  const { chainConfigs } = useAggregator();

  const solana = chainConfigs.find((e) => e.chainType === 'solana');

  return {
    publicKey,
    address: publicKey?.toBase58(),
    isConnected: connected,
    chainId: connected ? solana?.id : undefined,
  };
}
