/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCtor, Ctor } from "./action";
import { Action } from "./interfaces";

export type Reducer<S> = (state: S | undefined, action: Action<string>) => S;

export function on<C extends ActionCtor<string, {}, Ctor<{}>>, S>(ctor: C, reducer: (state: S, action: C["action"]) => S): { reducer: Reducer<S>, types: string[] };
export function on<C extends { [key: string]: ActionCtor<string, {}, Ctor<{}>> }, S>(ctors: C, reducer: (state: S, action: C[keyof C]["action"]) => S): { reducer: Reducer<S>, types: string[] };
export function on<S>(c: any, reducer: any): { reducer: Reducer<S>, types: string[] } {
    const types = typeof c === "function" ?
        [c.type] :
        Object.keys(c).reduce((t, k) => [...t, c[k].type], [] as string[]);
    return { reducer, types };
}

export function reducer<S>(ons: { reducer: Reducer<S>, types: string[] }[], initialState: S): Reducer<S> {
    const map = new Map<string, Reducer<S>>();
    ons.forEach(on => on.types.forEach(type => map.set(type, on.reducer)));
    return function (state: S = initialState, action: Action<string>): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
