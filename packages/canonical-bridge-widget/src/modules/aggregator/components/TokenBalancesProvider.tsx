import { useQuery } from '@tanstack/react-query';
import { useChains } from 'wagmi';
import { useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import { REFETCH_INTERVAL } from '@/core/constants';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsLoadingTokenBalances, setTokenBalances } from '@/modules/aggregator/action';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useCurrentWallet } from '@/modules/wallet/CurrentWalletProvider';

export function TokenBalancesProvider() {
  const { address, walletType } = useCurrentWallet();
  const chains = useChains();
  const tronWeb = useTronWeb();
  const { connection } = useConnection();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const dispatch = useAppDispatch();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isLoading, data } = useQuery<Record<string, string | undefined>>({
    enabled: !!address && !!fromChain?.id && !!toChain?.id,
    refetchInterval: REFETCH_INTERVAL,
    queryKey: ['tokenBalances', address, fromChain?.id, toChain?.id],
    queryFn: async () => {
      const balances = await getTokenBalances({
        walletType,
        chainType: fromChain?.chainType,
        account: address,
        tokens,
        chain: chains?.find((item) => item.id === fromChain?.id),
        tronWeb,
        connection,
      });
      return balances;
    },
  });

  useEffect(() => {
    dispatch(setTokenBalances(data));
    dispatch(setIsLoadingTokenBalances(isLoading));
  }, [data, dispatch, isLoading]);

  return null;
}
