/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType } from "./action";
import { Action } from "./types";

export type On<S> = (state: S, action: Action<string>) => S;
export type Reducer<S> = (state: S | undefined, action: Action<string>) => S;

export function on<C extends ActionCreator, S>(creator: C, reducer: (state: S, action: ActionType<C>) => S): { reducer: On<S>, types: string[] };
export function on<C extends ActionCreator[], S>(creators: C, reducer: (state: S, action: ActionType<C[number]>) => S): { reducer: On<S>, types: string[] };
export function on(
    c: ActionCreator | ActionCreator[],
    reducer: Function
): { reducer: Function, types: string[] } {
    const types = Array.isArray(c)
        ? c.reduce((t, creator) => [...t, creator.type], [] as string[])
        : [c.type];
    return { reducer, types };
}

export function reducer<S>(ons: { reducer: On<S>, types: string[] }[], initialState: S): Reducer<S> {
    const map = new Map<string, On<S>>();
    ons.forEach(on => on.types.forEach(type => map.set(type, on.reducer)));
    return function (state: S = initialState, action: Action<string>): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
