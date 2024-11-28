import { useQuery } from '@tanstack/react-query';
import { useAccount, useChains } from 'wagmi';
import { useEffect } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';

import { REFETCH_INTERVAL } from '@/core/constants';
import { useTokens } from '@/modules/aggregator/hooks/useTokens';
import { getTokenBalances } from '@/modules/aggregator/shared/getTokenBalances';
import { useAppDispatch, useAppSelector } from '@/modules/store/StoreProvider';
import { setIsLoadingTokenBalances, setTokenBalances } from '@/modules/aggregator/action';
import { useTronWeb } from '@/core/hooks/useTronWeb';
import { useSolanaAccount } from '@/modules/wallet/hooks/useSolanaAccount';
import { useTronAccount } from '@/modules/wallet/hooks/useTronAccount';

export function TokenBalancesProvider() {
  const { address } = useAccount();
  const { address: solanaAddress } = useSolanaAccount();
  const { address: tronAddress } = useTronAccount();

  const chains = useChains();
  const { connection } = useConnection();
  const tronWeb = useTronWeb();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const dispatch = useAppDispatch();

  const tokens = useTokens({
    fromChainId: fromChain?.id,
    toChainId: toChain?.id,
  });

  const { isLoading, data } = useQuery<Record<string, string | undefined>>({
    enabled: !!fromChain?.id && !!toChain?.id,
    refetchInterval: REFETCH_INTERVAL,
    queryKey: ['tokenBalances', fromChain?.id, toChain?.id, address, solanaAddress, tronAddress],
    queryFn: async () => {
      const balances = await getTokenBalances({
        chainType: fromChain?.chainType,
        tokens,
        evmParams: {
          account: address,
          chain: chains?.find((item) => item.id === fromChain?.id),
        },
        solanaParams: {
          account: solanaAddress,
          connection,
        },
        tronParams: {
          account: tronAddress,
          tronWeb,
        },
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
