import { TransferState } from '@/app/transfer/reducer';
import { createAction } from '@reduxjs/toolkit';

export const setSelectedToken = createAction<TransferState['selectedToken']>(
  'transfer/setSelectedToken'
);

export const setFromChain = createAction<TransferState['fromChain']>(
  'transfer/setFromChain'
);

export const setSendValue = createAction<TransferState['sendValue']>(
  'transfer/setSendValue'
);

export const setToChain = createAction<TransferState['toChain']>(
  'transfer/setToChain'
);
export const setReceiveValue = createAction<TransferState['receiveValue']>(
  'transfer/setReceiveValue'
);
export const setSlippage = createAction<TransferState['slippage']>(
  'transfer/setSlippage'
);
export const setTransferActionInfo = createAction<
  TransferState['transferActionInfo']
>('transfer/setTransferActionInfo');
export const setError =
  createAction<TransferState['error']>('transfer/setError');
