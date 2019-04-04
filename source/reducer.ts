/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType, Creator } from "./action";
import { Action } from "./types";

export type On<S> = (state: S, action: Action<string>) => S;
export type Reducer<S> = (state: S | undefined, action: Action<string>) => S;

export function on<C extends ActionCreator<string, Creator>, S>(ctor: C, reducer: (state: S, action: ActionType<C>) => S): { reducer: On<S>, types: string[] };
export function on<C extends ActionCreator<string, Creator>[], S>(ctors: C, reducer: (state: S, action: ActionType<C[number]>) => S): { reducer: On<S>, types: string[] };
/** @deprecated Use an array literal instead of an object literal */
export function on<C extends { [key: string]: ActionCreator<string, Creator> }, S>(ctors: C, reducer: (state: S, action: ActionType<C[keyof C]>) => S): { reducer: On<S>, types: string[] };
export function on<S>(
    c: ActionCreator<string, Creator> |
        ActionCreator<string, Creator>[] |
        { [key: string]: ActionCreator<string, Creator> },
    reducer: Function
): { reducer: Function, types: string[] } {
    const types = typeof c === "function" ?
        [c.type] :
        Array.isArray(c)
            ? c.reduce((t, ctor) => [...t, ctor.type], [] as string[])
            : Object.keys(c).reduce((t, k) => [...t, c[k].type], [] as string[]);
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
