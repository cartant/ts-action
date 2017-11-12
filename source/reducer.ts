/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action, ActionCreator } from "./interfaces";

export type Reducer<S> = (state: S, action: Action<string>) => S;

export function on<T extends string, A extends Action<string>, S>(creator: ActionCreator<T, A>, reducer: (state: S, action: A) => S): { reducer: Reducer<S>, type: string } {
    const r = reducer as Reducer<S>;
    return { reducer: r, type: creator.type };
}

export function reducer<S>(ons: { reducer: Reducer<S>, type: string }[], defaultState: S): Reducer<S> {
    const map = new Map<string, Reducer<S>>();
    ons.forEach(on => map.set(on.type, on.reducer));
    return function (state: S = defaultState, action: Action<string>): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
