/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Foo, Bar, Baz, Daz, Woo, Zoo } from "./foobar-spec";
import { isType } from "./isType";

describe("isType", () => {

    describe("declared actions", () => {

        it("should return true for matching actions", () => {
            const action = new Woo({ woo: 42 });
            expect(isType(action, Woo)).to.be.true;
            if (isType(action, Woo)) {
                expect(action.payload.woo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Zoo();
            expect(isType(action, Woo)).to.be.false;
        });
    });

    describe("generated actions with payloads", () => {

        it("should return true for matching actions", () => {
            const action = new Foo();
            expect(isType(action, Foo)).to.be.true;
            if (isType(action, Foo)) {
                expect(action.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Bar({ bar: 56 });
            expect(isType(action, Foo)).to.be.false;
        });
    });

    describe("generated actions with props", () => {

        it("should return true for matching actions", () => {
            const action = new Baz();
            expect(isType(action, Baz)).to.be.true;
            if (isType(action, Baz)) {
                expect(action.baz).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Daz({ daz: 56 });
            expect(isType(action, Baz)).to.be.false;
        });
    });
});
