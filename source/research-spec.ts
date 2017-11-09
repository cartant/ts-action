/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { expectSnippet, timeout } from "./snippet-spec";

describe("research", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

    describe("narrowing", () => {

        it("should not narrow with non-const, implicit string-literal types", () => {
            expectSnippet(`
                const A_NAME = "[research] A";
                const B_NAME = "[research] B";
                let A_TYPE = A_NAME;
                let B_TYPE = B_NAME;
                export class A {
                    static readonly type = A_TYPE;
                    readonly type = A.type;
                    constructor(public payload: { a: number } = { a: 0 }) {}
                }
                export class B {
                    static readonly type = B_TYPE;
                    readonly type = B.type;
                    constructor() {}
                }
                const narrow = (action: A | B) => {
                    if (action.type === A_TYPE) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toFail(/'payload' does not exist on type/);
        });

        it("should narrow with non-const, explicit string-literal types", () => {
            expectSnippet(`
                const A_NAME: "[research] A" = "[research] A";
                const B_NAME: "[research] B" = "[research] B";
                let A_TYPE = A_NAME;
                let B_TYPE = B_NAME;
                export class A {
                    static readonly type = A_TYPE;
                    readonly type = A.type;
                    constructor(public payload: { a: number } = { a: 0 }) {}
                }
                export class B {
                    static readonly type = B_TYPE;
                    readonly type = B.type;
                    constructor() {}
                }
                const narrow = (action: A | B) => {
                    if (action.type === A_TYPE) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toSucceed();
        });

        it("should narrow declared actions", () => {
            expectSnippet(`
                export class A {
                    static readonly type = "[research] A";
                    readonly type = A.type;
                    constructor(public payload: { a: number } = { a: 0 }) {}
                }
                export class B {
                    static readonly type = "[research] B";
                    readonly type = B.type;
                    constructor() {}
                }
                const narrow = (action: A | B) => {
                    if (action.type === A.type) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toSucceed();
        });

        it("should narrow declared actions using typeof", () => {
            expectSnippet(`
                export class A {
                    static readonly type = "[research] A";
                    readonly type = A.type;
                    constructor(public payload: { a: number } = { a: 0 }) {}
                }
                export class B {
                    static readonly type = "[research] B";
                    readonly type = B.type;
                    constructor() {}
                }
                const a: A = undefined!;
                const b: B = undefined!;
                const narrow = (action: typeof a | typeof b) => {
                    if (action.type === A.type) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toSucceed();
        });

        it("should narrow actions using 'type'", () => {
            expectSnippet(`
                const A = action({ type: "[research] A", ...payload<{ a: number }>() });
                const B = action({ type: "[research] B", ...empty() });
                const narrow = (action: typeof A.action | typeof B.action) => {
                    if (action.type === A.type) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toSucceed();
        });

        it("should narrow actions using 'action.type'", () => {
            expectSnippet(`
                const A = action({ type: "[research] A", ...payload<{ a: number }>() });
                const B = action({ type: "[research] B", ...empty() });
                const narrow = (action: typeof A.action | typeof B.action) => {
                    if (action.type === A.action.type) {
                        console.log(action.type, action.payload.a);
                    } else {
                        console.log(action.type);
                    }
                };
            `).toSucceed();
        });
    });

    describe("widening", () => {

        describe.skip("likely bugs", () => {

            it("should widen a mutated parameter", () => {
                expectSnippet(`
                    const get = <T, N>(t: T, name: N) => { name = "bob"; return name; };
                    const result = get(42, "alice");
                `).toInfer("result", "string");
            });

            it("should use the default if type parameters are partially specified", () => {
                expectSnippet(`
                    const get = <T, N extends string = string>(t: T, name: N) => name;
                    const result = get<number>(42, "alice");
                `).toInfer("result", "string");
            });
        });

        it("should not widen a readonly interface member", () => {
            expectSnippet(`
                const get = <T, N extends string>(options: { readonly name: N, t: T }) => options.name;
                const result = get({ name: "alice", t: 42 });
            `).toInfer("result", `"alice"`);
        });

        it("should infer {} if type parameters are partially specified", () => {
            expectSnippet(`
                const get = <T, N>(t: T, name: N) => name;
                const result = get<number>(42, "alice");
            `).toInfer("result", "{}");
        });

        it("should infer {} if type parameters are partially specified", () => {
            expectSnippet(`
                const get = <T, N extends string>(options: { readonly name: N, t: T }) => options.name;
                const result = get<number>({ name: "alice", t: 42 });
            `).toInfer("result", "{}");
        });

        it("should use the default if type parameters are partially specified", () => {
            expectSnippet(`
                const get = <T, N extends string = string>(options: { readonly name: N, t: T }) => options.name;
                const result = get<number>({ name: "alice", t: 42 });
            `).toInfer("result", "string");
        });
    });

    describe("payload defaults", () => {

        it("should not allow literal defaults", () => {
            expectSnippet(`
                const maker = <T>() => (t: T) => t;
                const make = maker<{ a: number = 42, b: number = 56 }>();
                const made = make({});
            `).toFail(/type literal property cannot have an initializer/);
        });
    });

    describe("mixins", () => {

        // https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#support-for-mix-in-classes

        const Person = `
            class Person {
                constructor(public name: string) {}
            }
        `;
        const Tagged = `
            function Tagged<T extends Ctor<{}>>(Base: T) {
                return class extends Base {
                    tag: string;
                    constructor(...args: any[]) {
                        super(...args);
                        this.tag = "";
                    }
                }
            }
        `;

        it("should extend a class", () => {
            expectSnippet(`
                ${Person}
                ${Tagged}
                const TaggedPerson = Tagged(Person);
                const user = new TaggedPerson("alice");
            `).toSucceed();
        });

        it("should enforce ctor parameters", () => {
            expectSnippet(`
                ${Person}
                ${Tagged}
                const TaggedPerson = Tagged(Person);
                const user = new TaggedPerson(42);
            `).toFail(/not assignable to parameter of type 'string'/);
        });

        describe("constructors", () => {

            // These first two tests highlight the problem with the base and
            // props methods. It's not possible both infer the return type and
            // enforce the parameters.
            //
            // In particular, the problem is that narrowing to a Ctor<T>
            // prevents the parameters being enforced.

            // Also, it's not easy to solve the problem for props alone by
            // asserting an intersection type of _Action & B for the return
            // value (of the action method) because of this issue:
            //
            // https://github.com/Microsoft/TypeScript/issues/17388

            it("should infer using fudged args", () => {
                expectSnippet(`
                    ${Person}
                    const value = (true as false) || new Person(...([] as any[]));
                `).toInfer("value", "Person");
            });

            it("should fail to infer the ctor return type", () => {
                expectSnippet(`
                    ${Person}
                    function infer<C extends Ctor<{}>>(BaseCtor: C) {
                        return (true as false) || new BaseCtor(...([] as any[]));
                    }
                    const value = infer(Person);
                `).toInfer("value", "{}");
            });

            it("should fail to enforce the ctor parameters", () => {
                expectSnippet(`
                    ${Person}
                    ${Tagged}
                    const TaggedPerson = Tagged(Person as Ctor<Person>);
                    const user = new TaggedPerson(42);
                `).toSucceed();
            });

            it.skip("should enforce ctor parameters for base", () => {
                expectSnippet(`
                    const options = base(class { constructor(public foo: number) {} });
                    const instance = new options.BaseCtor("42");
                `).toFail();
            });

            it("should enforce ctor parameters for empty", () => {
                expectSnippet(`
                    const options = empty();
                    const instance = new options.BaseCtor("42");
                `).toFail(/Expected 0 arguments/);
            });

            it("should enforce ctor parameters for payload", () => {
                expectSnippet(`
                    const options = payload<number>();
                    const instance = new options.BaseCtor("42");
                `).toFail(/not assignable to parameter of type 'number'/);
            });

            it("should enforce ctor parameters for props", () => {
                expectSnippet(`
                    const options = props<{ foo: number }>();
                    const instance = new options.BaseCtor({ foo: "42" });
                `).toFail(/'{ foo: string; }' is not assignable to parameter of type '{ foo: number; }'/);
            });
        });
    });
});
