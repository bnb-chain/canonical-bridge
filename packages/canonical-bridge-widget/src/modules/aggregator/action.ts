import { createAction } from '@/modules/store/createAction';
import { IAggregatorState } from '@/modules/aggregator/reducer';

export const setTokenPrices = createAction<IAggregatorState['tokenPrices'] | undefined>(
  'aggregator/setTokenPrices',
);

export const setTokenBalances = createAction<IAggregatorState['tokenBalances'] | undefined>(
  'aggregator/setTokenBalances',
);

export const setIsLoadingTokenPrices = createAction<IAggregatorState['isLoadingTokenPrices']>(
  'aggregator/setIsLoadingTokenPrices',
);

export const setIsLoadingTokenBalances = createAction<IAggregatorState['isLoadingTokenBalances']>(
  'aggregator/setIsLoadingTokenBalances',
);
