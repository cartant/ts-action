/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action } from "../common/types";
import { ActionCtor, Ctor } from "./action";

export function isType<T extends { [key: string]: ActionCtor<string, {}, Ctor<{}>> }>(action: Action<string>, ctors: T): action is T[keyof T]["action"];
export function isType<T extends ActionCtor<string, {}, Ctor<{}>>>(action: Action<string>, ctor: T): action is T["action"];
export function isType(action: Action<string>, arg: any): boolean {
    if (arg.type !== undefined) {
        return action.type === arg.type;
    }
    const types = Object.keys(arg).map(key => arg[key].type);
    return types.some(type => action.type === type);
}
