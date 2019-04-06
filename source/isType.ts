/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType } from "./action";
import { Action } from "./types";

export function isType<T extends ActionCreator[]>(action: Action<string>, ...creators: T): action is ActionType<T[number]> {
    return creators.some(({ type }) => action.type === type);
}
