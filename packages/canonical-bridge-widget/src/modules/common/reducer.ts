import { FooterMenuProps } from '@bnb-chain/space';

import * as actions from '@/modules/common/action';
import { createReducer } from '@/modules/store/createReducer';

export interface CommonState {
  footerMenus: FooterMenuProps[];
}

const initialState: CommonState = {
  footerMenus: [],
};

export default createReducer(initialState, (builder) => {
  builder.addCase(actions.setFooterMenus, (state, { payload }) => ({
    ...state,
    footerMenus: payload,
  }));
});
