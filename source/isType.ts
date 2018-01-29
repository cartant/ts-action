/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action, ActionCreator } from "./interfaces";

export function isType<T1 extends string, A1 extends Action<string>>(action: Action<string>, creator1: ActionCreator<T1, A1>): action is A1;
export function isType<T1 extends string, A1 extends Action<string>, T2 extends string, A2 extends Action<string>>(action: Action<string>, creator1: ActionCreator<T1, A1>, creator2: ActionCreator<T2, A2>): action is A1 | A2;
export function isType<T1 extends string, A1 extends Action<string>, T2 extends string, A2 extends Action<string>, T3 extends string, A3 extends Action<string>>(action: Action<string>, creator1: ActionCreator<T1, A1>, creator2: ActionCreator<T2, A2>, creator3: ActionCreator<T3, A3>): action is A1 | A2 | A3;
export function isType(action: Action<string>, creator: ActionCreator<string, Action<string>>, ...others: ActionCreator<string, Action<string>>[]): boolean;
export function isType(action: Action<string>, ...creators: ActionCreator<string, Action<string>>[]): boolean {
    return creators.some(creator => action.type === creator.type);
}
