import { useMemo } from 'react';

import { useTokenPrice } from '@/modules/aggregator/providers/TokenPricesProvider';
import { useAppSelector } from '@/modules/store/StoreProvider';
import { UPPER_DOLLAR_LIMIT } from '@/core/constants';

export function useTokenUpperLimit() {
  const selectedToken = useAppSelector((state) => state.transfer.selectedToken);

  const { getTokenPrice } = useTokenPrice();

  const upperLimit = useMemo(() => {
    const price = getTokenPrice(selectedToken);
    if (price) {
      return UPPER_DOLLAR_LIMIT / price;
    }
  }, [getTokenPrice, selectedToken]);

  return upperLimit;
}
