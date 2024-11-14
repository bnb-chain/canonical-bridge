import { IBridgeChain } from '@/aggregator/types';

export function sortChains({
  chains,
  direction,
  chainOrder = [],
}: {
  direction: 'to' | 'from';
  chains: IBridgeChain[];
  chainOrder?: number[];
}) {
  const sortedChains = chains.sort((a, b) => {
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
  });

  return sortedChains;
}
