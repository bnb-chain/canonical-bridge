type Action<T> = {
  type: string;
  payload: T;
};

export type ActionCreator<T = unknown> = undefined extends T
  ? (payload?: T) => Action<T>
  : (payload: T) => Action<T>;

export function createAction<T = unknown>(type: string) {
  return ((payload: T) => ({
    type,
    payload,
  })) as ActionCreator<T>;
}
