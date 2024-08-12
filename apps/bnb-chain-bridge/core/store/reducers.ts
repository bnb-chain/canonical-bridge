import { UnknownAction, combineReducers } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import common from '@/modules/common/reducer';
import transfer from '@/modules/transfer/reducer';
import i18n from '@/modules/i18n/reducer';
import bridges from '@/modules/bridges/main/reducer';

const moduleReducers = combineReducers({
  bridges,
  common,
  transfer,
  i18n,
});

const reducers = (state: any, action: UnknownAction) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...(action as any).payload,
    } as ReturnType<typeof moduleReducers>;
    return nextState;
  } else {
    return moduleReducers(state, action);
  }
};

export default reducers;
