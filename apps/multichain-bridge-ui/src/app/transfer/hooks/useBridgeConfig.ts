import { setFromChain, setSelectedToken, setToChain } from '@/app/transfer/action';
import {
  getSupportedFromChains,
  getSupportedToChains,
  getSupportedTokens,
  useTransferConfigs,
} from '@/bridges/main';
import { DEFAULT_CONFIG } from '@/configs/app';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useAppDispatch } from '@/store/hooks';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useTransferConfig() {
  const params = useQueryParams();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const configs = useTransferConfigs();

  // init configs
  useEffect(() => {
    // from chain
    const fromChainId = Number(params.fromChainId);
    const fromChains = getSupportedFromChains(configs);

    const urlFomChain = fromChains.find((item) => item.id === fromChainId);
    const defaultFromChain = fromChains.find((item) => item.id === DEFAULT_CONFIG.fromChainId);
    const fromChain = urlFomChain ?? defaultFromChain ?? fromChains[0];

    // to chain
    const toChainId = Number(params.toChainId);
    const toChains = getSupportedToChains(configs, fromChain);

    const urlToChain = toChains.find((item) => item.id === toChainId);
    const defaultToChain = toChains.find((item) => item.id === DEFAULT_CONFIG.toChainId);
    const toChain = urlToChain ?? defaultToChain ?? toChains[0];

    // token
    const tokenSymbol = params.tokenSymbol;
    const tokens = getSupportedTokens(configs, fromChain, toChain);

    const urlToken = tokens.find((item) => item.symbol === tokenSymbol);
    const defaultToken = tokens.find((item) => item.symbol === DEFAULT_CONFIG.tokenSymbol);
    const token = urlToken ?? defaultToken ?? tokens[0];

    // dispatch
    dispatch(setFromChain(fromChain));
    dispatch(setToChain(toChain));
    dispatch(setSelectedToken(token));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configs, dispatch]);

  useEffect(() => {}, []);
}
