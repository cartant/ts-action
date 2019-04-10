/**
 * @license
 *
 * MIT License
 *
 * Copyright (c) 2017-2019 Nicholas Jamieson and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { ActionCreator, ActionType } from "./action";
import { Action } from "./types";

export type On<S> = (state: S, action: Action) => S;
export type OnReducer<S, C extends ActionCreator[]> = (state: S, action: ActionType<C[number]>) => S;
export type Reducer<S> = (state: S | undefined, action: Action) => S;

export function on<C1 extends ActionCreator, S>(creator1: C1, reducer: OnReducer<S, [C1]>): { reducer: On<S>, types: string[] };
export function on<C1 extends ActionCreator, C2 extends ActionCreator, S>(creator1: C1, creator2: C2, reducer: OnReducer<S, [C1, C2]>): { reducer: On<S>, types: string[] };
export function on<C1 extends ActionCreator, C2 extends ActionCreator, C3 extends ActionCreator, S>(creator1: C1, creator2: C2, creator3: C3, reducer: OnReducer<S, [C1, C2, C3]>): { reducer: On<S>, types: string[] };
export function on<S>(creator: ActionCreator, ...rest: (ActionCreator | OnReducer<S, [ActionCreator]>)[]): { reducer: On<S>, types: string[] };
export function on(...args: (ActionCreator | Function)[]): { reducer: Function, types: string[] } {
    const reducer = args.pop() as Function;
    const types = args.reduce((result, creator) => [
        ...result,
        (creator as ActionCreator).type
    ], [] as string[]);
    return { reducer, types };
}

export function reducer<S>(ons: { reducer: On<S>, types: string[] }[], initialState: S): Reducer<S> {
    const map = new Map<string, On<S>>();
    ons.forEach(on => on.types.forEach(type => map.set(type, on.reducer)));
    return function (state: S = initialState, action: Action): S {
        const reducer = map.get(action.type);
        return reducer ? reducer(state, action) : state;
    };
}
