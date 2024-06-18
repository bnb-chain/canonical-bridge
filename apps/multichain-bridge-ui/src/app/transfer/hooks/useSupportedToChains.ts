import { getSupportedToChains, useTransferConfigs } from '@/bridges/index';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export function useSupportedToChains() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const configs = useTransferConfigs();

  const supportedToChains = useMemo(() => {
    if (!fromChain) {
      return [];
    }
    return getSupportedToChains(configs, fromChain);
  }, [configs, fromChain]);

  return supportedToChains;
}
