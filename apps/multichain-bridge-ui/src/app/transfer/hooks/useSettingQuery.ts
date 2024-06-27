import { setFromChain, setSelectedToken, setToChain } from '@/app/transfer/action';
import { useBridgeConfigs } from '@/bridges/main';
import { DEFAULT_CONFIGS } from '@/configs/app';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useEffect } from 'react';

interface SetQueryParams {
  fromChainId?: number;
  toChainId?: number;
  tokenSymbol?: string;
  replace?: boolean;
}

export function useSettingQuery() {
  const dispatch = useAppDispatch();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const router = useRouter();

  const { getSupportedFromChains, getSupportedToChains, getSupportedTokens } = useBridgeConfigs();

  return {
    setQuery(params: SetQueryParams) {
      const replace = params.replace ?? true;
      const fromChainId = params.fromChainId || fromChain?.id || DEFAULT_CONFIGS.fromChainId;
      const toChainId = params.toChainId || toChain?.id || DEFAULT_CONFIGS.toChainId;
      const tokenSymbol =
        params.tokenSymbol || selectedToken?.symbol || DEFAULT_CONFIGS.tokenSymbol;

      const nextFromChains = getSupportedFromChains();
      const nextFromChain =
        nextFromChains.find((item) => item.id === fromChainId) ?? nextFromChains[0];

      const nextToChains = getSupportedToChains(fromChainId);
      const nextToChain = nextToChains.find((item) => item.id === toChainId) ?? nextToChains[0];

      const nextTokens = getSupportedTokens(fromChainId, toChainId);
      const nextSelectedToken =
        nextTokens.find((item) => item.symbol === tokenSymbol) ?? nextTokens[0];

      dispatch(setFromChain(nextFromChain));
      dispatch(setToChain(nextToChain));
      dispatch(setSelectedToken(nextSelectedToken));

      if (replace) {
        router.replace(
          `?fromChainId=${nextFromChain.id}&toChainId=${nextToChain.id}&tokenSymbol=${nextSelectedToken.symbol}`,
          {
            scroll: false,
          },
        );
      }
    },
  };
}

export function useInitTransferConfigsByQuery() {
  const { setQuery } = useSettingQuery();
  const params = useQueryParams();

  const { isReady } = useBridgeConfigs();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const fromChainId = Number(params.fromChainId);
    const toChainId = Number(params.toChainId);
    const tokenSymbol = params.tokenSymbol;

    setQuery({
      fromChainId,
      toChainId,
      tokenSymbol,
      replace: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady]);
}
