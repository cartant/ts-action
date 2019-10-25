/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { action, fsa, payload, props, type } from "./action";

export const usingCreator = {
  bar: action("[foobar] BAR", (bar: number) => ({ bar })),
  baz: action("[foobar] BAZ", (baz: number) => ({ baz })),
  boo: action("[foobar] BOO", (boo: number) => ({ boo })),
  foo: action("[foobar] FOO", (foo: number) => ({ foo }))
};

export const usingEmpty = {
  bar: action("[foobar] BAR"),
  baz: action("[foobar] BAZ"),
  boo: action("[foobar] BOO"),
  foo: action("[foobar] FOO")
};

export const usingFsa = {
  bar: action("[foobar] BAR", fsa<{ bar: number }>()),
  baz: action("[foobar] BAZ", fsa<{ baz: number }>()),
  boo: action("[foobar] BOO", fsa<{ boo: number }>()),
  foo: action("[foobar] FOO", fsa<{ foo: number }>())
};

export const usingPayload = {
  bar: action("[foobar] BAR", payload<{ bar: number }>()),
  baz: action("[foobar] BAZ", payload<{ baz: number }>()),
  boo: action("[foobar] BOO", payload<{ boo: number }>()),
  foo: action("[foobar] FOO", payload<{ foo: number }>())
};

export const usingProps = {
  bar: action("[foobar] BAR", props<{ bar: number }>()),
  baz: action("[foobar] BAZ", props<{ baz: number }>()),
  boo: action("[foobar] BOO", props<{ boo: number }>()),
  foo: action("[foobar] FOO", props<{ foo: number }>())
};

export const usingType = {
  bar: (bar: number) => type("[foobar] BAR", { bar }),
  baz: (baz: number) => type("[foobar] BAZ", { baz }),
  boo: (boo: number) => type("[foobar] BOO", { boo }),
  foo: (foo: number) => type("[foobar] FOO", { foo })
};
