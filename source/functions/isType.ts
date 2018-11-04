/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action } from "../common/types";
import { ActionCreator, Creator } from "./action";

export function isType<T extends { [key: string]: ActionCreator<string, Creator> }>(action: Action<string>, creators: T): action is ReturnType<T[keyof T]>;
export function isType<T extends ActionCreator<string, Creator>>(action: Action<string>, creator: T): action is ReturnType<T>;
export function isType(action: Action<string>, arg: { [key: string]: ActionCreator<string, Creator> } | ActionCreator<string, Creator>): boolean {
    if (arg.type !== undefined) {
        return action.type === arg.type;
    }
    const types = Object.keys(arg).map(key => arg[key].type);
    return types.some(type => action.type === type);
}
