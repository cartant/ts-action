/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action } from "../common/types";
import { ActionCtor, Ctor } from "./action";
import { isType } from "./isType";

export function guard<T extends { [key: string]: ActionCtor<string, {}, Ctor<{}>> }>(ctors: T): (action: Action<string>) => action is InstanceType<T[keyof T]>;
export function guard<T extends ActionCtor<string, {}, Ctor<{}>>>(ctor: T): (action: Action<string>) => action is InstanceType<T>;
export function guard(arg: any): (action: Action<string>) => boolean {
    return (action: Action<string>) => isType(action, arg);
}
