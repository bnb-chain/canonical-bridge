import { isChainOrTokenCompatible } from '@/modules/aggregator/shared/isChainOrTokenCompatible';
import { IBridgeTokenWithBalance } from '@/modules/aggregator/types';

export function sortTokens({
  tokens = [],
  orders = [],
}: {
  tokens?: IBridgeTokenWithBalance[];
  orders?: string[];
}) {
  const tokenOrders = orders.map((item) => item.toUpperCase());

  const sortedTokens = [...tokens].sort((a, b) => {
    const aSymbol = a.displaySymbol.toUpperCase();
    const bSymbol = b.displaySymbol.toUpperCase();

    const isA = isChainOrTokenCompatible(a);
    const isB = isChainOrTokenCompatible(b);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
    }

    if (isA && isB) {
      if (a.value && b.value) {
        return b.value - a.value;
      }
      if (a.value && !b.value) {
        return -1;
      }
      if (!a.value && b.value) {
        return 1;
      }
    }

    const indexA = tokenOrders.indexOf(aSymbol);
    const indexB = tokenOrders.indexOf(bSymbol);

    if (indexA > -1 && indexB === -1) {
      return -1;
    }
    if (indexA === -1 && indexB > -1) {
      return 1;
    }
    if (indexA > -1 && indexB > -1) {
      return indexA - indexB;
    }

    return a.displaySymbol < b.displaySymbol ? -1 : 1;
  });

  return sortedTokens;
}
