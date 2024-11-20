import { Address, Chain, createPublicClient, formatUnits, http } from 'viem';
import { TronWeb } from 'tronweb';
import * as SPLToken from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import axios from 'axios';

import { ChainType, IBridgeToken } from '@/modules/aggregator/types';
import { ERC20_TOKEN } from '@/core/contract/abi';
import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { isSameAddress } from '@/core/utils/address';

export async function getTokenBalances({
  chainType,
  tokens,
  evmParams,
  solanaParams,
  tronParams,
}: {
  chainType?: ChainType;
  tokens?: IBridgeToken[];
  evmParams: {
    account?: string;
    chain?: Chain;
  };
  solanaParams: {
    account?: string;
    connection?: Connection;
  };
  tronParams: {
    account?: string;
    tronWeb?: TronWeb;
  };
}) {
  const compatibleTokens = tokens?.filter((item) => isChainOrTokenCompatible(item));

  if (chainType === 'solana') {
    return await getSolanaTokenBalances({
      account: solanaParams.account,
      tokens: compatibleTokens,
      connection: solanaParams.connection,
    });
  }

  if (chainType === 'tron') {
    return await getTronTokenBalances({
      account: tronParams.account,
      tokens: compatibleTokens,
      tronWeb: tronParams.tronWeb,
    });
  }
  return await getEvmTokenBalances({
    account: evmParams.account,
    chain: evmParams.chain,
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

interface ITronAccountToken {
  balance: string;
  tokenId: string;
  tokenAbbr: string;
}

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

    const isTestnet = tronWeb.fullNode.host.includes('nile');
    const endpoint = isTestnet
      ? 'https://nileapi.tronscan.org/api'
      : 'https://apilist.tronscan.org/api';

    const res = await axios<{ data: ITronAccountToken[] }>({
      url: `${endpoint}/account/tokens`,
      params: {
        address: account,
        start: 0,
        limit: 50,
      },
    });

    const tokenInfos = res.data?.data ?? [];
    tokenInfos.forEach((tokenInfo) => {
      const token = tokens.find(
        (t) =>
          isSameAddress(t.address, tokenInfo.tokenId) ||
          (t.displaySymbol.toUpperCase() === 'TRX' && tokenInfo.tokenId === '_'),
      );

      if (token) {
        balances[token.displaySymbol.toUpperCase()] = formatUnits(
          BigInt(tokenInfo.balance),
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

    // https://stackoverflow.com/questions/69700173/solana-check-all-spl-token-balances-of-a-wallet
    const [splTokensRes, nativeTokenRes] = await Promise.allSettled([
      connection.getTokenAccountsByOwner(new PublicKey(account), {
        programId: TOKEN_PROGRAM_ID,
      }),
      connection.getBalance(new PublicKey(account!)),
    ]);

    const balances: Record<string, string | undefined> = {};
    if (splTokensRes.status === 'fulfilled') {
      splTokensRes.value?.value?.forEach((e) => {
        const accountInfo = SPLToken.AccountLayout.decode(e.account.data);

        const token = tokens.find((t) => isSameAddress(t.address, accountInfo.mint.toBase58()));
        if (token) {
          balances[token.displaySymbol.toUpperCase()] = formatUnits(
            accountInfo.amount,
            token.decimals,
          );
        }
      });
    }

    if (nativeTokenRes.status === 'fulfilled') {
      balances['SOL'] = String(nativeTokenRes.value / LAMPORTS_PER_SOL);
    }

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
