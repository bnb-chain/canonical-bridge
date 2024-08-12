import { createReducer } from '@reduxjs/toolkit';
import { Chain } from 'viem';

import * as actions from '@/modules/bridges/main/action';

export interface BridgesState {
  evmConnectData: Chain[];
}

const initialState: BridgesState = {
  evmConnectData: [],
};

export default createReducer(initialState, (builder) => {
  builder.addCase(actions.setEvmConnectData, (state, { payload }) => ({
    ...state,
    evmConnectData: payload,
  }));
});
