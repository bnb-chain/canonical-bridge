import { createReducer } from '@reduxjs/toolkit';

import * as actions from '@/modules/i18n/action';

export interface I18nState {
  messages: Record<string, string>;
  locale: string;
}

const initialState: I18nState = {
  messages: {},
  locale: 'en',
};

export default createReducer(initialState, (builder) => {
  builder.addCase(actions.updateI18n, (state, { payload }) => ({
    ...state,
    ...payload,
  }));
});
