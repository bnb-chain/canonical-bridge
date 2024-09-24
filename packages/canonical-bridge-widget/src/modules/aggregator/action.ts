import { createAction } from '@/modules/store/createAction';
import { IAggregatorState } from '@/modules/aggregator/reducer';

export const setTokenPrices = createAction<IAggregatorState['tokenPrices']>(
  'aggregator/setTokenPrices',
);
