/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType, Creator } from "./action";
import { isType } from "./isType";
import { Action } from "./types";

export function guard<T extends ActionCreator<string, Creator>>(creator: T): (action: Action<string>) => action is ActionType<T>;
export function guard<T extends ActionCreator<string, Creator>[]>(creators: T): (action: Action<string>) => action is ActionType<T[number]>;
/** @deprecated Use an array literal instead of an object literal */
export function guard<T extends { [key: string]: ActionCreator<string, Creator> }>(creators: T): (action: Action<string>) => action is ActionType<T[keyof T]>;
export function guard(arg: {}): (action: Action<string>) => boolean {
    return (action: Action<string>) => isType(action, arg);
}
