import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { REFETCH_INTERVAL } from '@/core/constants';

export function useSolanaBalance() {
  const { connection } = useConnection();
  const { address } = useSolanaAccount();

  return useQuery<FormattedBalance>({
    queryKey: ['useSolanaBalance', address],
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!address,
    queryFn: async () => {
      const balance = await connection.getBalance(new PublicKey(address!));
      return {
        formatted: String(balance / LAMPORTS_PER_SOL),
        symbol: 'SOL',
        value: BigInt(balance),
      };
    },
  });
}
