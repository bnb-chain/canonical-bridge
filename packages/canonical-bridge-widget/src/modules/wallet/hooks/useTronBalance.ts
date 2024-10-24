import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useTronWeb } from '@/core/hooks/useTronWeb';

export function useTronBalance(address?: string, enabled = true) {
  const tronWeb = useTronWeb();

  return useQuery<FormattedBalance>({
    queryKey: ['useTronBalance', address],
    refetchInterval: 1000 * 5,
    enabled: !!address && enabled && !!tronWeb,
    queryFn: async () => {
      const balance = await tronWeb!.trx.getUnconfirmedBalance(address);
      const formattedBalance = tronWeb!.fromSun(balance);

      return {
        formatted: String(formattedBalance),
        symbol: 'TRX',
        value: BigInt(balance),
      };
    },
  });
}
