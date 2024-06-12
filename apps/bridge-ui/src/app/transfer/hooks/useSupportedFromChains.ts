import { getSupportedFromChains, useTransferConfigs } from '@/bridges/index';
import { useMemo } from 'react';

export function useSupportedFromChains() {
  const configs = useTransferConfigs();

  const supportedFromChains = useMemo(() => {
    return getSupportedFromChains(configs);
  }, [configs]);

  return supportedFromChains;
}
