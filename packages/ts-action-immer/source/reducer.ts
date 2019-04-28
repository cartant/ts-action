/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Draft, produce } from "immer";
import { Action, ActionCreator, ActionType, On } from "ts-action";

export type OnReducer<S, C extends ActionCreator[]> = (
  state: Draft<S>,
  action: ActionType<C[number]>
) => S | void;

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
  const draftReducer = args.pop() as Function;
  const reducer = (state: {}, action: Action) =>
    produce(state, (draft: Draft<{}>) => draftReducer(draft, action));
  const types = args.reduce(
    (result, creator) => [...result, (creator as ActionCreator).type],
    [] as string[]
  );
  return { reducer, types };
}
