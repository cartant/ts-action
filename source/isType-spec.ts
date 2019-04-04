/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { usingCreator, usingEmpty, usingFsa, usingPayload, usingProps } from "./foobar-spec";
import { isType } from "./isType";

describe("classes/isType", () => {

    describe("props", () => {

        const { bar, baz, foo } = usingCreator;

        it("should return true for matching actions", () => {
            const fooAction = foo(42);
            expect(isType(fooAction, foo)).to.be.true;
            if (isType(fooAction, foo)) {
                expect(fooAction.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const barAction = bar(54);
            expect(isType(barAction, foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const fooAction = foo(42);
            expect(isType(fooAction, [foo, bar])).to.be.true;
        });

        it("should return true for matching unions expressed as an object literal", () => {
            const fooAction = foo(42);
            expect(isType(fooAction, { foo, bar })).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const bazAction = baz(42);
            expect(isType(bazAction, [foo, bar])).to.be.false;
        });

        it("should return false for non-matching unions expressed as an object literal", () => {
            const bazAction = baz(42);
            expect(isType(bazAction, { foo, bar })).to.be.false;
        });
    });

    describe("empty", () => {

        const { bar, baz, foo } = usingEmpty;

        it("should return true for matching actions", () => {
            const fooAction = foo();
            expect(isType(fooAction, foo)).to.be.true;
        });

        it("should return false for non-matching actions", () => {
            const barAction = bar();
            expect(isType(barAction, foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const fooAction = foo();
            expect(isType(fooAction, [foo, bar])).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const bazAction = baz();
            expect(isType(bazAction, [foo, bar])).to.be.false;
        });
    });

    describe("fsa", () => {

        const { bar, baz, foo } = usingFsa;

        it("should return true for matching actions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, foo)).to.be.true;
            if (isType(fooAction, foo) && !fooAction.error) {
                expect(fooAction.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const barAction = bar({ bar: 54 });
            expect(isType(barAction, foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, [foo, bar])).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const bazAction = baz({ baz: 42 });
            expect(isType(bazAction, [foo, bar])).to.be.false;
        });
    });

    describe("payload", () => {

        const { bar, baz, foo } = usingPayload;

        it("should return true for matching actions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, foo)).to.be.true;
            if (isType(fooAction, foo)) {
                expect(fooAction.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const barAction = bar({ bar: 54 });
            expect(isType(barAction, foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, [foo, bar])).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const bazAction = baz({ baz: 42 });
            expect(isType(bazAction, [foo, bar])).to.be.false;
        });
    });

    describe("props", () => {

        const { bar, baz, foo } = usingProps;

        it("should return true for matching actions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, foo)).to.be.true;
            if (isType(fooAction, foo)) {
                expect(fooAction.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const barAction = bar({ bar: 54 });
            expect(isType(barAction, foo)).to.be.false;
        });

        it("should return true for matching unions", () => {
            const fooAction = foo({ foo: 42 });
            expect(isType(fooAction, [foo, bar])).to.be.true;
        });

        it("should return false for non-matching unions", () => {
            const bazAction = baz({ baz: 42 });
            expect(isType(bazAction, [foo, bar])).to.be.false;
        });
    });
});
