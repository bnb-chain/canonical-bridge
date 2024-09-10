import * as actions from '@/modules/i18n/action';
import { createReducer } from '@/modules/store/createReducer';

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
