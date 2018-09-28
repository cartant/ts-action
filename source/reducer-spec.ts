/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Action } from "./interfaces";
import { on, reducer, Reducer } from "./reducer";
import { usingBase } from "./foobar-spec";
import { expectSnippet, timeout } from "./snippet-spec";

describe("reducer", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

    describe("base", () => {

        const { Bar, Foo } = usingBase;

        describe("on", () => {

            it("should enforce action property types", () => {
                expectSnippet(`
                    const Foo = action("FOO", props<{ foo: number }>());
                    on(Foo, (state, action) => { const foo: string = action.foo; return state; });
                `).toFail(/'number' is not assignable to type 'string'/);
            });

            it("should enforce action property names", () => {
                expectSnippet(`
                    const Foo = action("FOO", props<{ foo: number }>());
                    on(Foo, (state, action) => { const bar: string = action.bar; return state; });
                `).toFail(/'bar' does not exist on type/);
            });
        });

        describe("reducer", () => {

            it("should create a reducer", () => {

                interface State { foo?: number; bar?: number; }

                const fooBarReducer = reducer<State>([
                    on(Foo, (state, { foo }) => ({ ...state, foo })),
                    on(Bar, (state, { bar }) => ({ ...state, bar }))
                ], {});

                expect(fooBarReducer).to.be.a("function");

                let state = fooBarReducer(undefined!, { type: "UNKNOWN" });
                expect(state).to.deep.equal({});

                state = fooBarReducer(state, new Foo(42));
                expect(state).to.deep.equal({ foo: 42 });

                state = fooBarReducer(state, new Bar(56));
                expect(state).to.deep.equal({ foo: 42, bar: 56 });
            });
        });
    });
});
