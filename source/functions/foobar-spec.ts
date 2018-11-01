/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { action, fsa, payload, props, type } from "./action";

export const usingCreator = {
    Bar: action("[foobar] BAR", (bar: number) => ({ bar })),
    Baz: action("[foobar] BAZ", (baz: number) => ({ baz })),
    Foo: action("[foobar] FOO", (foo: number) => ({ foo }))
};

export const usingEmpty = {
    Bar: action("[foobar] BAR"),
    Baz: action("[foobar] BAZ"),
    Foo: action("[foobar] FOO")
};

export const usingFsa = {
    Bar: action("[foobar] BAR", fsa<{ bar: number }>()),
    Baz: action("[foobar] BAZ", fsa<{ baz: number }>()),
    Foo: action("[foobar] FOO", fsa<{ foo: number }>())
};

export const usingPayload = {
    Bar: action("[foobar] BAR", payload<{ bar: number }>()),
    Baz: action("[foobar] BAZ", payload<{ baz: number }>()),
    Foo: action("[foobar] FOO", payload<{ foo: number }>())
};

export const usingProps = {
    Bar: action("[foobar] BAR", props<{ bar: number }>()),
    Baz: action("[foobar] BAZ", props<{ baz: number }>()),
    Foo: action("[foobar] FOO", props<{ foo: number }>())
};

export const usingType = {
    Bar: (bar: number) => type("[foobar] BAR", { bar }),
    Baz: (baz: number) => type("[foobar] BAZ", { baz }),
    Foo: (foo: number) => type("[foobar] FOO", { foo })
};
