import { useMemo } from 'react';
import { Chain } from 'viem';

import { useAppSelector } from '@/core/store/hooks';
import { useExplorerUrl } from '@/modules/bridges/main/hooks/useExplorerUrl';

interface CustomChain extends Chain {
  tokenUrl?: string;
}

export function useTokenUrl(chainId?: number, tokenAddress?: string) {
  const explorerUrl = useExplorerUrl(chainId);
  const evmConnectData = useAppSelector((state) => state.bridges.evmConnectData);

  const tokenUrl = useMemo(() => {
    const chain = evmConnectData.find((item) => item.id === chainId) as CustomChain;

    const tmpUrl = explorerUrl ? `${explorerUrl}/token` : '';
    const tokenUrl = (chain?.tokenUrl || tmpUrl).replace(/\/$/, '');

    return tokenUrl ? `${tokenUrl}/${tokenAddress}` : '';
  }, [chainId, evmConnectData, explorerUrl, tokenAddress]);

  return tokenUrl;
}
