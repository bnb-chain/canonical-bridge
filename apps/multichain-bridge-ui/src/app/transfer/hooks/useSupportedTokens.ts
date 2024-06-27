import { useBridgeConfigs } from '@/bridges/main';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export function useSupportedTokens() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const { getSupportedTokens } = useBridgeConfigs();

  const supportedTokens = useMemo(() => {
    if (!fromChain || !toChain) {
      return [];
    }
    return getSupportedTokens(fromChain.id, toChain.id);
  }, [fromChain, getSupportedTokens, toChain]);

  return supportedTokens;
}
