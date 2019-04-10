/**
 * @license
 *
 * MIT License
 *
 * Copyright (c) 2017-2019 Nicholas Jamieson and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { FunctionWithParametersType, ParametersType } from "./types";

// tslint:disable-next-line:no-any
export type Creator = (...args: any[]) => object;
export type Typed<A, T extends string> = A extends { type: T } ? A : A & { type: T };
export type ActionCreator<T extends string = string, C extends Creator = Creator> = Typed<C, T>;
export type ActionType<A> = A extends ActionCreator<infer T, infer C>
    ? Typed<ReturnType<C>, T>
    : never;

export function action<T extends string>(type: T): ActionCreator<T, () => Typed<{}, T>>;
export function action<T extends string>(type: T, config: { _as: "empty" }): ActionCreator<T, () => Typed<{}, T>>;
export function action<T extends string, P, M>(type: T, config: { _as: "fsa", _p: P, _m: M }): ActionCreator<T, (payload: P | Error, meta?: M) => Typed<{ error: false, meta?: M, payload: P }, T> | Typed<{ error: true, meta?: M, payload: P }, T>>;
export function action<T extends string, P>(type: T, config: { _as: "payload", _p: P }): ActionCreator<T, (payload: P) => Typed<{ payload: P }, T>>;
export function action<T extends string, P extends object>(type: T, config: { _as: "props", _p: P }): ActionCreator<T, (props: P) => Typed<P, T>>;
export function action<T extends string, C extends Creator>(type: T, creator: C): Typed<FunctionWithParametersType<ParametersType<C>, Typed<ReturnType<C>, T>>, T>;
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

export function type<T extends string, R extends object>(type: T, rest: R): Typed<R, T> {
    // https://github.com/Microsoft/TypeScript/pull/28312
    // tslint:disable-next-line:no-any
    return { ...(rest as object), type } as any;
}

export function union<C extends ActionCreator[]>(...creators: C): ActionType<C[number]> {
    return undefined!;
}

function defineType(type: string, creator: Creator): Creator {
    return Object.defineProperty(creator, "type", {
        value: type,
        writable: false
    });
}
