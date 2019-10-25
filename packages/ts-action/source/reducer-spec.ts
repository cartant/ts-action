/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { stripIndent } from "common-tags";
import { union } from "./action";
import { usingProps } from "./foobar-spec";
import { on, reducer } from "./reducer";
import { expectSnippet, timeout } from "./snippet-spec";

describe("reducer", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  describe("props", () => {
    const { bar, baz, boo, foo } = usingProps;

    describe("on", () => {
      it("should enforce action property types", () => {
        expectSnippet(stripIndent`
          const foo = action("FOO", props<{ foo: number }>());
          on(foo, (state, action) => { const foo: string = action.foo; return state; });
        `).toFail(/'number' is not assignable to type 'string'/);
      });

      it("should enforce action property names", () => {
        expectSnippet(stripIndent`
          const foo = action("FOO", props<{ foo: number }>());
          on(foo, (state, action) => { const bar: string = action.bar; return state; });
        `).toFail(/'bar' does not exist on type/);
      });

      it("should support reducers with multiple actions", () => {
        const both = union(bar, foo);
        const func = (state: {}, action: typeof both.actions) => ({});
        const result = on(foo, bar, func);
        expect(result).to.have.property("reducer", func);
        expect(result).to.have.property("types");
        expect(result.types).to.contain(bar.type);
        expect(result.types).to.contain(foo.type);
      });
    });

    describe("reducer", () => {
      it("should create a reducer", () => {
        interface State {
          foo?: number;
          bar?: number;
        }

        const initialState: State = {};
        const fooBarReducer = reducer(
          initialState,
          on(foo, (state, { foo }) => ({ ...state, foo })),
          on(bar, (state, { bar }) => ({ ...state, bar }))
        );

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

        const initialState: State = [];
        const fooBarReducer = reducer(
          initialState,
          on(foo, bar, (state, { type }) => [...state, type])
        );

        expect(fooBarReducer).to.be.a("function");

        let state = fooBarReducer(undefined, { type: "UNKNOWN" });
        expect(state).to.deep.equal([]);

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).to.deep.equal(["[foobar] FOO"]);

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).to.deep.equal(["[foobar] FOO", "[foobar] BAR"]);
      });

      it("should support reducers with multiple actions spread from union", () => {
        type State = string[];

        const initialState: State = [];
        const fooBarReducer = reducer(
          initialState,
          on(...union(foo, bar, baz, boo), (state, { type }) => [
            ...state,
            type
          ])
        );

        expect(fooBarReducer).to.be.a("function");

        let state = fooBarReducer(undefined, { type: "UNKNOWN" });
        expect(state).to.deep.equal([]);

        state = fooBarReducer(state, foo({ foo: 42 }));
        expect(state).to.deep.equal(["[foobar] FOO"]);

        state = fooBarReducer(state, bar({ bar: 54 }));
        expect(state).to.deep.equal(["[foobar] FOO", "[foobar] BAR"]);
      });

      it("should call reducers exclusively", () => {
        type State = number;

        const called: number[] = [];
        const initialState: State = 0;
        const fooBarReducer = reducer(
          initialState,
          on(foo, () => {
            called.push(1);
            return 1;
          }),
          on(foo, () => {
            called.push(2);
            return 2;
          }),
          on(foo, () => {
            called.push(3);
            return 3;
          })
        );

        let state = fooBarReducer(undefined, { type: "UNKNOWN" });
        expect(state).to.equal(0);
        expect(called).to.deep.equal([]);

        state = fooBarReducer(undefined, { type: "[foobar] FOO" });
        expect(state).to.equal(1);
        expect(called).to.deep.equal([1]);
      });
    });
  });
});
