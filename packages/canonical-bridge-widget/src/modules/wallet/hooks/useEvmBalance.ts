import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

import { REFETCH_INTERVAL } from '@/core/constants';

export interface FormattedBalance {
  formatted: string;
  symbol: string;
  value: bigint;
}

export function useEvmBalance() {
  const publicClient = usePublicClient();
  const { chain, chainId, address } = useAccount();

  return useQuery<FormattedBalance>({
    queryKey: ['useEvmBalance', address, chainId],
    refetchInterval: REFETCH_INTERVAL,
    enabled: !!address && !!chain && !!chainId,
    queryFn: async () => {
      const balance = await publicClient!.getBalance({
        address: address as Address,
      });

      return {
        formatted: formatUnits(balance, chain!.nativeCurrency.decimals),
        symbol: chain!.nativeCurrency.symbol,
        value: BigInt(balance),
      };
    },
  });
}
