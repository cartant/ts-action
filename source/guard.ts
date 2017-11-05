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
    ActionWithParamsConstructor,
    AnyAction,
    AnyActionConstructor
} from "./interfaces";
import { isType } from "./isType";

export function guard<T extends string, P>(constructor: ActionWithPayloadConstructor<T, P>): (action: AnyAction) => action is ActionWithPayload<T, P>;
export function guard<T extends string, P extends object>(constructor: ActionWithPropsConstructor<T, P>): (action: AnyAction) => action is Action<T> & P;
export function guard<T extends string, P extends object, V>(constructor: ActionWithParamsConstructor<T, P, V>): (action: AnyAction) => action is Action<T> & P;
export function guard<T extends string>(constructor: ActionConstructor<T>): (action: AnyAction) => action is Action<T>;
export function guard<T extends string>(constructor: AnyActionConstructor): (action: AnyAction) => action is Action<T> {
    return (action: AnyAction): action is Action<T> => isType(action, constructor);
}
