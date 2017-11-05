/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

import {
    Action,
    ActionConstructor,
    ActionWithPayload,
    ActionWithPayloadConstructor,
    ActionWithPropsConstructor,
    AnyAction,
    AnyActionConstructor
} from "./interfaces";

export function isType<T extends string, P>(action: AnyAction, constructor: ActionWithPayloadConstructor<T, P>): action is ActionWithPayload<T, P>;
export function isType<T extends string, P extends object>(action: AnyAction, constructor: ActionWithPropsConstructor<T, P>): action is Action<T> & P;
export function isType<T extends string>(action: AnyAction, constructor: ActionConstructor<T>): action is Action<T>;
export function isType<T extends string>(action: AnyAction, constructor: AnyActionConstructor): boolean {
    return action.type === constructor.type;
}
