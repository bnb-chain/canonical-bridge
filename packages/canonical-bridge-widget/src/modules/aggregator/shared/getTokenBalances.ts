import { Address, Chain, createPublicClient, formatUnits, http } from 'viem';
import { TronWeb } from 'tronweb';
import * as SPLToken from '@solana/spl-token';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

import { ChainType, IBridgeToken } from '@/modules/aggregator/types';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { isSameAddress } from '@/core/utils/address';

export async function getTokenBalances({
  walletType,
  chainType,
  account,
  tokens,
  chain,
  tronWeb,
  connection,
}: {
  walletType?: ChainType;
  chainType?: ChainType;
  account?: string;
  tokens?: IBridgeToken[];
  chain?: Chain;
  tronWeb?: TronWeb;
  connection?: Connection;
}) {
  if (walletType !== chainType) return {};

  const compatibleTokens = tokens?.filter((item) => isChainOrTokenCompatible(item));

  if (chainType === 'solana') {
    return await getSolanaTokenBalances({
      account,
      tokens: compatibleTokens,
      connection,
    });
  }

  if (chainType === 'tron') {
    return await getTronTokenBalances({
      account,
      tokens: compatibleTokens,
      tronWeb,
    });
  }
  return await getEvmTokenBalances({
    account,
    chain,
    tokens: compatibleTokens,
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

    const contracts = tokens.map((item) => ({
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

    const balances: Record<string, string | undefined> = {};
    if (erc20TokensRes.status === 'fulfilled') {
      const values = erc20TokensRes.value?.map((item) => item.result) ?? [];

      values.map((value, index) => {
        const token = tokens[index];

        const symbol = token.displaySymbol?.toUpperCase();
        balances[symbol] =
          typeof value === 'undefined' ? undefined : formatUnits(BigInt(value), token.decimals);
      });
    }

    if (nativeTokenRes.status === 'fulfilled') {
      const symbol = chain.nativeCurrency.symbol?.toUpperCase();
      balances[symbol] = formatUnits(BigInt(nativeTokenRes.value), chain.nativeCurrency.decimals);
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

    const balances: Record<string, string | undefined> = {};

    for (let i = 0; i < Math.min(tokens.length, 2); i++) {
      const token = tokens?.[i];
      const tokenAddress = token.address;

      tronWeb.setAddress(token.address);
      const contractInstance = await tronWeb.contract(tronBalanceABI, tokenAddress);
      const balanceOf = await contractInstance.balanceOf(account).call();
      const balance = balanceOf?.toString() as string;

      balances[token.displaySymbol?.toUpperCase()] = formatUnits(BigInt(balance), token.decimals);
    }

    return balances;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('[getTronTokenBalances] error:', err);
    return {};
  }
}

async function getSolanaTokenBalances({
  account,
  tokens,
  connection,
}: {
  account?: string;
  tokens?: IBridgeToken[];
  connection?: Connection;
}) {
  try {
    if (!account || !tokens?.length || !connection) {
      return {};
    }
    const balances: Record<string, string | undefined> = {};

    // https://stackoverflow.com/questions/69700173/solana-check-all-spl-token-balances-of-a-wallet
    const res = await connection.getTokenAccountsByOwner(new PublicKey(account), {
      programId: TOKEN_PROGRAM_ID,
    });

    res?.value?.forEach((e) => {
      const accountInfo = SPLToken.AccountLayout.decode(e.account.data);

      const token = tokens.find((t) => isSameAddress(t.address, accountInfo.mint.toBase58()));
      if (token) {
        balances[token.displaySymbol.toUpperCase()] = formatUnits(
          accountInfo.amount,
          token.decimals,
        );
      }
    });

    tokens.forEach((t) => {
      const key = t.displaySymbol.toUpperCase();
      balances[key] = balances[key] ?? '0';
    });

    return balances;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('[getTronTokenBalances] error:', err);
    return {};
  }
}
