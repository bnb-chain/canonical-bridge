import { useQuery } from '@tanstack/react-query';
import { Address, formatUnits } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';

export interface FormattedBalance {
  formatted: string;
  symbol: string;
  value: bigint;
}

export function useEvmBalance(address?: Address, enabled = true) {
  const publicClient = usePublicClient();
  const { chain } = useAccount();

  return useQuery<FormattedBalance>({
    queryKey: ['solana:getBalance', address],
    refetchInterval: 1000 * 5,
    enabled: !!address && enabled && !!chain,
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