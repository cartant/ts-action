/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { usingBase, usingEmpty, usingPayload, usingProps } from "./foobar-spec";
import { guard } from "./guard";

describe("guard", () => {

    describe("base", () => {

        const { Bar, Baz, Foo } = usingBase;

        it("should return true for matching actions", () => {
            const foo = new Foo(42);
            expect(guard(Foo)(foo)).to.be.true;
            if (guard(Foo)(foo)) {
                expect(foo.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar(56);
            expect(guard(Foo)(bar)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo(42);
            expect(guard({ Foo, Bar })(foo)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz(42);
            expect(guard({ Foo, Bar })(baz)).to.be.false;
        });
    });

    describe("empty", () => {

        const { Bar, Baz, Foo } = usingEmpty;

        it("should return true for matching actions", () => {
            const foo = new Foo();
            expect(guard(Foo)(foo)).to.be.true;
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar();
            expect(guard(Foo)(bar)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo();
            expect(guard({ Foo, Bar })(foo)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz();
            expect(guard({ Foo, Bar })(baz)).to.be.false;
        });
    });

    describe("payload", () => {

        const { Bar, Baz, Foo } = usingPayload;

        it("should return true for matching actions", () => {
            const foo = new Foo({ foo: 42 });
            expect(guard(Foo)(foo)).to.be.true;
            if (guard(Foo)(foo)) {
                expect(foo.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar({ bar: 56 });
            expect(guard(Foo)(bar)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo({ foo: 42 });
            expect(guard({ Foo, Bar })(foo)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz({ baz: 42 });
            expect(guard({ Foo, Bar })(baz)).to.be.false;
        });
    });

    describe("props", () => {

        const { Bar, Baz, Foo } = usingProps;

        it("should return true for matching actions", () => {
            const foo = new Foo({ foo: 42 });
            expect(guard(Foo)(foo)).to.be.true;
            if (guard(Foo)(foo)) {
                expect(foo.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const bar = new Bar({ bar: 56 });
            expect(guard(Foo)(bar)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const foo = new Foo({ foo: 42 });
            expect(guard({ Foo, Bar })(foo)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const baz = new Baz({ baz: 42 });
            expect(guard({ Foo, Bar })(baz)).to.be.false;
        });
    });
});
