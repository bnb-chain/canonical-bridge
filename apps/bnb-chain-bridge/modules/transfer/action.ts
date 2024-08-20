import { createAction } from '@reduxjs/toolkit';

import { TransferState } from './reducer';

export const setSelectedToken = createAction<TransferState['selectedToken']>(
  'transfer/setSelectedToken',
);

export const setToToken = createAction<TransferState['toToken']>('transfer/toToken');

export const setFromChain = createAction<TransferState['fromChain']>('transfer/setFromChain');

export const setSendValue = createAction<TransferState['sendValue']>('transfer/setSendValue');

export const setToChain = createAction<TransferState['toChain']>('transfer/setToChain');
export const setReceiveValue = createAction<TransferState['receiveValue']>(
  'transfer/setReceiveValue',
);
export const setSlippage = createAction<TransferState['slippage']>('transfer/setSlippage');
export const setTransferActionInfo = createAction<TransferState['transferActionInfo']>(
  'transfer/setTransferActionInfo',
);
export const setError = createAction<TransferState['error']>('transfer/setError');

export const setIsGlobalFeeLoading = createAction<TransferState['isGlobalFeeLoading']>(
  'transfer/setIsGlobalFeeLoading',
);

export const setIsTransferable = createAction<TransferState['isTransferable']>(
  'transfer/setIsTransferable',
);

export const setIsRefreshing = createAction<TransferState['isRefreshing']>(
  'transfer/setIsRefreshing',
);

export const setEstimatedAmount = createAction<TransferState['estimatedAmount']>(
  'transfer/setEstimatedAmount',
);

export const setToAccount = createAction<TransferState['toAccount']>('transfer/setToAccount');
