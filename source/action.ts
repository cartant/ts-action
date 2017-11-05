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
    ActionWithDefaultPayloadCreator,
    ActionWithPropsCreator,
    ActionWithDefaultPropsCreator
} from "./interfaces";

export const placeholder: any = {};

export function payload<P>(): { payload: P };
export function payload<P>(p: P): { default: true, payload: P };
export function payload<P>(...args: P[]): { default?: true, payload: P } {
    return (args.length === 0) ? { payload: placeholder } : { default: true, payload: args[0] };
}

export function props<P extends object>(): { props: P };
export function props<P extends object>(p: P): { default: true, props: P };
export function props<P extends object>(...args: P[]): { default?: true, props: P } {
    return (args.length === 0) ? { props: placeholder } : { default: true, props: args[0] };
}

export function action<T extends string, P>(options: { readonly type: T, payload: P, default: true }): ActionWithDefaultPayloadCreator<T, P>;
export function action<T extends string, P>(options: { readonly type: T, payload: P }): ActionWithPayloadCreator<T, P>;
export function action<T extends string, P extends object>(options: { readonly type: T, props: P, default: true }): ActionWithDefaultPropsCreator<T, P>;
export function action<T extends string, P extends object>(options: { readonly type: T, props: P }): ActionWithPropsCreator<T, P>;
export function action<T extends string>(options: { readonly type: T }): ActionCreator<T>;
export function action<T extends string, P>(options: { readonly type: T, payload?: P, props?: P, default?: true }): any {
    const { type } = options;
    if (options.hasOwnProperty("payload")) {
        const { payload: defaultPayload } = options;
        if (options.hasOwnProperty("default")) {
            class _ActionWithDefaultPayload {
                static readonly action: _ActionWithDefaultPayload = undefined!;
                static readonly type: T = type;
                readonly type: T = type;
                static readonly create = (payload: P = defaultPayload!) => new _ActionWithDefaultPayload(payload);
                constructor(public payload: P = defaultPayload!) {}
            }
            return _ActionWithDefaultPayload;
        } else if (defaultPayload !== placeholder) {
            throw new Error("Unexpected non-default payload.");
        }
        class _ActionWithPayload {
            static readonly action: _ActionWithPayload = undefined!;
            static readonly type: T = type;
            readonly type: T = type;
            static readonly create = (payload: P) => new _ActionWithPayload(payload);
            constructor(public payload: P) {}
        }
        return _ActionWithPayload;
    } else if (options.hasOwnProperty("props")) {
        const { props: defaultProps } = options;
        if (options.hasOwnProperty("default")) {
            class _ActionWithDefaultProps {
                static readonly action: _ActionWithDefaultProps = undefined!;
                static readonly type: T = type;
                readonly type: T = type;
                static readonly create = (props: P = defaultProps!) => new _ActionWithDefaultProps(props);
                constructor(props: P = defaultProps!) { Object.assign(this, props); }
            }
            return _ActionWithDefaultProps;
        } else if (defaultProps !== placeholder) {
            throw new Error("Unexpected non-default props.");
        }
        class _ActionWithProps {
            static readonly action: _ActionWithProps = undefined!;
            static readonly type: T = type;
            readonly type: T = type;
            static readonly create = (props: P) => new _ActionWithProps(props);
            constructor(props: P) { Object.assign(this, props); }
        }
        return _ActionWithProps;
    }
    class _Action {
        static readonly action: _Action = undefined!;
        static readonly type: T = type;
        readonly type: T = type;
        static readonly create = () => new _Action();
        constructor() {}
    }
    return _Action;
}
