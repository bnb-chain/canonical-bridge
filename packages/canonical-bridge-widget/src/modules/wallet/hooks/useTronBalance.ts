import { useQuery } from '@tanstack/react-query';

import { FormattedBalance } from '@/modules/wallet/hooks/useEvmBalance';

export function useTronBalance(address?: string, enabled = true) {
  return useQuery<FormattedBalance>({
    queryKey: ['tron', address],
    refetchInterval: 1000 * 5,
    enabled: !!address && enabled,
    queryFn: async () => {
      return {
        formatted: '0',
        symbol: 'TRX',
        value: BigInt(0),
      };
    },
  });
}
