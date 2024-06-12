import { ChainInfo, TokenInfo } from '@/bridges/index/types';
import * as actions from './action';
import { createReducer } from '@reduxjs/toolkit';

const initStates = {
  fromChain: {} as ChainInfo,
  sendValue: '',
  toChain: {} as ChainInfo,
  receiveValue: '',
  selectedToken: {} as TokenInfo,
};

export type TransferState = typeof initStates;

export default createReducer(initStates, (builder) => {
  builder.addCase(actions.setSelectedToken, (state, { payload }) => ({
    ...state,
    selectedToken: payload,
  }));

  builder.addCase(actions.setFromChain, (state, { payload }) => ({
    ...state,
    fromChain: payload,
  }));
  builder.addCase(actions.setSendValue, (state, { payload }) => ({
    ...state,
    setSendValue: payload,
  }));

  builder.addCase(actions.setToChain, (state, { payload }) => ({
    ...state,
    toChain: payload,
  }));
  builder.addCase(actions.setReceiveValue, (state, { payload }) => ({
    ...state,
    receiveValue: payload,
  }));
});
