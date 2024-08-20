import { createReducer } from '@reduxjs/toolkit';

import * as actions from '@/modules/bridges/action';
import { ChainConfig } from '@/modules/bridges';

export interface BridgesState {
  chainConfigs: ChainConfig[];
}

const initialState: BridgesState = {
  chainConfigs: [],
};

export default createReducer(initialState, (builder) => {
  builder.addCase(actions.setChainConfigs, (state, { payload }) => ({
    ...state,
    chainConfigs: payload,
  }));
});
