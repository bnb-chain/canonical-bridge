import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { tronWeb } from '@/core/utils/tron';

export function useTronBalance(address?: string, enabled = true) {
  return useQuery<FormattedBalance>({
    queryKey: ['useTronBalance', address],
    refetchInterval: 1000 * 5,
    enabled: !!address && enabled,
    queryFn: async () => {
      const balance = await tronWeb.trx.getBalance(address);

      return {
        formatted: String(balance / 1e6),
        symbol: 'TRX',
        value: BigInt(balance),
      };
    },
  });
}
