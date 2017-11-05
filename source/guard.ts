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
    ActionWithDefaultPayloadConstructor,
    ActionWithPropsConstructor,
    ActionWithDefaultPropsConstructor
} from "./interfaces";
import { isType } from "./isType";

export function guard<T extends string, P>(constructor: ActionWithDefaultPayloadConstructor<T, P>): (action: Action) => action is ActionWithPayload<T, P>;
export function guard<T extends string, P>(constructor: ActionWithPayloadConstructor<T, P>): (action: Action) => action is ActionWithPayload<T, P>;
export function guard<T extends string, P extends object>(constructor: ActionWithDefaultPropsConstructor<T, P>): (action: Action) => action is Action<T> & P;
export function guard<T extends string, P extends object>(constructor: ActionWithPropsConstructor<T, P>): (action: Action) => action is Action<T> & P;
export function guard<T extends string>(constructor: ActionConstructor<T>): (action: Action) => action is Action<T>;
export function guard<T extends string>(constructor: any): (action: Action) => action is Action<T> {
    return (action: Action): action is Action<T> => isType(action, constructor);
}
