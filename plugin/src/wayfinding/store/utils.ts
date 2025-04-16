/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";

import { SitumContext, type State } from "./index";

export const createReducer = <T>() => {
  const reducer = (state: T, action: (state: T) => T): T => {
    return action(state);
  };
  return reducer;
};

export const createStore = <T>({
  initialState,
  reducers,
}: {
  initialState: T;
  reducers: Record<string, (state: T, payload: any) => T>;
}) => {
  const actions = Object.keys(reducers).reduce((acc, r) => {
    acc[r] = (payload: any) => (state: T) => reducers[r](state, payload);
    return acc;
  }, {} as Record<string, (payload?: any) => (state: T) => T>);

  return {
    initialState,
    actions,
    reducer: createReducer<T>(),
  };
};

export const useSelector = (selector: (state: State) => any) => {
  const context = useContext(SitumContext);

  if (!context) {
    throw new Error("No SitumProvider found.");
  }

  return selector(context.state);
};

export const useDispatch = () => {
  const context = useContext(SitumContext);

  if (!context) {
    throw new Error("No SitumProvider found.");
  }

  return context.dispatch;
};
