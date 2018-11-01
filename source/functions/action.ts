/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { ParametersType } from "../common/types";

export function action_func<T extends string, F extends (...args: any[]) => any>(type: T, f: F): (...args: ParametersType<F>) => (ReturnType<F> & { type: T }) {
    return (...args) => ({ ...f(...args), type });
}

export function action_payload<T extends string, P>(type: T, options: { _payload: P }): (payload: P) => { payload: P, type: T } {
    return payload => ({ payload, type });
}

export function action_props<T extends string, P extends object>(type: T, options: { _props: P }): (props: P) => (P | { type: T }) {
    return props => ({ ...(props as {}), type });
}

export function action_fsa<T extends string, P, M>(type: T, options: { _fsaPayload: P, _fsaMeta: M }): (payload: P | Error, meta?: M) => ({ error: false, meta?: M, payload: P, type: T } | { error: true, meta?: M, payload: Error, type: T }) {
    return undefined!;
}

export function payload<P>(): { _payload: P } { return undefined!; }
export function props<P>(): { _props: P } { return undefined!; }
export function fsa<P, M = unknown>(): { _fsaPayload: P, _fsaMeta: M } { return undefined!; }

const fromFunc = action_func("FOO", (name: string) => ({ name }));
const fromPayload = action_payload("FOO", payload<{ name: string }>());
const fromProps = action_props("FOO", props<{ name: "alice" }>());
const fromFsa = action_fsa("FOO", fsa<string>());
type FooFsa = ReturnType<typeof fromFsa>;

declare const a: FooFsa;
if (a.error) {
    const p = a.payload;
} else {
    const p = a.payload;
}
