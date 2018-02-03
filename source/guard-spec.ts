/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, base, payload, props } from "../dist/action";
import { usingBase, usingEmpty, usingPayload, usingProps } from "./foobar-spec";
import { guard } from "../dist/guard";

describe("guard", () => {

    describe("base", () => {

        const Bar = usingBase.Bar;
        const Foo = usingBase.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo(42);
            expect(guard(Foo)(a)).to.be.true;
            if (guard(Foo)(a)) {
                expect(a.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar(56);
            expect(guard(Foo)(a)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const a = new Foo(42);
            expect(guard({ Foo, Bar })(a)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const Baz = action("Foobar [BAZ]", base(class { constructor(public baz: number) {} }));
            const a = new Baz(42);
            expect(guard({ Foo, Bar })(a)).to.be.false;
        });
    });

    describe("empty", () => {

        const Bar = usingEmpty.Bar;
        const Foo = usingEmpty.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo();
            expect(guard(Foo)(a)).to.be.true;
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar();
            expect(guard(Foo)(a)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const a = new Foo();
            expect(guard({ Foo, Bar })(a)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const Baz = action("Foobar [BAZ]");
            const a = new Baz();
            expect(guard({ Foo, Bar })(a)).to.be.false;
        });
    });

    describe("payload", () => {

        const Bar = usingPayload.Bar;
        const Foo = usingPayload.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo({ foo: 42 });
            expect(guard(Foo)(a)).to.be.true;
            if (guard(Foo)(a)) {
                expect(a.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar({ bar: 56 });
            expect(guard(Foo)(a)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const a = new Foo({ foo: 42 });
            expect(guard({ Foo, Bar })(a)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const Baz = action("Foobar [BAZ]", payload<{ baz: number }>());
            const a = new Baz({ baz: 42 });
            expect(guard({ Foo, Bar })(a)).to.be.false;
        });
    });

    describe("props", () => {

        const Bar = usingProps.Bar;
        const Foo = usingProps.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo({ foo: 42 });
            expect(guard(Foo)(a)).to.be.true;
            if (guard(Foo)(a)) {
                expect(a.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar({ bar: 56 });
            expect(guard(Foo)(a)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const a = new Foo({ foo: 42 });
            expect(guard({ Foo, Bar })(a)).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const Baz = action("Foobar [BAZ]", props<{ baz: number }>());
            const a = new Baz({ baz: 42 });
            expect(guard({ Foo, Bar })(a)).to.be.false;
        });
    });
});
