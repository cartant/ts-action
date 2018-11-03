/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { on, reducer } from "./reducer";
import { usingProps } from "./foobar-spec";
import { expectSnippet, timeout } from "./snippet-spec";
import { union } from "./action";

describe("classes/reducer", function (): void {

    /*tslint:disable-next-line:no-invalid-this*/
    this.timeout(timeout);

    describe("base", () => {

        const { bar, foo } = usingProps;

        describe("on", () => {

            it("should enforce action property types", () => {
                expectSnippet(`
                    const foo = action("FOO", props<{ foo: number }>());
                    on(foo, (state, action) => { const foo: string = action.foo; return state; });
                `).toFail(/'number' is not assignable to type 'string'/);
            });

            it("should enforce action property names", () => {
                expectSnippet(`
                    const foo = action("FOO", props<{ foo: number }>());
                    on(foo, (state, action) => { const bar: string = action.bar; return state; });
                `).toFail(/'bar' does not exist on type/);
            });

            it("should support reducers with multiple actions", () => {
                const both = union({ bar, foo });
                const func = (state: {}, action: typeof both) => ({});
                const result = on({ bar, foo }, func);
                expect(result).to.have.property("reducer", func);
                expect(result).to.have.property("types");
                expect(result.types).to.contain(bar.type);
                expect(result.types).to.contain(foo.type);
            });
        });

        describe("reducer", () => {

            it("should create a reducer", () => {

                interface State { foo?: number; bar?: number; }

                const fooBarReducer = reducer<State>([
                    on(foo, (state, { foo }) => ({ ...state, foo })),
                    on(bar, (state, { bar }) => ({ ...state, bar }))
                ], {});

                expect(fooBarReducer).to.be.a("function");

                let state = fooBarReducer(undefined, { type: "UNKNOWN" });
                expect(state).to.deep.equal({});

                state = fooBarReducer(state, foo({ foo: 42 }));
                expect(state).to.deep.equal({ foo: 42 });

                state = fooBarReducer(state, bar({ bar: 54 }));
                expect(state).to.deep.equal({ foo: 42, bar: 54 });
            });

            it("should support reducers with multiple actions", () => {

                type State = string[];

                const fooBarReducer = reducer<State>([
                    on({ bar, foo }, (state, { type }) => [...state, type])
                ], []);

                expect(fooBarReducer).to.be.a("function");

                let state = fooBarReducer(undefined, { type: "UNKNOWN" });
                expect(state).to.deep.equal([]);

                state = fooBarReducer(state, foo({ foo: 42 }));
                expect(state).to.deep.equal(["[foobar] FOO"]);

                state = fooBarReducer(state, bar({ bar: 54 }));
                expect(state).to.deep.equal(["[foobar] FOO", "[foobar] BAR"]);
            });
        });
    });
});
