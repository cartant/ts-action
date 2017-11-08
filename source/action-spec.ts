/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import isPlainObject = require("lodash.isplainobject");
import { action, base, empty, payload, props } from "./action";

describe("action", () => {

    describe("base", () => {

        it("should create an action", () => {
            const Foo = action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should expose the action type", () => {
            const Foo = action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
            type FooAction = typeof Foo.action;
            const foo: FooAction = new Foo(42);
        });

        it("should narrow the action", () => {
            const Foo = action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
            const Bar = action({ type: "BAR", ...base(class { constructor(public bar: number) {} }) });
            const narrow = (action: typeof Foo.action | typeof Bar.action) => {
                if (action.type === Foo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo(42));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
            const foo = new Foo(42);
            expect(isPlainObject({ ...foo })).to.be.true;
        });
    });

    describe("empty", () => {

        it("should create an action", () => {
            const Foo = action({ type: "FOO", ...empty() });
            const foo = new Foo();
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.not.have.property("payload");
        });

        it("should expose the action type", () => {
            const Foo = action({ type: "FOO", ...empty() });
            type FooAction = typeof Foo.action;
            const foo: FooAction = new Foo();
        });

        it("should narrow the action", () => {
            const Foo = action({ type: "FOO", ...empty() });
            const narrow = (action: typeof Foo.action | { type: "OTHER", payload: number }) => {
                if (action.type === Foo.type) {
                    throw new Error("Should not get here.");
                } else {
                    expect(action.payload).to.equal(42);
                }
            };
            narrow({ type: "OTHER", payload: 42 });
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action({ type: "FOO", ...empty() });
            const foo = new Foo();
            expect(isPlainObject({ ...foo })).to.be.true;
        });
    });

    describe("payload", () => {

        it("should create an action", () => {
            const Foo = action({ type: "FOO", ...payload<number>() });
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("payload", 42);
        });

        it("should expose the action type", () => {
            const Foo = action({ type: "FOO", ...payload<number>() });
            type FooAction = typeof Foo.action;
            const foo: FooAction = new Foo(42);
        });

        it("should narrow the action", () => {
            const Foo = action({ type: "FOO", ...payload<{ foo: number }>() });
            const Bar = action({ type: "BAR", ...payload<{ bar: number }>() });
            const narrow = (action: typeof Foo.action | typeof Bar.action) => {
                if (action.type === Foo.type) {
                    expect(action.payload.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo({ foo: 42 }));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action({ type: "FOO", ...payload<{ foo: number }>() });
            const foo = new Foo({ foo: 42 });
            expect(isPlainObject({ ...foo })).to.be.true;
        });
    });

    describe("props", () => {

        it("should create an action", () => {
            const Foo = action({ type: "FOO", ...props<{ foo: number }>() });
            const foo = new Foo({ foo: 42 });
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should expose the action type", () => {
            const Foo = action({ type: "FOO", ...props<{ foo: number }>() });
            type FooAction = typeof Foo.action;
            const foo: FooAction = new Foo({ foo: 42 });
        });

        it("should narrow the action", () => {
            const Foo = action({ type: "FOO", ...props<{ foo: number }>() });
            const Bar = action({ type: "BAR", ...props<{ bar: number }>() });
            const narrow = (action: typeof Foo.action | typeof Bar.action) => {
                if (action.type === Foo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo({ foo: 42 }));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action({ type: "FOO", ...props<{ foo: number }>() });
            const foo = new Foo({ foo: 42 });
            expect(isPlainObject({ ...foo })).to.be.true;
        });
    });
});
