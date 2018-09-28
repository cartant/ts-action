/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { action, base, payload, props } from "./action";

export const usingBase = {
    Bar: action("[foobar] BAR", base(class { constructor(public bar: number) {} })),
    Baz: action("[foobar] BAZ", base(class { constructor(public baz: number) {} })),
    Foo: action("[foobar] FOO", base(class { constructor(public foo: number) {} }))
};

export const usingEmpty = {
    Bar: action("[foobar] BAR"),
    Baz: action("[foobar] BAZ"),
    Foo: action("[foobar] FOO")
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
