import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';

import reducer from './reducers';

const makeStore = () => {
  return configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware();
    },
  });
};

export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });

export type AppState = ReturnType<typeof reducer>;
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore['dispatch'];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  AppState,
  unknown,
  Action
>;
