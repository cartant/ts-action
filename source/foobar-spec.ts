/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { action, payload, props } from "./action";

export const Foo = action({ type: "[foobar] FOO", ...payload({ foo: 42 }) });
export const Bar = action({ type: "[foobar] BAR", ...payload<{ bar: number }>() });
export const Goo = action({ type: "[foobar] GOO" });

export const Baz = action({ type: "[foobar] BAZ", ...props({ baz: 42 }) });
export const Daz = action({ type: "[foobar] DAZ", ...props<{ daz: number }>() });

export class Woo {
    static readonly type = "[foobar] WOO";
    readonly type = Woo.type;
    constructor(public payload: { woo: number } = { woo: 0 }) {}
}

export class Zoo {
    static readonly type = "[foobar] ZOO";
    readonly type = Zoo.type;
    constructor() {}
}
