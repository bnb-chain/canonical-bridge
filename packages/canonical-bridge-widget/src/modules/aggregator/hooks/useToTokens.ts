import { useMemo } from 'react';

import { useAggregator } from '@/modules/aggregator/providers/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useToTokens() {
  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const aggregator = useAggregator();

  const toTokens = useMemo(() => {
    if (fromChain?.id && toChain?.id && selectedToken?.address) {
      return aggregator.getToTokens({
        fromChainId: fromChain.id,
        toChainId: toChain.id,
        tokenAddress: selectedToken.address,
      });
    }
    return [];
  }, [aggregator, fromChain?.id, selectedToken?.address, toChain?.id]);

  return toTokens;
}
