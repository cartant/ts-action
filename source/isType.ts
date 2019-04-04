/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType, Creator } from "./action";
import { Action } from "./types";

export function isType<T extends ActionCreator<string, Creator>>(action: Action<string>, creator: T): action is ActionType<T>;
export function isType<T extends ActionCreator<string, Creator>[]>(action: Action<string>, creators: T): action is ActionType<T[number]>;
export function isType(
    action: Action<string>,
    arg: ActionCreator<string, Creator> | ActionCreator<string, Creator>[]
): boolean {
    if (Array.isArray(arg)) {
        const types = arg.map(creator => creator.type);
        return types.some(type => action.type === type);
    }
    return action.type === arg.type;
}
