import { useAccount, useChains } from 'wagmi';
import { Address, createPublicClient, http } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { ERC20_TOKEN } from '@/core/contract/abi/erc20Token';
import { IBridgeToken } from '@/modules/aggregator/types';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { TIME } from '@/core/constants';

export function useTokenBalances(tokens: IBridgeToken[], isEnabled = true) {
  const { address } = useAccount();
  const chains = useChains();
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const result = useQuery<Record<string, bigint | undefined>>({
    enabled: isEnabled,
    staleTime: TIME.SECOND * 10,
    refetchInterval: TIME.SECOND * 10,
    queryKey: ['token-balances', address, fromChain?.id],
    queryFn: async () => {
      const chain = chains?.find((item) => item.id === fromChain?.id);
      if (!chain || !address || !fromChain?.id) {
        return {};
      }

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      const contracts = tokens.map((item) => ({
        abi: ERC20_TOKEN,
        address: item.address as Address,
        functionName: 'balanceOf',
        args: [address],
      }));

      const [erc20TokensRes, nativeTokenRes] = await Promise.allSettled([
        client.multicall({
          allowFailure: true,
          contracts,
        }),
        client.getBalance({
          address,
        }),
      ]);

      const balances: Record<string, bigint | undefined> = {};
      if (erc20TokensRes.status === 'fulfilled') {
        const values = erc20TokensRes.value?.map((item) => item.result) ?? [];
        values.map((value, index) => {
          const symbol = tokens[index].displaySymbol;
          balances[symbol] = typeof value === 'undefined' ? value : BigInt(value);
        });
      }

      if (nativeTokenRes.status === 'fulfilled') {
        const symbol = chain.nativeCurrency.symbol;
        balances[symbol] = nativeTokenRes.value;
      }

      return balances;
    },
  });

  return result;
}
