import { useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';

export function useSolanaBalance(address?: string, enabled = true) {
  const { connection } = useConnection();

  return useQuery<FormattedBalance>({
    queryKey: ['solana:getBalance', address],
    refetchInterval: 1000 * 5,
    enabled: !!address && enabled,
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
