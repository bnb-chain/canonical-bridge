import { useTransferConfigs } from '@/bridges/index';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';

export const useToTokenInfo = () => {
  const { chainTokensMap } = useTransferConfigs();
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);
  const toTokenInfo = useMemo(() => {
    if (!toChain || !selectedToken) return null;
    return chainTokensMap[toChain.id].find(
      (token) => selectedToken.symbol === token.symbol
    );
  }, [toChain, chainTokensMap, selectedToken]);
  return toTokenInfo;
};
