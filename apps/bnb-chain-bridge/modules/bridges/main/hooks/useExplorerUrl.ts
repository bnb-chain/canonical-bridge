import { useMemo } from 'react';

import { useAppSelector } from '@/core/store/hooks';

export function useExplorerUrl(chainId?: number) {
  const evmConnectData = useAppSelector((state) => state.bridges.evmConnectData);

  const explorerUrl = useMemo(() => {
    const chain = evmConnectData.find((item) => item.id === chainId);
    const explorerUrl = (chain?.blockExplorers?.default.url || '').replace(/\/$/, '');

    return explorerUrl;
  }, [chainId, evmConnectData]);

  return explorerUrl;
}
