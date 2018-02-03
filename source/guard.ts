/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCtor, Ctor } from "./action";
import { Action } from "./interfaces";
import { isType } from "./isType";

export function guard<T extends ActionCtor<string, {}, Ctor<{}>>>(ctor: T): (action: Action<string>) => action is T["action"] {
    return (action: Action<string>): action is T["action"] => isType(action, ctor);
}
