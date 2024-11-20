import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { REFETCH_INTERVAL } from '@/core/constants';

export function useSolanaBalance() {
  const { connection } = useConnection();
  const { publicKey } = useSolanaAccount();

  return useQuery<FormattedBalance>({
    queryKey: ['useSolanaBalance', publicKey],
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!publicKey,
    queryFn: async () => {
      const balance = await connection.getBalance(publicKey!);
      return {
        formatted: String(balance / LAMPORTS_PER_SOL),
        symbol: 'SOL',
        value: BigInt(balance),
      };
    },
  });
}
