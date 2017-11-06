/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action, ActionCreator } from "./interfaces";
import { isType } from "./isType";

export function guard<T extends string, A extends Action<string>>(creator: ActionCreator<T, A>): (action: Action<string>) => action is A {
    return (action: Action<string>): action is A => isType(action, creator);
}
