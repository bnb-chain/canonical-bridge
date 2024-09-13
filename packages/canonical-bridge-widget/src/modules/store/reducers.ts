import common from '@/modules/common/reducer';
import transfer from '@/modules/transfer/reducer';
import bridges from '@/modules/bridges/reducer';

const reducers = {
  bridges,
  common,
  transfer,
} as const;

type Reducers = typeof reducers;
type Namespace = keyof Reducers;

type State = {
  [K in Namespace]: ReturnType<Reducers[K]['getInitialState']>;
};

// TODO
type Reducer = Record<string, any>;

export function getInitialState() {
  const state = Object.fromEntries(
    Object.entries(reducers).map(([key, value]) => {
      return [key, value.getInitialState()];
    }),
  );
  return state as State;
}

export function getReducers() {
  const reducer: Reducer = Object.values(reducers).reduce(
    (prev, value) => ({
      ...prev,
      ...value.getReducer(),
    }),
    {},
  );

  return (state: AppState, action: any = {}) => {
    const { type, payload } = action;

    const namespace = type.split('/')[0] as Namespace;
    const nextState = reducer[type](state[namespace], { payload });

    const finalState = {
      ...state,
      [namespace]: {
        ...nextState,
      },
    };

    return finalState;
  };
}

export type AppState = ReturnType<typeof getInitialState>;
