/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType } from "./action";
import { Action } from "./types";

export type On<S> = (state: S, action: Action) => S;
type OnMapping<S> = { reducer: On<S>, types: string[] };
export type OnReducer<S, C extends ActionCreator[]> = (state: S, action: ActionType<C[number]>) => S;
export type Reducer<S> = (state: S | undefined, action: Action) => S;

export function on<C1 extends ActionCreator, S>(creator1: C1, reducer: OnReducer<S, [C1]>): OnMapping<S>;
export function on<C1 extends ActionCreator, C2 extends ActionCreator, S>(creator1: C1, creator2: C2, reducer: OnReducer<S, [C1, C2]>): OnMapping<S>;
export function on<C1 extends ActionCreator, C2 extends ActionCreator, C3 extends ActionCreator, S>(creator1: C1, creator2: C2, creator3: C3, reducer: OnReducer<S, [C1, C2, C3]>): OnMapping<S>;
export function on<S>(creator: ActionCreator, ...rest: (ActionCreator | OnReducer<S, [ActionCreator]>)[]): OnMapping<S>;
export function on(...args: (ActionCreator | Function)[]): { reducer: Function, types: string[] } {
    const reducer = args.pop() as Function;
    const types = args.reduce((result, creator) => [
        ...result,
        (creator as ActionCreator).type
    ], [] as string[]);
    return { reducer, types };
}

/** @deprecated Use the rest-parameter signature instead. */
export function reducer<S>(ons: OnMapping<S>[], initialState: S): Reducer<S>;
export function reducer<S>(initialState: S, ...ons: OnMapping<S>[]): Reducer<S>;
export function reducer<S>(...args: (S | OnMapping<S> | OnMapping<S>[])[]): Reducer<S> {
    const map = new Map<string, On<S>>();
    const deprecated = (args.length === 2) &&
        Array.isArray(args[0]) &&
        (typeof (args[0] as OnMapping<S>[])[0].reducer === "function");
    const initialState = deprecated
        ? args[1] as S
        : args.shift() as S;
    const ons = deprecated
        ? args[0] as OnMapping<S>[]
        : args as OnMapping<S>[];
    ons.forEach(on => on.types.forEach(type => map.set(type, on.reducer)));
    return function (state: S = initialState, action: Action): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
