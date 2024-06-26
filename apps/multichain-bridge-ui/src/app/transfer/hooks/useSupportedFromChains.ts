import { getSupportedFromChains, useTransferConfigs } from '@/bridges/main';
import { useMemo } from 'react';

export function useSupportedFromChains() {
  const configs = useTransferConfigs();

  const supportedFromChains = useMemo(() => {
    return getSupportedFromChains(configs);
  }, [configs]);

  return supportedFromChains;
}
