/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { action, empty, fsa, payload, props } from "ts-action";

export const usingEmpty = {
  bar: action("[foobar] BAR", empty()),
  baz: action("[foobar] BAZ", empty()),
  foo: action("[foobar] FOO", empty())
};

export const usingFsa = {
  bar: action("[foobar] BAR", fsa<{ bar: number }>()),
  baz: action("[foobar] BAZ", fsa<{ baz: number }>()),
  foo: action("[foobar] FOO", fsa<{ foo: number }>())
};

export const usingPayload = {
  bar: action("[foobar] BAR", payload<{ bar: number }>()),
  baz: action("[foobar] BAZ", payload<{ baz: number }>()),
  foo: action("[foobar] FOO", payload<{ foo: number }>())
};

export const usingProps = {
  bar: action("[foobar] BAR", props<{ bar: number }>()),
  baz: action("[foobar] BAZ", props<{ baz: number }>()),
  foo: action("[foobar] FOO", props<{ foo: number }>())
};
