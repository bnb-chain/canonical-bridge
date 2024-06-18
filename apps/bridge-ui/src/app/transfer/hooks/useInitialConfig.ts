import { setFromChain, setToChain } from '@/app/transfer/action';
import { useTransferConfigs } from '@/bridges/index';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';

const defaultConfig = {
  fromChainId: 56,
  toChainId: 137,
};

export function useInitialConfig() {
  const dispatch = useAppDispatch();
  const { chains } = useTransferConfigs();

  useEffect(() => {
    const fromChain = chains.find(
      (item) => item.id === defaultConfig.fromChainId
    );
    const toChain = chains.find((item) => item.id === defaultConfig.toChainId);

    dispatch(setFromChain(fromChain));
    dispatch(setToChain(toChain));
  }, [chains, dispatch]);
}
