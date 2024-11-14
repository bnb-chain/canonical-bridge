import { IBridgeToken } from '@/aggregator/types';

export function sortTokens({
  tokens = [],
  tokenOrder = [],
}: {
  tokens?: IBridgeToken[];
  tokenOrder?: string[];
}) {
  const order = tokenOrder.map((item) => item.toUpperCase());

  const sortedTokens = [...tokens].sort((a, b) => {
    const aSymbol = a.displaySymbol.toUpperCase();
    const bSymbol = b.displaySymbol.toUpperCase();

    const isA = a.isCompatible;
    const isB = b.isCompatible;

    const indexA = order.indexOf(aSymbol);
    const indexB = order.indexOf(bSymbol);

    if (isA && !isB) {
      return -1;
    }
    if (!isA && isB) {
      return 1;
    }

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
  });

  return sortedTokens;
}
