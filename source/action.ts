/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:class-name*/

import {
    Action,
    ActionCreator,
    ActionWithPayload,
    ActionWithPayloadCreator,
    ActionWithPropsCreator
} from "./interfaces";

export const placeholder: any = {};

export function payload<P>(): { payload: P } {
    return { payload: placeholder };
}

export function props<P extends object>(): { props: P } {
    return { props: placeholder };
}

export function action<T extends string, P>(options: { readonly type: T, payload: P }): ActionWithPayloadCreator<T, P>;
export function action<T extends string, P extends object>(options: { readonly type: T, props: P }): ActionWithPropsCreator<T, P>;
export function action<T extends string>(options: { readonly type: T }): ActionCreator<T>;
export function action<T extends string, P>(options: { readonly type: T, payload?: P, props?: P }): any {
    const { type } = options;
    if (options.hasOwnProperty("payload")) {
        class _ActionWithPayload {
            static readonly action: _ActionWithPayload = undefined!;
            static readonly type: T = type;
            readonly type: T = type;
            constructor(public payload: P) {}
        }
        return _ActionWithPayload;
    } else if (options.hasOwnProperty("props")) {
        class _ActionWithProps {
            static readonly action: _ActionWithProps = undefined!;
            static readonly type: T = type;
            readonly type: T = type;
            constructor(props: P) { Object.assign(this, props); }
        }
        return _ActionWithProps;
    }
    class _Action {
        static readonly action: _Action = undefined!;
        static readonly type: T = type;
        readonly type: T = type;
        constructor() {}
    }
    return _Action;
}
