/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Action, ActionCreator } from "./interfaces";

export function isType<T extends string, A extends Action<string>>(action: Action<string>, creator: ActionCreator<T, A>): action is A {
    return action.type === creator.type;
}
