import * as actions from '@/modules/transfer/action';
import {
  BridgeChain,
  BridgeToken,
  TransferActionInfo,
  IEstimatedAmount,
} from '@/modules/bridges/main/types';
import { createReducer } from '@/modules/store/createReducer';

export type TransferState = {
  fromChain?: BridgeChain;
  sendValue: string;
  toChain?: BridgeChain;
  selectedToken?: BridgeToken;
  toToken?: BridgeToken;
  slippage: number;
  transferActionInfo?: TransferActionInfo;
  error?: string;
  isGlobalFeeLoading?: boolean;
  isTransferable: boolean;
  isRefreshing?: boolean;
  estimatedAmount?: IEstimatedAmount;
  toAccount: {
    address?: string;
  };
};

const initStates: TransferState = {
  fromChain: undefined,
  sendValue: '',
  toChain: undefined,
  selectedToken: undefined,
  slippage: 10000, // 1% for cBridge
  transferActionInfo: undefined,
  error: '',
  isGlobalFeeLoading: false,
  isTransferable: true,
  isRefreshing: false,
  estimatedAmount: undefined,
  toAccount: {
    address: '',
  },
};

export default createReducer(initStates, (builder) => {
  builder.addCase(actions.setSelectedToken, (state, { payload }) => ({
    ...state,
    selectedToken: payload,
  }));
  builder.addCase(actions.setToToken, (state, { payload }) => ({
    ...state,
    toToken: payload,
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

  builder.addCase(actions.setSlippage, (state, { payload }) => ({
    ...state,
    slippage: payload,
  }));
  builder.addCase(actions.setTransferActionInfo, (state, { payload }) => ({
    ...state,
    transferActionInfo: payload,
  }));
  builder.addCase(actions.setError, (state, { payload }) => ({
    ...state,
    error: payload,
  }));

  builder.addCase(actions.setIsGlobalFeeLoading, (state, { payload }) => ({
    ...state,
    isGlobalFeeLoading: payload,
  }));

  builder.addCase(actions.setIsTransferable, (state, { payload }) => ({
    ...state,
    isTransferable: payload,
  }));
  builder.addCase(actions.setIsRefreshing, (state, { payload }) => ({
    ...state,
    isRefreshing: payload,
  }));

  builder.addCase(actions.setEstimatedAmount, (state, { payload }) => ({
    ...state,
    estimatedAmount: { ...state.estimatedAmount, ...payload },
  }));

  builder.addCase(actions.setToAccount, (state, { payload }) => ({
    ...state,
    toAccount: {
      ...state.toAccount,
      ...payload,
    },
  }));
});
