import { Address, Chain, createPublicClient, formatUnits, http } from 'viem';
import { TronWeb } from 'tronweb';

import { ChainType, IBridgeToken } from '@/modules/aggregator/types';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';

export async function getTokenBalances({
  chainType,
  account,
  tokens,
  chain,
  tronWeb,
}: {
  chainType?: ChainType;
  account?: string;
  tokens?: IBridgeToken[];
  chain?: Chain;
  tronWeb?: TronWeb;
}) {
  if (chainType === 'tron') {
    return await getTronTokenBalances({
      account,
      tokens,
      tronWeb,
    });
  }
  return await getEvmTokenBalances({
    account,
    chain,
    tokens,
  });
}

async function getEvmTokenBalances({
  account,
  chain,
  tokens,
}: {
  account?: string;
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
        address: account as Address,
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
    console.log('[getEvmTokenBalances] error:', err);
    return {};
  }
}

const tronBalanceABI = [
  {
    constant: true,
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

async function getTronTokenBalances({
  account,
  tokens,
  tronWeb,
}: {
  account?: string;
  tokens?: IBridgeToken[];
  tronWeb?: TronWeb;
}) {
  try {
    if (!account || !tokens?.length || !tronWeb) {
      return {};
    }

    const balances: Record<string, number | undefined> = {};

    const firstToken = tokens?.[0];
    const tokenAddress = firstToken.address;

    tronWeb.setAddress(firstToken.address);
    const contractInstance = await tronWeb.contract(tronBalanceABI, tokenAddress);
    const balanceOf = await contractInstance.balanceOf(account).call();
    const balance = balanceOf?.toString() as string;

    balances[firstToken.displaySymbol?.toUpperCase()] = Number(
      formatUnits(BigInt(balance), firstToken.decimals),
    );

    return balances;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('[getTronTokenBalances] error:', err);
    return {};
  }
}
