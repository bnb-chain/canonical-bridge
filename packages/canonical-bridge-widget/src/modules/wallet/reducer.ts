import { createReducer } from '@/modules/store/createReducer';
import * as actions from '@/modules/wallet/action';

export interface IWalletState {
  isOpenSwitchingTipsModal: boolean;
}

const initStates: IWalletState = {
  isOpenSwitchingTipsModal: false,
};

export default createReducer(initStates, (builder) => {
  builder.addCase(actions.setIsOpenSwitchingTipsModal, (state, { payload }) => ({
    ...state,
    isOpenSwitchingTipsModal: payload,
  }));
});
