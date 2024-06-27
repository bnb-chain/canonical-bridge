import { useBridgeConfigs } from '@/bridges/main';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export function useSupportedToChains() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);

  const { getSupportedToChains } = useBridgeConfigs();

  const supportedToChains = useMemo(() => {
    if (!fromChain) {
      return [];
    }
    return getSupportedToChains(fromChain.id);
  }, [fromChain, getSupportedToChains]);

  return supportedToChains;
}
