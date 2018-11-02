/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, empty, fsa, payload, props, type, union } from "./action";
import { expectSnippet, timeout } from "./snippet-spec";

describe("functions/action", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

    describe("creator", () => {

        it("should create an action", () => {
            const createFoo = action("FOO", (foo: number) => ({ foo }));
            const foo = createFoo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should narrow the action", () => {
            const createFoo = action("FOO", (foo: number) => ({ foo }));
            const createBar = action("BAR", (bar: number) => ({ bar }));
            const Both = union({ createFoo, createBar });
            const narrow = (action: typeof Both) => {
                if (action.type === createFoo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(createFoo(42));
        });

        it("should be serializable", () => {
            const createFoo = action("FOO", (foo: number) => ({ foo }));
            const foo = createFoo(42);
            const text = JSON.stringify(foo);
            expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
        });

        it("should support toString", () => {
            const createFoo = action("FOO", (foo: number) => ({ foo }));
            const foo = createFoo(42);
            expect(foo).to.respondTo("toString");
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const createFoo = action("FOO", (foo: number) => ({ foo }));
                const foo = createFoo("42");
            `).toFail(/not assignable to parameter of type 'number'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const createFoo = action("FOO", (foo: number) => ({ foo }));
                const foo = createFoo(42);
                const value: string = foo.foo;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const createFoo = action("FOO", (foo: number) => ({ foo }));
                const foo = createFoo(42);
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("empty", () => {

        it("should default to empty", () => {
            const createFoo = action("FOO");
            const foo = createFoo();
            expect(foo).to.have.property("type", "FOO");
            expect(Object.keys(foo)).to.deep.equal(["type"]);
        });

        it("should create an action", () => {
            const createFoo = action("FOO", empty());
            const foo = createFoo();
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.not.have.property("payload");
        });

        it("should narrow the action", () => {
            const createFoo = action("FOO", empty());
            const createBar = action("BAR", (bar: number) => ({ bar }));
            const Both = union({ createFoo, createBar });
            const narrow = (action: typeof Both) => {
                if (action.type === createFoo.type) {
                    throw new Error("Should not get here.");
                } else {
                    expect(action.bar).to.equal(42);
                }
            };
            narrow(createBar(42));
        });

        it("should be serializable", () => {
            const createFoo = action("FOO", empty());
            const foo = createFoo();
            const text = JSON.stringify(foo);
            expect(JSON.parse(text)).to.deep.equal({ type: "FOO" });
        });

        it("should support toString", () => {
            const createFoo = action("FOO", empty());
            const foo = createFoo();
            expect(foo).to.respondTo("toString");
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const createFoo = action("FOO", empty());
                const foo = createFoo("42");
            `).toFail(/Expected 0 arguments/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const createFoo = action("FOO", empty());
                const foo = createFoo();
                const value: string = foo.foo;
            `).toFail(/'foo' does not exist/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const createFoo = action("FOO", empty());
                const foo = createFoo();
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("fsa", () => {

        it("should create an action", () => {
            const createFoo = action("FOO", fsa<number>());
            const foo = createFoo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("error", false);
            expect(foo).to.have.property("payload", 42);
        });

        it("should narrow the action", () => {
            const createFoo = action("FOO", fsa<{ foo: number }>());
            const createBar = action("BAR", fsa<{ bar: number }>());
            const Both = union({ createFoo, createBar });
            const narrow = (action: typeof Both) => {
                if (action.type === createFoo.type) {
                    if (action.error) {
                        throw new Error("Should not get here.");
                    } else {
                        expect(action.payload.foo).to.equal(42);
                    }
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(createFoo({ foo: 42 }));
        });

        it("should support error payloads", () => {
            const createFoo = action("FOO", fsa<number>());
            const foo = createFoo(new Error("Kaboom!"));
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("error", true);
            expect(foo).to.have.property("payload");
            expect(foo.payload).to.be.an.instanceof(Error);
        });

        it("should support a meta property", () => {
            const createFoo = action("FOO", fsa<number>());
            const foo = createFoo(42, 54);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("error", false);
            expect(foo).to.have.property("payload", 42);
            expect(foo).to.have.property("meta", 54);
        });

        it("should be serializable", () => {
            const createFoo = action("FOO", fsa<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            const text = JSON.stringify(foo);
            expect(JSON.parse(text)).to.deep.equal({ error: false, payload: { foo: 42 }, type: "FOO" });
        });

        it("should support toString", () => {
            const createFoo = action("FOO", fsa<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            expect(foo).to.respondTo("toString");
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const createFoo = action("FOO", fsa<number>());
                const foo = createFoo("42");
            `).toFail(/not assignable to parameter of type 'number | Error'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const createFoo = action("FOO", fsa<number>());
                const foo = createFoo(42);
                const value: string = foo.payload;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const createFoo = action("FOO", fsa<number>());
                const foo = createFoo(42);
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("payload", () => {

        it("should create an action", () => {
            const createFoo = action("FOO", payload<number>());
            const foo = createFoo(42);
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("payload", 42);
        });

        it("should narrow the action", () => {
            const createFoo = action("FOO", payload<{ foo: number }>());
            const createBar = action("BAR", payload<{ bar: number }>());
            const Both = union({ createFoo, createBar });
            const narrow = (action: typeof Both) => {
                if (action.type === createFoo.type) {
                    expect(action.payload.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(createFoo({ foo: 42 }));
        });

        it("should be serializable", () => {
            const createFoo = action("FOO", payload<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            const text = JSON.stringify(foo);
            expect(JSON.parse(text)).to.deep.equal({ payload: { foo: 42 }, type: "FOO" });
        });

        it("should support toString", () => {
            const createFoo = action("FOO", payload<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            expect(foo).to.respondTo("toString");
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const createFoo = action("FOO", payload<number>());
                const foo = createFoo("42");
            `).toFail(/not assignable to parameter of type 'number'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const createFoo = action("FOO", payload<number>());
                const foo = createFoo(42);
                const value: string = foo.payload;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const createFoo = action("FOO", payload<number>());
                const foo = createFoo(42);
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });

    describe("props", () => {

        it("should create an action", () => {
            const createFoo = action("FOO", props<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            expect(foo).to.have.property("type", "FOO");
            expect(foo).to.have.property("foo", 42);
        });

        it("should narrow the action", () => {
            const createFoo = action("FOO", props<{ foo: number }>());
            const createBar = action("BAR", props<{ bar: number }>());
            const Both = union({ createFoo, createBar });
            const narrow = (action: typeof Both) => {
                if (action.type === createFoo.type) {
                    expect(action.foo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(createFoo({ foo: 42 }));
        });

        it("should be serializable", () => {
            const createFoo = action("FOO", props<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            const text = JSON.stringify(foo);
            expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
        });

        it("should support toString", () => {
            const createFoo = action("FOO", props<{ foo: number }>());
            const foo = createFoo({ foo: 42 });
            expect(foo).to.respondTo("toString");
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                const createFoo = action("FOO", props<{ foo: number }>());
                const foo = createFoo({ foo: "42" });
            `).toFail(/'string' is not assignable to type 'number'/);
        });

        it("should enforce action property types", () => {
            expectSnippet(`
                const createFoo = action("FOO", props<{ foo: number }>());
                const foo = createFoo({ foo: 42 });
                const value: string = foo.foo;
            `).toFail(/'number' is not assignable to type 'string'/);
        });

        it("should enforce action property names", () => {
            expectSnippet(`
                const createFoo = action("FOO", props<{ foo: number }>());
                const foo = createFoo({ foo: 42 });
                const value = foo.bar;
            `).toFail(/'bar' does not exist on type/);
        });
    });
});
