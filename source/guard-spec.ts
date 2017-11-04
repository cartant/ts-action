/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { Foo, Bar, Baz, Daz, Woo, Zoo } from "./foobar-spec";
import { guard } from "./guard";

describe("guard", () => {

    describe("declared actions", () => {

        it("should return true for matching actions", () => {
            const action = new Woo({ woo: 42 });
            expect(guard(Woo)(action)).to.be.true;
            if (guard(Woo)(action)) {
                expect(action.payload.woo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Zoo();
            expect(guard(Woo)(action)).to.be.false;
        });
    });

    describe("generated actions with payloads", () => {

        it("should return true for matching actions", () => {
            const action = new Foo();
            expect(guard(Foo)(action)).to.be.true;
            if (guard(Foo)(action)) {
                expect(action.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Bar({ bar: 56 });
            expect(guard(Foo)(action)).to.be.false;
        });
    });

    describe("generated actions with props", () => {

        it("should return true for matching actions", () => {
            const action = new Baz();
            expect(guard(Baz)(action)).to.be.true;
            if (guard(Baz)(action)) {
                expect(action.baz).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const action = new Daz({ daz: 56 });
            expect(guard(Baz)(action)).to.be.false;
        });
    });
});
