type Listener<T> = (state: T) => void;

type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;

type GetState<T> = () => T;

export interface StoreApi<T> {
  getState: GetState<T>;
  setState: SetState<T>;
  subscribe: (listener: Listener<T>) => () => void;
}

export const createStore = <T extends object>(initial: T): StoreApi<T> => {
  let state = initial;
  const listeners = new Set<Listener<T>>();

  const setState: SetState<T> = (partial) => {
    const next = typeof partial === 'function' ? { ...state, ...(partial as (state: T) => Partial<T>)(state) } : { ...state, ...partial };
    state = next;
    listeners.forEach((listener) => listener(state));
  };

  const getState: GetState<T> = () => state;

  const subscribe = (listener: Listener<T>) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  };

  return { getState, setState, subscribe };
};
