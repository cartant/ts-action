/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import isPlainObject = require("lodash.isplainobject");
import { action, base, empty, payload, props, union } from "../dist/action";
import { expectSnippet, timeout } from "./snippet-spec";

describe("action", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

    describe("base", () => {

        it("should create an action", () => {
            const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should support combined options", () => {
            const Foo = action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should narrow the action", () => {
            const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
            const Bar = action("BAR", base(class { constructor(public bar: number) {} }));
            const All = union(Foo, Bar);
            const narrow = (action: typeof All) => {
                if (action.type === Foo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo(42));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
            const foo = new Foo(42);
            expect(isPlainObject(foo)).to.be.true;
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
                const foo = new Foo("42");
            `).toFail(/not assignable to parameter of type 'number'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
                const foo = new Foo(42);
                const value: string = foo.foo;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
                const foo = new Foo(42);
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("empty", () => {

        it("should default to empty", () => {
            const Foo = action("FOO");
            const foo = new Foo();
            expect(foo).to.have.property("type", "FOO");
            expect(Object.keys(foo)).to.deep.equal(["type"]);
        });

        it("should create an action", () => {
            const Foo = action("FOO", empty());
            const foo = new Foo();
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.not.have.property("payload");
        });

        it("should support combined options", () => {
            const Foo = action({ type: "FOO", ...empty() });
            const foo = new Foo();
            expect(foo).to.have.property("type", "FOO");
            expect(Object.keys(foo)).to.deep.equal(["type"]);
        });

        it("should narrow the action", () => {
            const Foo = action("FOO", empty());
            const Bar = action("BAR", base(class { constructor(public bar: number) {} }));
            const All = union(Foo, Bar);
            const narrow = (action: typeof All) => {
                if (action.type === Foo.type) {
                    throw new Error("Should not get here.");
                } else {
                    expect(action.bar).to.equal(42);
                }
            };
            narrow(new Bar(42));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action("FOO", empty());
            const foo = new Foo();
            expect(isPlainObject(foo)).to.be.true;
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const Foo = action("FOO", empty());
                const foo = new Foo("42");
            `).toFail(/Expected 0 arguments/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const Foo = action("FOO", empty());
                const foo = new Foo();
                const value: string = foo.foo;
            `).toFail(/'foo' does not exist/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const Foo = action("FOO", empty());
                const foo = new Foo();
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("payload", () => {

        it("should create an action", () => {
            const Foo = action("FOO", payload<number>());
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("payload", 42);
        });

        it("should support combined options", () => {
            const Foo = action({ type: "FOO", ...payload<number>() });
            const foo = new Foo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("payload", 42);
        });

        it("should narrow the action", () => {
            const Foo = action("FOO", payload<{ foo: number }>());
            const Bar = action("BAR", payload<{ bar: number }>());
            const All = union(Foo, Bar);
            const narrow = (action: typeof All) => {
                if (action.type === Foo.type) {
                    expect(action.payload.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo({ foo: 42 }));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action("FOO", payload<{ foo: number }>());
            const foo = new Foo({ foo: 42 });
            expect(isPlainObject(foo)).to.be.true;
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const Foo = action("FOO", payload<number>());
                const foo = new Foo("42");
            `).toFail(/not assignable to parameter of type 'number'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const Foo = action("FOO", payload<number>());
                const foo = new Foo(42);
                const value: string = foo.payload;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const Foo = action("FOO", payload<number>());
                const foo = new Foo(42);
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("props", () => {

        it("should create an action", () => {
            const Foo = action("FOO", props<{ foo: number }>());
            const foo = new Foo({ foo: 42 });
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should support combined options", () => {
            const Foo = action({ type: "FOO", ...props<{ foo: number }>() });
            const foo = new Foo({ foo: 42 });
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should narrow the action", () => {
            const Foo = action("FOO", props<{ foo: number }>());
            const Bar = action("BAR", props<{ bar: number }>());
            const All = union(Foo, Bar);
            const narrow = (action: typeof All) => {
                if (action.type === Foo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Foo({ foo: 42 }));
        });

        it("should pass the lodash isPlainObject predicate", () => {
            const Foo = action("FOO", props<{ foo: number }>());
            const foo = new Foo({ foo: 42 });
            expect(isPlainObject(foo)).to.be.true;
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const Foo = action("FOO", props<{ foo: number }>());
                const foo = new Foo({ foo: "42" });
            `).toFail(/'{ foo: string; }' is not assignable to parameter of type '{ foo: number; }'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const Foo = action("FOO", props<{ foo: number }>());
                const foo = new Foo({ foo: 42 });
                const value: string = foo.foo;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const Foo = action("FOO", props<{ foo: number }>());
                const foo = new Foo({ foo: 42 });
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });
});
