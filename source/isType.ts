/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType, Creator } from "./action";
import { Action } from "./types";

export function isType<T extends ActionCreator<string, Creator>[]>(action: Action<string>, ...creators: T): action is ActionType<T[number]> {
    const types = creators.map(creator => creator.type);
    return types.some(type => action.type === type);
}
