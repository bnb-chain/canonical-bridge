import { createAction } from '@/modules/store/createAction';
import { IWalletState } from '@/modules/wallet/reducer';

export const setIsOpenSwitchingTipsModal = createAction<IWalletState['isOpenSwitchingTipsModal']>(
  'wallet/isOpenSwitchingTipsModal',
);
