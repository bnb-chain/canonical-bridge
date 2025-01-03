import { ICBridgeMaxMinSendAmt } from '@bnb-chain/canonical-bridge-sdk';

import { createReducer } from '@/modules/store/createReducer';
import * as actions from '@/modules/aggregator/action';

export interface IAggregatorState {
  tokenPrices: {
    cmcPrices: Record<string, { price: number }>;
    llamaPrices: Record<string, { price: number }>;
  };
  tokenBalances: Record<string, string | undefined>;
  isLoadingTokenPrices: boolean;
  isLoadingTokenBalances: boolean;
  bridgeMaxMin: {
    cBridge: ICBridgeMaxMinSendAmt;
  };
}

const initStates: IAggregatorState = {
  tokenPrices: {
    cmcPrices: {},
    llamaPrices: {},
  },
  tokenBalances: {},
  isLoadingTokenPrices: false,
  isLoadingTokenBalances: false,
  bridgeMaxMin: {
    cBridge: { max: '0', min: '0' },
  },
};

export default createReducer(initStates, (builder) => {
  builder.addCase(actions.setTokenPrices, (state, { payload }) => ({
    ...state,
    tokenPrices: {
      cmcPrices: payload?.cmcPrices ?? {},
      llamaPrices: payload?.llamaPrices ?? {},
    },
  }));

  builder.addCase(actions.setTokenBalances, (state, { payload }) => ({
    ...state,
    tokenBalances: payload ?? {},
  }));

  builder.addCase(actions.setIsLoadingTokenPrices, (state, { payload }) => ({
    ...state,
    isLoadingTokenPrices: payload,
  }));

  builder.addCase(actions.setIsLoadingTokenBalances, (state, { payload }) => ({
    ...state,
    isLoadingTokenBalances: payload,
  }));

  builder.addCase(actions.setCBridgeMaxMinSendAmt, (state, { payload }) => ({
    ...state,
    bridgeMaxMin: {
      ...state.bridgeMaxMin,
      cBridge: payload,
    },
  }));
});
