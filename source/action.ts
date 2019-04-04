/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { FunctionWithParametersType, ParametersType } from "./types";

// tslint:disable-next-line:no-any
export type Creator = (...args: any[]) => object;
export type ActionCreator<T, C extends Creator> = C & { type: T; };
export type ActionType<A> = A extends ActionCreator<infer T, infer C>
    ? ReturnType<C> & { type: T; }
    : never;

export function action<T extends string>(type: T): ActionCreator<T, () => { type: T }>;
export function action<T extends string>(type: T, config: { _as: "empty" }): ActionCreator<T, () => { type: T }>;
export function action<T extends string, P, M>(type: T, config: { _as: "fsa", _p: P, _m: M }): ActionCreator<T, (payload: P | Error, meta?: M) => ({ error: false, meta?: M, payload: P, type: T } | { error: true, meta?: M, payload: Error, type: T })>;
export function action<T extends string, P>(type: T, config: { _as: "payload", _p: P }): ActionCreator<T, (payload: P) => { payload: P, type: T }>;
export function action<T extends string, P extends object>(type: T, config: { _as: "props", _p: P }): ActionCreator<T, (props: P) => (P & { type: T })>;
export function action<T extends string, C extends Creator>(type: T, creator: C): FunctionWithParametersType<ParametersType<C>, ReturnType<C> & { type: T }> & { type: T };
export function action<T extends string>(type: T, config?: { _as: "empty" } | { _as: "fsa" } | { _as: "payload" } | { _as: "props" } | Creator): Creator {
    if (typeof config === "function") {
        return defineType(type, (...args: unknown[]) => ({ ...config(...args), type }));
    }
    const as = config ? config._as : "empty";
    switch (as) {
    case "empty":
        return defineType(type, () => ({ type }));
    case "fsa":
        return defineType(type, (payload: unknown, meta: unknown) => payload instanceof Error
            ? { error: true, meta, payload, type }
            : { error: false, meta, payload, type }
        );
    case "payload":
        return defineType(type, (payload: unknown) => ({ payload, type }));
    case "props":
        return defineType(type, (props: unknown) => ({ ...props as object, type }));
    default:
        throw new Error("Unexpected config.");
    }
}

export function empty(): { _as: "empty" } {
    return { _as: "empty" };
}

export function fsa<P, M = unknown>(): { _as: "fsa", _m: M, _p: P } {
    return { _as: "fsa", _m: undefined!, _p: undefined! };
}

export function payload<P>(): { _as: "payload", _p: P } {
    return { _as: "payload", _p: undefined! };
}

export function props<P>(): { _as: "props", _p: P } {
    return { _as: "props", _p: undefined! };
}

export function type<T extends string, R extends object>(type: T, rest: R): (R & { type: T }) {
    // https://github.com/Microsoft/TypeScript/pull/28312
    // tslint:disable-next-line:no-any
    return { ...(rest as object), type } as any;
}

export function union<C extends ActionCreator<string, Creator>[]>(creators: C): ReturnType<C[number]> {
    return undefined!;
}

function defineType(type: string, creator: Creator): Creator {
    return Object.defineProperty(creator, "type", {
        value: type,
        writable: false
    });
}
