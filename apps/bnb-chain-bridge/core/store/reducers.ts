import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';

import common from '@/modules/common/reducer';
import i18n from '@/modules/i18n/reducer';
import cms from '@/modules/common/cms';

const moduleReducers = combineReducers({
  common,
  i18n,
  cms,
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
