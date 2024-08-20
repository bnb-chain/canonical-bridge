import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useQuery } from '@tanstack/react-query';
import * as SPLToken from '@solana/spl-token';

import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';

export function useSolanaTokenBalance(tokenAddress?: string) {
  const { publicKey } = useSolanaAccount();
  const { connection } = useConnection();

  return useQuery<bigint>({
    queryKey: ['getTokenAccountsByOwner', tokenAddress],
    refetchInterval: 1000 * 5,
    enabled: !!tokenAddress && !!publicKey,
    queryFn: async () => {
      const result = await connection.getTokenAccountsByOwner(publicKey!, {
        mint: new PublicKey(tokenAddress!),
      });

      const info = result?.value?.[0];
      if (info) {
        const data = SPLToken.AccountLayout.decode(info.account.data);
        return data.amount;
      }

      return 0n;
    },
  });
}
