/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Draft } from "immer";
import { action, props, reducer, union } from "ts-action";
import { on } from "./reducer";
import { expectSnippet, timeout } from "./snippet-spec";

describe("reducer", function() {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  const bar = action("[foobar] BAR", props<{ bar: number }>());
  const foo = action("[foobar] FOO", props<{ foo: number }>());

  describe("on", () => {
    it("should enforce action property types", () => {
      expectSnippet(`
        const foo = action("FOO", props<{ foo: number }>());
        on(foo, (state, action) => { const foo: string = action.foo; });
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it("should enforce action property names", () => {
      expectSnippet(`
        const foo = action("FOO", props<{ foo: number }>());
        on(foo, (state, action) => { const bar: string = action.bar });
      `).toFail(/'bar' does not exist on type/);
    });

    it("should support reducers with multiple actions", () => {
      const both = union(bar, foo);
      const func = (state: Draft<{}>, action: typeof both) => ({});
      const result = on(foo, bar, func);
      expect(result).to.have.property("reducer");
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
        on(foo, (state, { foo }) => {
          state.foo = foo;
        }),
        on(bar, (state, { bar }) => {
          state.bar = bar;
        })
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
        on(foo, bar, (state, { type }) => {
          state.push(type);
        })
      );

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
