import { getSupportedTokens, useTransferConfigs } from '@/bridges/index';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export function useSupportedTokens() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const configs = useTransferConfigs();

  const supportedTokens = useMemo(() => {
    if (!fromChain || !toChain) {
      return [];
    }
    return getSupportedTokens(configs, fromChain, toChain);
  }, [configs, fromChain, toChain]);

  return supportedTokens;
}
