/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, empty, fsa, payload, props, type, union } from "./action";
import { expectSnippet, timeout } from "./snippet-spec";

describe("action", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

//     describe("aliases", () => {

//         it("should expose 'action' for type aliases", () => {
//             const Foo = action("FOO", payload<{ foo: number }>());
//             type Foo = typeof Foo.action;
//             const Bar = action("BAR", payload<{ bar: number }>());
//             type Bar = typeof Bar.action;
//             const narrow = (action: Foo | Bar) => {
//                 if (action.type === Foo.type) {
//                     expect(action.payload.foo).to.equal(42);
//                 } else {
//                     throw new Error("Should not get here.");
//                 }
//             };
//             narrow(new Foo({ foo: 42 }));
//         });
//     });

//     describe("base", () => {

//         it("should create an action", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const foo = new Foo(42);
//             expect(foo).to.have.property("type", "FOO");
//             expect(foo).to.have.property("foo", 42);
//         });

//         it("should narrow the action", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const Bar = action("BAR", base(class { constructor(public bar: number) {} }));
//             const Both = union({ Foo, Bar });
//             const narrow = (action: typeof Both) => {
//                 if (action.type === Foo.type) {
//                     expect(action.foo).to.equal(42);
//                 } else {
//                     throw new Error("Should not get here.");
//                 }
//             };
//             narrow(new Foo(42));
//         });

//         it("should pass the lodash isPlainObject predicate", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const foo = new Foo(42);
//             expect(isPlainObject(foo)).to.be.true;
//         });

//         it("should pass the issue 2598 test", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const foo = new Foo(42);
//             expect(isPlainObjectIssue2598(foo)).to.be.true;
//         });

//         it("should be serializable", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const foo = new Foo(42);
//             const text = JSON.stringify(foo);
//             expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
//         });

//         it("should support toString", () => {
//             const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//             const foo = new Foo(42);
//             expect(foo).to.respondTo("toString");
//         });

//         it("should enforce ctor parameters", () => {
//             expectSnippet(`
//                 const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//                 const foo = new Foo("42");
//             `).toFail(/not assignable to parameter of type 'number'/);
//         });

//         it("should enforce action property types", () => {
//             expectSnippet(`
//                 const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//                 const foo = new Foo(42);
//                 const value: string = foo.foo;
//             `).toFail(/'number' is not assignable to type 'string'/);
//         });

//         it("should enforce action property names", () => {
//             expectSnippet(`
//                 const Foo = action("FOO", base(class { constructor(public foo: number) {} }));
//                 const foo = new Foo(42);
//                 const value = foo.bar;
//             `).toFail(/'bar' does not exist on type/);
//         });
//     });

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

    // describe("props", () => {

    //     it("should create an action", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const foo = new Foo({ foo: 42 });
    //         expect(foo).to.have.property("type", "FOO");
    //         expect(foo).to.have.property("foo", 42);
    //     });

    //     it("should narrow the action", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const Bar = action("BAR", props<{ bar: number }>());
    //         const Both = union({ Foo, Bar });
    //         const narrow = (action: typeof Both) => {
    //             if (action.type === Foo.type) {
    //                 expect(action.foo).to.equal(42);
    //             } else {
    //                 throw new Error("Should not get here.");
    //             }
    //         };
    //         narrow(new Foo({ foo: 42 }));
    //     });

    //     it("should pass the lodash isPlainObject predicate", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const foo = new Foo({ foo: 42 });
    //         expect(isPlainObject(foo)).to.be.true;
    //     });

    //     it("should pass the issue 2598 test", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const foo = new Foo({ foo: 42 });
    //         expect(isPlainObjectIssue2598(foo)).to.be.true;
    //     });

    //     it("should be serializable", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const foo = new Foo({ foo: 42 });
    //         const text = JSON.stringify(foo);
    //         expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
    //     });

    //     it("should support toString", () => {
    //         const Foo = action("FOO", props<{ foo: number }>());
    //         const foo = new Foo({ foo: 42 });
    //         expect(foo).to.respondTo("toString");
    //     });

    //     it("should enforce ctor parameters", () => {
    //         expectSnippet(`
    //             const Foo = action("FOO", props<{ foo: number }>());
    //             const foo = new Foo({ foo: "42" });
    //         `).toFail(/'string' is not assignable to type 'number'/);
    //     });

    //     it("should enforce action property types", () => {
    //         expectSnippet(`
    //             const Foo = action("FOO", props<{ foo: number }>());
    //             const foo = new Foo({ foo: 42 });
    //             const value: string = foo.foo;
    //         `).toFail(/'number' is not assignable to type 'string'/);
    //     });

    //     it("should enforce action property names", () => {
    //         expectSnippet(`
    //             const Foo = action("FOO", props<{ foo: number }>());
    //             const foo = new Foo({ foo: 42 });
    //             const value = foo.bar;
    //         `).toFail(/'bar' does not exist on type/);
    //     });
    // });
});
