import React, { useContext, useMemo, useReducer } from 'react';

import { Action } from '@/modules/store/createAction';

import { AppState, getInitialState, getReducers } from './reducers';

interface StoreContextProps {
  state: AppState;
  dispatch<T>(params: Action<T>): void;
}

const StoreContext = React.createContext({} as StoreContextProps);

export interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider(props: StoreProviderProps) {
  const [state, dispatch] = useReducer(getReducers(), getInitialState());

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return <StoreContext.Provider value={value} {...props} />;
}

export function useAppDispatch() {
  return useContext(StoreContext).dispatch;
}

export function useAppSelector<P = unknown>(selector: (state: AppState) => P) {
  const { state } = useContext(StoreContext);
  return selector(state) as P;
}
