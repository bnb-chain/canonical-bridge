import { useMemo } from 'react';

import { useAppSelector } from '@/modules/store/StoreProvider';
import { useToTokenInfo } from '@/modules/transfer/hooks/useToTokenInfo';
import { IBridgeToken } from '@/modules/aggregator/types';

export function useToTokenDisplayedInfo() {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const bridgeType = useAppSelector((state) => state.transfer.transferActionInfo)?.bridgeType;
  const { toTokenInfo, getToTokenAddress, getToTokenSymbol } = useToTokenInfo();

  const displayedInfo = useMemo(() => {
    if (!selectedToken) return;

    const info = {
      icon: selectedToken.icon,
      name: selectedToken.name,
      symbol: toTokenInfo?.symbol ?? selectedToken.symbol,
      address: undefined,
    };

    if (bridgeType) {
      return {
        ...info,
        symbol: getToTokenSymbol()?.[bridgeType],
        address: getToTokenAddress()?.[bridgeType],
      };
    }

    return info;
  }, [bridgeType, getToTokenAddress, getToTokenSymbol, selectedToken, toTokenInfo?.symbol]);

  return displayedInfo as IBridgeToken;
}
