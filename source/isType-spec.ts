/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { usingBase, usingEmpty, usingPayload, usingProps } from "./foobar-spec";
import { isType } from "../dist/isType";

describe("isType", () => {

    describe("base", () => {

        const Bar = usingBase.Bar;
        const Baz = usingBase.Baz;
        const Foo = usingBase.Foo;

        it("should return true for matching actions", () => {
            const foo = new Foo(42);
            expect(isType(foo, Foo)).to.be.true;
            if (isType(foo, Foo)) {
                expect(foo.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar(56);
            expect(isType(bar, Foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo(42);
            expect(isType(foo, { Foo, Bar })).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz(42);
            expect(isType(baz, { Foo, Bar })).to.be.false;
        });
    });

    describe("empty", () => {

        const Bar = usingEmpty.Bar;
        const Baz = usingEmpty.Baz;
        const Foo = usingEmpty.Foo;

        it("should return true for matching actions", () => {
            const foo = new Foo();
            expect(isType(foo, Foo)).to.be.true;
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar();
            expect(isType(bar, Foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo();
            expect(isType(foo, { Foo, Bar })).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz();
            expect(isType(baz, { Foo, Bar })).to.be.false;
        });
    });

    describe("payload", () => {

        const Bar = usingPayload.Bar;
        const Baz = usingPayload.Baz;
        const Foo = usingPayload.Foo;

        it("should return true for matching actions", () => {
            const foo = new Foo({ foo: 42 });
            expect(isType(foo, Foo)).to.be.true;
            if (isType(foo, Foo)) {
                expect(foo.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar({ bar: 56 });
            expect(isType(bar, Foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo({ foo: 42 });
            expect(isType(foo, { Foo, Bar })).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz({ baz: 42 });
            expect(isType(baz, { Foo, Bar })).to.be.false;
        });
    });

    describe("props", () => {

        const Bar = usingProps.Bar;
        const Baz = usingProps.Baz;
        const Foo = usingProps.Foo;

        it("should return true for matching actions", () => {
            const foo = new Foo({ foo: 42 });
            expect(isType(foo, Foo)).to.be.true;
            if (isType(foo, Foo)) {
                expect(foo.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar({ bar: 56 });
            expect(isType(bar, Foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo({ foo: 42 });
            expect(isType(foo, { Foo, Bar })).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz({ baz: 42 });
            expect(isType(baz, { Foo, Bar })).to.be.false;
        });
    });
});
