/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import {
  usingCreator,
  usingEmpty,
  usingFsa,
  usingPayload,
  usingProps,
} from "./foobar-spec";
import { guard } from "./guard";

describe("guard", () => {
  describe("creator", () => {
    const { bar, baz, foo } = usingCreator;

    it("should return true for matching actions", () => {
      const fooAction = foo(42);
      expect(guard(foo)(fooAction)).to.be.true;
      if (guard(foo)(fooAction)) {
        expect(fooAction.foo).to.equal(42);
      }
    });

    it("should return false for non-matching actions", () => {
      const barAction = bar(54);
      expect(guard(foo)(barAction)).to.be.false;
    });

    it("should return true for matching unions", () => {
      const fooAction = foo(42);
      expect(guard(foo, bar)(fooAction)).to.be.true;
    });

    it("should return false for non-matching unions", () => {
      const bazAction = baz(42);
      expect(guard(foo, bar)(bazAction)).to.be.false;
    });
  });

  describe("empty", () => {
    const { bar, baz, foo } = usingEmpty;

    it("should return true for matching actions", () => {
      const fooAction = foo();
      expect(guard(foo)(fooAction)).to.be.true;
    });

    it("should return false for non-matching actions", () => {
      const barAction = bar();
      expect(guard(foo)(barAction)).to.be.false;
    });

    it("should return true for matching unions", () => {
      const fooAction = foo();
      expect(guard(foo, bar)(fooAction)).to.be.true;
    });

    it("should return false for non-matching unions", () => {
      const bazAction = baz();
      expect(guard(foo, bar)(bazAction)).to.be.false;
    });
  });

  describe("fsa", () => {
    const { bar, baz, foo } = usingFsa;

    it("should return true for matching actions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo)(fooAction)).to.be.true;
      if (guard(foo)(fooAction) && !fooAction.error) {
        expect(fooAction.payload.foo).to.equal(42);
      }
    });

    it("should return false for non-matching actions", () => {
      const barAction = bar({ bar: 54 });
      expect(guard(foo)(barAction)).to.be.false;
    });

    it("should return true for matching unions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo, bar)(fooAction)).to.be.true;
    });

    it("should return false for non-matching unions", () => {
      const bazAction = baz({ baz: 42 });
      expect(guard(foo, bar)(bazAction)).to.be.false;
    });
  });

  describe("payload", () => {
    const { bar, baz, foo } = usingPayload;

    it("should return true for matching actions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo)(fooAction)).to.be.true;
      if (guard(foo)(fooAction)) {
        expect(fooAction.payload.foo).to.equal(42);
      }
    });

    it("should return false for non-matching actions", () => {
      const barAction = bar({ bar: 54 });
      expect(guard(foo)(barAction)).to.be.false;
    });

    it("should return true for matching unions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo, bar)(fooAction)).to.be.true;
    });

    it("should return false for non-matching unions", () => {
      const bazAction = baz({ baz: 42 });
      expect(guard(foo, bar)(bazAction)).to.be.false;
    });
  });

  describe("props", () => {
    const { bar, baz, foo } = usingProps;

    it("should return true for matching actions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo)(fooAction)).to.be.true;
      if (guard(foo)(fooAction)) {
        expect(fooAction.foo).to.equal(42);
      }
    });

    it("should return false for non-matching actions", () => {
      const barAction = bar({ bar: 54 });
      expect(guard(foo)(barAction)).to.be.false;
    });

    it("should return true for matching unions", () => {
      const fooAction = foo({ foo: 42 });
      expect(guard(foo, bar)(fooAction)).to.be.true;
    });

    it("should return false for non-matching unions", () => {
      const bazAction = baz({ baz: 42 });
      expect(guard(foo, bar)(bazAction)).to.be.false;
    });
  });
});
