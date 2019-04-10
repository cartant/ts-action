/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action-operators
 */

import { Observable } from "rxjs";
import { filter } from "rxjs/operators";
import { Action, ActionCreator, ActionType } from "ts-action";

export function ofType<C extends ActionCreator[]>(...creators: C): (source: Observable<Action>) => Observable<ActionType<C[number]>>;
export function ofType(...creators: ActionCreator[]): (source: Observable<Action>) => Observable<Action> {
    return filter<Action>(({ type }) => creators.some(creator => creator.type === type));
}
