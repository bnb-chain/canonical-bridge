import { IBridgeChain, IBridgeToken } from '@bnb-chain/canonical-bridge-sdk';

import * as actions from '@/modules/transfer/action';
import { createReducer } from '@/modules/store/createReducer';
import {
  IBridgeError,
  IEstimatedAmount,
  IRouteFees,
  ITransferActionInfo,
} from '@/modules/transfer/types';

export interface ITransferState {
  fromChain?: IBridgeChain;
  sendValue: string;
  toChain?: IBridgeChain;
  selectedToken?: IBridgeToken;
  toToken?: IBridgeToken;
  slippage: number;
  transferActionInfo?: ITransferActionInfo;
  error?: { text: string; bridgeType?: string };
  routeError?: IBridgeError;
  isGlobalFeeLoading?: boolean;
  isTransferable: boolean;
  isRefreshing?: boolean;
  estimatedAmount?: IEstimatedAmount;
  routeFees?: IRouteFees;
  isToAddressChecked?: boolean;
  isManuallyReload: boolean;
  toAccount: {
    address?: string;
  };
  isRoutesModalOpen: boolean;
  toTokens: IBridgeToken[];
  isFailedGetQuoteModalOpen: boolean;
  isFeeTimeoutModalOpen: boolean;
  isSummaryModalOpen: boolean;
  refreshAnimationProgress: number;
}

const initStates: ITransferState = {
  fromChain: undefined,
  sendValue: '',
  toChain: undefined,
  selectedToken: undefined,
  slippage: 10000, // 1% for cBridge
  transferActionInfo: undefined,
  error: {
    text: '',
    bridgeType: undefined,
  },
  routeError: undefined,
  isGlobalFeeLoading: false,
  isTransferable: true,
  isRefreshing: false,
  estimatedAmount: undefined,
  routeFees: undefined,
  isToAddressChecked: false,
  toAccount: {
    address: '',
  },
  isRoutesModalOpen: false,
  toTokens: [],
  isManuallyReload: false,
  isFailedGetQuoteModalOpen: false,
  isFeeTimeoutModalOpen: false,
  isSummaryModalOpen: false,
  refreshAnimationProgress: 0,
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

  builder.addCase(actions.setIsToAddressChecked, (state, { payload }) => ({
    ...state,
    isToAddressChecked: payload,
  }));

  builder.addCase(actions.setEstimatedAmount, (state, { payload }) => ({
    ...state,
    estimatedAmount: { ...state.estimatedAmount, ...payload },
  }));

  builder.addCase(actions.setRouteError, (state, { payload }) => ({
    ...state,
    routeError: { ...state.routeError, ...payload },
  }));

  builder.addCase(actions.setRouteFees, (state, { payload }) => ({
    ...state,
    routeFees: { ...state.routeFees, ...payload },
  }));

  builder.addCase(actions.setToAccount, (state, { payload }) => ({
    ...state,
    toAccount: {
      ...state.toAccount,
      ...payload,
    },
  }));

  builder.addCase(actions.setIsRoutesModalOpen, (state, { payload }) => ({
    ...state,
    isRoutesModalOpen: payload,
  }));

  builder.addCase(actions.setToTokens, (state, { payload }) => ({
    ...state,
    toTokens: payload,
  }));

  builder.addCase(actions.setIsManuallyReload, (state, { payload }) => ({
    ...state,
    isManuallyReload: payload,
  }));

  builder.addCase(actions.setIsFailedGetQuoteModalOpen, (state, { payload }) => ({
    ...state,
    isFailedGetQuoteModalOpen: payload,
  }));
  builder.addCase(actions.setIsFeeTimeoutModalOpen, (state, { payload }) => ({
    ...state,
    isFeeTimeoutModalOpen: payload,
  }));
  builder.addCase(actions.setIsSummaryModalOpen, (state, { payload }) => ({
    ...state,
    isSummaryModalOpen: payload,
  }));
  builder.addCase(actions.setRefreshAnimationProgress, (state, { payload }) => ({
    ...state,
    refreshAnimationProgress: payload,
  }));
});
