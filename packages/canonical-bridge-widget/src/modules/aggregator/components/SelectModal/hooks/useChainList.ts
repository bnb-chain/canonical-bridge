import { useMemo } from 'react';
import { IBridgeChain } from '@bnb-chain/canonical-bridge-sdk';

import { useAggregator } from '@/modules/aggregator/components/AggregatorProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';

export function useChainList(direction: 'from' | 'to', chains: IBridgeChain[] = []) {
  const { transferConfig } = useAggregator();

  const fromChain = useAppSelector((state) => state.transfer.fromChain);
  const toChain = useAppSelector((state) => state.transfer.toChain);

  const sortedChains = useMemo(() => {
    const chainOrder = transferConfig.order?.chains ?? [];

    const sortedChains = chains
      .sort((a, b) => {
        if (direction === 'to') {
          const isA = a.isCompatible;
          const isB = b.isCompatible;

          if (isA && !isB) {
            return -1;
          }
          if (!isA && isB) {
            return 1;
          }
        }

        const indexA = chainOrder.indexOf(a.id);
        const indexB = chainOrder.indexOf(b.id);

        if (indexA > -1 && indexB === -1) {
          return -1;
        }
        if (indexA === -1 && indexB > -1) {
          return 1;
        }
        if (indexA > -1 && indexB > -1) {
          return indexA - indexB;
        }

        return a.name < b.name ? -1 : 1;
      })
      .sort((a) => {
        if (direction === 'from' && a.id === fromChain?.id) {
          return -1;
        }
        if (direction === 'to' && a.id === toChain?.id) {
          return -1;
        }
        return 0;
      });

    return sortedChains;
  }, [transferConfig.order?.chains, chains, direction, fromChain?.id, toChain?.id]);

  return { data: sortedChains };
}
