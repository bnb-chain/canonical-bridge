import React, { useContext, useMemo, useReducer } from 'react';

import { AppState, getInitialState, getReducers } from './reducers';

interface StoreContextProps {
  state: AppState;
  dispatch: (params: { type: string; payload: any }) => void;
}

const StoreContext = React.createContext({} as StoreContextProps);

export interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider(props: StoreProviderProps) {
  const { children } = props;

  const [state, dispatch] = useReducer(getReducers(), getInitialState());

  const value = useMemo(() => {
    return {
      state,
      dispatch,
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useAppDispatch() {
  return useContext(StoreContext).dispatch;
}

export function useAppSelector<P = unknown>(selector: (state: AppState) => P) {
  const { state } = useContext(StoreContext);
  return selector(state) as P;
}
