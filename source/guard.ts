/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ActionCreator, ActionType, Creator } from "./action";
import { isType } from "./isType";
import { Action } from "./types";

export function guard<T extends ActionCreator<string, Creator>>(creator: T): (action: Action<string>) => action is ActionType<T>;
export function guard<T extends ActionCreator<string, Creator>[]>(...creators: T): (action: Action<string>) => action is ActionType<T[number]>;
export function guard(
    arg: ActionCreator<string, Creator> | ActionCreator<string, Creator>[]
): (action: Action<string>) => boolean {
    /*tslint:disable-next-line:no-any*/
    return (action: Action<string>) => isType(action, arg as any);
}
