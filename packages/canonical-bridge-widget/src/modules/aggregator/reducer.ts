import { createReducer } from '@/modules/store/createReducer';
import * as actions from '@/modules/aggregator/action';

export interface IAggregatorState {
  tokenPrices: {
    cmcPrices: Record<string, { price: number }>;
    llamaPrices: Record<string, { price: number }>;
  };
}

const initStates: IAggregatorState = {
  tokenPrices: {
    cmcPrices: {},
    llamaPrices: {},
  },
};

export default createReducer(initStates, (builder) => {
  builder.addCase(actions.setTokenPrices, (state, { payload }) => ({
    ...state,
    tokenPrices: payload,
  }));
});
