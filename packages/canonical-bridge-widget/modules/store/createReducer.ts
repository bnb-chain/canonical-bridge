import { ActionCreator } from '@/modules/store/createAction';

type ActionFn<T = unknown, K = unknown> = (state: T, { payload }: { payload: K }) => T;

interface Builder<T> {
  addCase<P extends ActionCreator<any>>(
    actionCreator: P,
    actionFn: ActionFn<T, Parameters<P>[0]>,
  ): void;
}

export function createReducer<T>(initStates: T, callback: (builder: Builder<T>) => void) {
  const actions: Record<string, (state: T, payload: any) => T> = {};

  const builder: Builder<T> = {
    addCase<P extends ActionCreator<any>>(
      actionCreator: P,
      actionFn: ActionFn<T, Parameters<P>[0]>,
    ) {
      const type = actionCreator(undefined).type;
      actions[type] = actionFn;
    },
  };

  callback(builder);

  return {
    getInitialState() {
      return initStates;
    },
    getReducer() {
      return actions;
    },
  };
}
