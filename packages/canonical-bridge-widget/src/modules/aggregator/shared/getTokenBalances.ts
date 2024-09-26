import { Address, Chain, createPublicClient, formatUnits, http } from 'viem';

import { IBridgeToken } from '@/modules/aggregator/types';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';

export async function getTokenBalances({
  account,
  chain,
  tokens,
}: {
  account?: Address;
  chain?: Chain;
  tokens?: IBridgeToken[];
}) {
  try {
    if (!chain || !account || !tokens?.length) {
      return {};
    }

    const client = createPublicClient({
      chain,
      transport: http(),
    });

    const compatibleTokens = tokens.filter((item) => isChainOrTokenCompatible(item));
    const contracts = compatibleTokens.map((item) => ({
      abi: ERC20_TOKEN,
      address: item.address as Address,
      functionName: 'balanceOf',
      args: [account],
    }));

    const [erc20TokensRes, nativeTokenRes] = await Promise.allSettled([
      client.multicall({
        allowFailure: true,
        contracts,
      }),
      client.getBalance({
        address: account,
      }),
    ]);

    const balances: Record<string, number | undefined> = {};
    if (erc20TokensRes.status === 'fulfilled') {
      const values = erc20TokensRes.value?.map((item) => item.result) ?? [];

      values.map((value, index) => {
        const token = compatibleTokens[index];

        const symbol = token.displaySymbol?.toUpperCase();
        balances[symbol] =
          typeof value === 'undefined'
            ? undefined
            : Number(formatUnits(BigInt(value), token.decimals));
      });
    }

    if (nativeTokenRes.status === 'fulfilled') {
      const symbol = chain.nativeCurrency.symbol?.toUpperCase();
      balances[symbol] = Number(
        formatUnits(BigInt(nativeTokenRes.value), chain.nativeCurrency.decimals),
      );
    }

    return balances;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('[getTokenBalances] error:', err);
    return {};
  }
}
