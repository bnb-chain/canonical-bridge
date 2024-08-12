import { useMemo } from 'react';

import { useAppSelector } from '@/core/store/hooks';

export function useRpcUrl(chainId?: number) {
  const evmConnectData = useAppSelector((state) => state.bridges.evmConnectData);

  const rpcUrl = useMemo(() => {
    const chain = evmConnectData.find((item) => item.id === chainId);
    return chain?.rpcUrls.default?.http?.[0] ?? '';
  }, [chainId, evmConnectData]);

  return rpcUrl;
}
