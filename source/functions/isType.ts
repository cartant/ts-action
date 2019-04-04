/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action } from "../common/types";
import { ActionCreator, Creator } from "./action";

export function isType<T extends ActionCreator<string, Creator>>(action: Action<string>, creator: T): action is ReturnType<T>;
export function isType<T extends ActionCreator<string, Creator>[]>(action: Action<string>, creators: T): action is ReturnType<T[number]>;
export function isType<T extends { [key: string]: ActionCreator<string, Creator> }>(action: Action<string>, creators: T): action is ReturnType<T[keyof T]>;
export function isType(action: Action<string>, arg:
    ActionCreator<string, Creator> |
    ActionCreator<string, Creator>[] |
    { [key: string]: ActionCreator<string, Creator> }
): boolean {
    if (typeof arg === "function") {
        return action.type === arg.type;
    }
    const types = Array.isArray(arg)
        ? arg.map(ctor => ctor.type)
        : Object.keys(arg).map(key => arg[key].type);
    return types.some(type => action.type === type);
}
