/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Compiler, snippet } from "ts-snippet";

describe("research", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(5000);

    const compiler = new Compiler({
        moduleResolution: "node",
        target: "es2015"
    });
    const expectSnippet = (code: string) => snippet({
        "research.ts": `
            import { action, empty, payload } from "./source";
            ${code}
        `
    }, compiler).expect("research.ts");

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
});
