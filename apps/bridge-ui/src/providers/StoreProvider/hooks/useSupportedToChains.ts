import { useFetchCBridgeTransferConfigs } from '@/bridges/cbridge/api/useFetchCBridgeTransferConfigs';
import { getSupportedTargetChains } from '@/bridges/cbridge/utils';
import { useStore } from '@/providers/StoreProvider/hooks/useStore';
import { useMemo } from 'react';

export function useSupportedToChains() {
  const { fromChainId } = useStore();
  const { data } = useFetchCBridgeTransferConfigs();

  const chains = useMemo(() => {
    const targetChains = getSupportedTargetChains(data, fromChainId) || [];

    const chains = targetChains.sort((a, b) => (a.name < b.name ? -1 : 1));
    return chains;
  }, [data, fromChainId]);

  return chains;
}
