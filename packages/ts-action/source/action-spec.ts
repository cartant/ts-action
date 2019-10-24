/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { stripIndent } from "common-tags";
import { action, empty, fsa, payload, props, union } from "./action";
import { expectSnippet, timeout } from "./snippet-spec";

describe("functions/action", function(): void {
  /*tslint:disable-next-line:no-invalid-this*/
  this.timeout(timeout);

  describe("creator", () => {
    it("should create an action", () => {
      const foo = action("FOO", (foo: number) => ({ foo }));
      const fooAction = foo(42);
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("foo", 42);
    });

    it("should narrow the action", () => {
      const foo = action("FOO", (foo: number) => ({ foo }));
      const bar = action("BAR", (bar: number) => ({ bar }));
      const both = union(foo, bar);
      const narrow = (action: typeof both.actions) => {
        if (action.type === foo.type) {
          expect(action.foo).to.equal(42);
        } else {
          throw new Error("Should not get here.");
        }
      };
      narrow(foo(42));
    });

    it("should be serializable", () => {
      const foo = action("FOO", (foo: number) => ({ foo }));
      const fooAction = foo(42);
      const text = JSON.stringify(fooAction);
      expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
    });

    it("should support toString", () => {
      const foo = action("FOO", (foo: number) => ({ foo }));
      const fooAction = foo(42);
      expect(fooAction).to.respondTo("toString");
    });

    it("should enforce creator parameters", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", (foo: number) => ({ foo }));
        const fooAction = foo("42");
      `).toFail(/not assignable to parameter of type 'number'/);
    });

    it("should enforce action property types", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", (foo: number) => ({ foo }));
        const fooAction = foo(42);
        const value: string = fooAction.foo;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it("should enforce action property names", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", (foo: number) => ({ foo }));
        const fooAction = foo(42);
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });

    it("should prevent type properties", () => {
      expectSnippet(stripIndent`
        action("FOO", (type: string) => ({ type }));
      `).toFail(/should not include a type/);
    });
  });

  describe("empty", () => {
    it("should default to empty", () => {
      const foo = action("FOO");
      const fooAction = foo();
      expect(fooAction).to.have.property("type", "FOO");
      expect(Object.keys(fooAction)).to.deep.equal(["type"]);
    });

    it("should create an action", () => {
      const foo = action("FOO", empty());
      const fooAction = foo();
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.not.have.property("payload");
    });

    it("should narrow the action", () => {
      const foo = action("FOO", empty());
      const bar = action("BAR", (bar: number) => ({ bar }));
      const both = union(foo, bar);
      const narrow = (action: typeof both.actions) => {
        if (action.type === foo.type) {
          throw new Error("Should not get here.");
        } else {
          expect(action.bar).to.equal(42);
        }
      };
      narrow(bar(42));
    });

    it("should be serializable", () => {
      const foo = action("FOO", empty());
      const fooAction = foo();
      const text = JSON.stringify(fooAction);
      expect(JSON.parse(text)).to.deep.equal({ type: "FOO" });
    });

    it("should support toString", () => {
      const foo = action("FOO", empty());
      const fooAction = foo();
      expect(fooAction).to.respondTo("toString");
    });

    it("should enforce creator parameters", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", empty());
        const fooAction = foo("42");
      `).toFail(/Expected 0 arguments/);
    });

    it("should enforce action property types", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", empty());
        const fooAction = foo();
        const value: string = fooAction.foo;
      `).toFail(/'foo' does not exist/);
    });

    it("should enforce action property names", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", empty());
        const fooAction = foo();
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });
  });

  describe("fsa", () => {
    it("should create an action", () => {
      const foo = action("FOO", fsa<number>());
      const fooAction = foo(42);
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("error", false);
      expect(fooAction).to.have.property("payload", 42);
    });

    it("should narrow the action", () => {
      const foo = action("FOO", fsa<{ foo: number }>());
      const bar = action("BAR", fsa<{ bar: number }>());
      const both = union(foo, bar);
      const narrow = (action: typeof both.actions) => {
        if (action.type === foo.type) {
          if (action.error) {
            throw new Error("Should not get here.");
          } else {
            expect(action.payload.foo).to.equal(42);
          }
        } else {
          throw new Error("Should not get here.");
        }
      };
      narrow(foo({ foo: 42 }));
    });

    it("should support error payloads", () => {
      const foo = action("FOO", fsa<number>());
      const fooAction = foo(new Error("Kaboom!"));
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("error", true);
      expect(fooAction).to.have.property("payload");
      expect(fooAction.payload).to.be.an.instanceof(Error);
    });

    it("should support a meta property", () => {
      const foo = action("FOO", fsa<number>());
      const fooAction = foo(42, 54);
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("error", false);
      expect(fooAction).to.have.property("payload", 42);
      expect(fooAction).to.have.property("meta", 54);
    });

    it("should be serializable", () => {
      const foo = action("FOO", fsa<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      const text = JSON.stringify(fooAction);
      expect(JSON.parse(text)).to.deep.equal({
        error: false,
        payload: { foo: 42 },
        type: "FOO"
      });
    });

    it("should support toString", () => {
      const foo = action("FOO", fsa<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      expect(fooAction).to.respondTo("toString");
    });

    it("should enforce creator parameters", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", fsa<number>());
        const fooAction = foo("42");
      `).toFail(/not assignable to parameter of type 'number | Error'/);
    });

    it("should enforce action property types", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", fsa<number>());
        const fooAction = foo(42);
        const value: string = fooAction.payload;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it("should enforce action property names", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", fsa<number>());
        const fooAction = foo(42);
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });
  });

  describe("payload", () => {
    it("should create an action", () => {
      const foo = action("FOO", payload<number>());
      const fooAction = foo(42);
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("payload", 42);
    });

    it("should narrow the action", () => {
      const foo = action("FOO", payload<{ foo: number }>());
      const bar = action("BAR", payload<{ bar: number }>());
      const both = union(foo, bar);
      const narrow = (action: typeof both.actions) => {
        if (action.type === foo.type) {
          expect(action.payload.foo).to.equal(42);
        } else {
          throw new Error("Should not get here.");
        }
      };
      narrow(foo({ foo: 42 }));
    });

    it("should be serializable", () => {
      const foo = action("FOO", payload<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      const text = JSON.stringify(fooAction);
      expect(JSON.parse(text)).to.deep.equal({
        payload: { foo: 42 },
        type: "FOO"
      });
    });

    it("should support toString", () => {
      const foo = action("FOO", payload<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      expect(fooAction).to.respondTo("toString");
    });

    it("should enforce creator parameters", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", payload<number>());
        const fooAction = foo("42");
      `).toFail(/not assignable to parameter of type 'number'/);
    });

    it("should enforce action property types", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", payload<number>());
        const fooAction = foo(42);
        const value: string = fooAction.payload;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it("should enforce action property names", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", payload<number>());
        const fooAction = foo(42);
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });
  });

  describe("props", () => {
    it("should create an action", () => {
      const foo = action("FOO", props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      expect(fooAction).to.have.property("type", "FOO");
      expect(fooAction).to.have.property("foo", 42);
    });

    it("should narrow the action", () => {
      const foo = action("FOO", props<{ foo: number }>());
      const bar = action("BAR", props<{ bar: number }>());
      const both = union(foo, bar);
      const narrow = (action: typeof both.actions) => {
        if (action.type === foo.type) {
          expect(action.foo).to.equal(42);
        } else {
          throw new Error("Should not get here.");
        }
      };
      narrow(foo({ foo: 42 }));
    });

    it("should be serializable", () => {
      const foo = action("FOO", props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      const text = JSON.stringify(fooAction);
      expect(JSON.parse(text)).to.deep.equal({ foo: 42, type: "FOO" });
    });

    it("should support toString", () => {
      const foo = action("FOO", props<{ foo: number }>());
      const fooAction = foo({ foo: 42 });
      expect(fooAction).to.respondTo("toString");
    });

    it("should enforce creator parameters", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", props<{ foo: number }>());
        const fooAction = foo({ foo: "42" });
      `).toFail(/'string' is not assignable to type 'number'/);
    });

    it("should enforce action property types", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", props<{ foo: number }>());
        const fooAction = foo({ foo: 42 });
        const value: string = fooAction.foo;
      `).toFail(/'number' is not assignable to type 'string'/);
    });

    it("should enforce action property names", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", props<{ foo: number }>());
        const fooAction = foo({ foo: 42 });
        const value = fooAction.bar;
      `).toFail(/'bar' does not exist on type/);
    });

    it("should prevent type properties", () => {
      expectSnippet(stripIndent`
        const foo = action("FOO", props<{ type: string }>());
        foo({ type: "FOO" });
      `).toFail(/should not include a type/);
    });
  });
});
