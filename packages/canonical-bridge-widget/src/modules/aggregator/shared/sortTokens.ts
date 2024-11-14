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

    const isA = a.isCompatible;
    const isB = b.isCompatible;

    const indexA = tokenOrders.indexOf(aSymbol);
    const indexB = tokenOrders.indexOf(bSymbol);

    const sortWithPredefinedOrders = () => {
      if (indexA > -1 && indexB === -1) {
        return -1;
      }
      if (indexA === -1 && indexB > -1) {
        return 1;
      }
      if (indexA > -1 && indexB > -1) {
        return indexA - indexB;
      }

      return aSymbol < bSymbol ? -1 : 1;
    };

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

      const aBalance = Number(a.balance);
      const bBalance = Number(b.balance);
      if (aBalance && bBalance) {
        return sortWithPredefinedOrders();
      }
      if (aBalance && !bBalance) {
        return -1;
      }
      if (!aBalance && bBalance) {
        return 1;
      }
    }

    return sortWithPredefinedOrders();
  });

  return sortedTokens;
}
