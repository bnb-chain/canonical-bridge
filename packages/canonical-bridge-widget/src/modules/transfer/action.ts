import { createAction } from '@/modules/store/createAction';
import { ITransferState } from '@/modules/transfer/reducer';

export const setSelectedToken = createAction<ITransferState['selectedToken']>(
  'transfer/setSelectedToken',
);

export const setToToken = createAction<ITransferState['toToken']>('transfer/toToken');

export const setFromChain = createAction<ITransferState['fromChain']>('transfer/setFromChain');

export const setSendValue = createAction<ITransferState['sendValue']>('transfer/setSendValue');

export const setToChain = createAction<ITransferState['toChain']>('transfer/setToChain');
export const setSlippage = createAction<ITransferState['slippage']>('transfer/setSlippage');
export const setTransferActionInfo = createAction<ITransferState['transferActionInfo']>(
  'transfer/setTransferActionInfo',
);
export const setError = createAction<ITransferState['error']>('transfer/setError');

export const setIsGlobalFeeLoading = createAction<ITransferState['isGlobalFeeLoading']>(
  'transfer/setIsGlobalFeeLoading',
);

export const setIsTransferable = createAction<ITransferState['isTransferable']>(
  'transfer/setIsTransferable',
);

export const setIsRefreshing = createAction<ITransferState['isRefreshing']>(
  'transfer/setIsRefreshing',
);

export const setEstimatedAmount = createAction<ITransferState['estimatedAmount']>(
  'transfer/setEstimatedAmount',
);

export const setRouteError = createAction<ITransferState['routeError']>('transfer/setRouteError');

export const setToAccount = createAction<ITransferState['toAccount']>('transfer/setToAccount');

export const setRouteFees = createAction<ITransferState['routeFees']>('transfer/setRouteFees');

export const setIsToAddressChecked = createAction<ITransferState['isToAddressChecked']>(
  'transfer/setIsToAddressChecked',
);

export const setIsRoutesModalOpen = createAction<ITransferState['isRoutesModalOpen']>(
  'transfer/setIsRoutesModalOpen',
);

export const setIsManuallyReload = createAction<ITransferState['isManuallyReload']>(
  'transfer/setIsManuallyReload',
);

export const setIsFailedGetQuoteModalOpen = createAction<
  ITransferState['isFailedGetQuoteModalOpen']
>('transfer/setIsFailedGetQuoteModalOpen');
export const setIsSummaryModalOpen = createAction<ITransferState['isSummaryModalOpen']>(
  'transfer/setIsSummaryModalOpen',
);
