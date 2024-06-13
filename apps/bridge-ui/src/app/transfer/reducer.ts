import { ChainInfo, TokenInfo } from '@/bridges/index/types';
import * as actions from './action';
import { createReducer } from '@reduxjs/toolkit';

export type TransferState = {
  fromChain?: ChainInfo;
  sendValue: string;
  toChain?: ChainInfo;
  receiveValue: string;
  selectedToken?: TokenInfo;
  slippage?: number;
};

const initStates: TransferState = {
  fromChain: undefined,
  sendValue: '',
  toChain: undefined,
  receiveValue: '',
  selectedToken: undefined,
  slippage: undefined,
};

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
    sendValue: payload,
  }));

  builder.addCase(actions.setToChain, (state, { payload }) => ({
    ...state,
    toChain: payload,
  }));
  builder.addCase(actions.setReceiveValue, (state, { payload }) => ({
    ...state,
    receiveValue: payload,
  }));

  builder.addCase(actions.setSlippage, (state, { payload }) => ({
    ...state,
    slippage: payload,
  }));
});
