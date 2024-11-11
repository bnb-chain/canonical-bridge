import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';
import { REFETCH_INTERVAL } from '@/core/constants';

export function useTronBalance() {
  const tronWeb = useTronWeb();
  const { address } = useTronAccount();

  return useQuery<FormattedBalance>({
    queryKey: ['useTronBalance', address],
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!address && !!tronWeb,
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
