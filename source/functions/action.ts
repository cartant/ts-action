/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { FunctionWithParametersType, ParametersType } from "../classes";

export function fsa<P, M = unknown>(): { _as: "fsa", _p: P, _m: M } {
    return { _as: "fsa" } as any;
}

export function payload<P>(): { _as: "payload", _p: P } {
    return { _as: "payload" } as any;
}

export function props<P>(): { _as: "props", _p: P } {
    return { _as: "props" } as any;
}

export function action<T extends string, C extends (...args: any[]) => object>(type: T, creator: C): FunctionWithParametersType<ParametersType<C>, ReturnType<C> & { type: T }>;
export function action<T extends string, P, M>(type: T, config: { _as: "fsa", _p: P, _m: M }): (payload: P | Error, meta?: M) => ({ error: false, meta?: M, payload: P, type: T } | { error: true, meta?: M, payload: Error, type: T });
export function action<T extends string, P>(type: T, config: { _as: "payload", _p: P }): (payload: P) => { payload: P, type: T };
export function action<T extends string, P extends object>(type: T, config: { _as: "props", _p: P }): (props: P) => (P | { type: T });
export function action<T extends string>(type: T, config: any): (...args: any[]) => any {
    switch (config._as) {
    case "fsa":
        return (payload, meta) => payload instanceof Error
            ? { error: true, meta, payload, type }
            : { error: false, meta, payload, type };
    case "payload":
        return payload => ({ payload, type });
    case "props":
        return props => ({ ...props, type });
    default:
        return (...args) => ({ ...config(...args), type });
    }
}

export function type<T extends string, R extends object>(type: T, rest: R): ({ type: T } & R) {
    return { type, ...(rest as any) } as any;
}
