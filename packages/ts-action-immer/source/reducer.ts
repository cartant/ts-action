/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Draft, produce } from "immer";
import { Action, ActionCreator, ActionType } from "ts-action";

export type On<S> = {
  reducer: (state: Draft<S>, action: Action) => S | void;
  types: string[];
};
export type OnReducer<S, C extends ActionCreator[]> = (
  state: Draft<S>,
  action: ActionType<C[number]>
) => S | void;
export type Reducer<S> = (state: S | undefined, action: Action) => S;

export function on<C1 extends ActionCreator, S>(
  creator1: C1,
  reducer: OnReducer<S, [C1]>
): On<S>;
export function on<C1 extends ActionCreator, C2 extends ActionCreator, S>(
  creator1: C1,
  creator2: C2,
  reducer: OnReducer<S, [C1, C2]>
): On<S>;
export function on<
  C1 extends ActionCreator,
  C2 extends ActionCreator,
  C3 extends ActionCreator,
  S
>(
  creator1: C1,
  creator2: C2,
  creator3: C3,
  reducer: OnReducer<S, [C1, C2, C3]>
): On<S>;
export function on<S>(
  creator: ActionCreator,
  ...rest: (ActionCreator | OnReducer<S, [ActionCreator]>)[]
): On<S>;
export function on(
  ...args: (ActionCreator | Function)[]
): { reducer: Function; types: string[] } {
  const reducer = args.pop() as Function;
  const types = args.reduce(
    (result, creator) => [...result, (creator as ActionCreator).type],
    [] as string[]
  );
  return { reducer, types };
}

export function reducer<S>(initialState: S, ...ons: On<S>[]): Reducer<S> {
  const map = new Map<string, (state: Draft<S>, action: Action) => S | void>();
  for (let on of ons) {
    for (let type of on.types) {
      map.set(type, on.reducer);
    }
  }
  return function(state: S = initialState, action: Action): S {
    const reducer = map.get(action.type);
    return reducer
      ? (produce(state, draft => reducer(draft, action)) as S)
      : state;
  };
}