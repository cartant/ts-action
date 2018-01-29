/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, props } from "../dist/action";
import { usingBase, usingEmpty, usingPayload, usingProps } from "./foobar-spec";
import { isType } from "../dist/isType";

describe("isType", () => {

    describe("base", () => {

        const Bar = usingBase.Bar;
        const Foo = usingBase.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo(42);
            expect(isType(a, Foo)).to.be.true;
            if (isType(a, Foo)) {
                expect(a.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar(56);
            expect(isType(a, Foo)).to.be.false;
        });
    });

    describe("empty", () => {

        const Bar = usingEmpty.Bar;
        const Foo = usingEmpty.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo();
            expect(isType(a, Foo)).to.be.true;
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar();
            expect(isType(a, Foo)).to.be.false;
        });
    });

    describe("payload", () => {

        const Bar = usingPayload.Bar;
        const Foo = usingPayload.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo({ foo: 42 });
            expect(isType(a, Foo)).to.be.true;
            if (isType(a, Foo)) {
                expect(a.payload.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar({ bar: 56 });
            expect(isType(a, Foo)).to.be.false;
        });
    });

    describe("props", () => {

        const Bar = usingProps.Bar;
        const Foo = usingProps.Foo;

        it("should return true for matching actions", () => {
            const a = new Foo({ foo: 42 });
            expect(isType(a, Foo)).to.be.true;
            if (isType(a, Foo)) {
                expect(a.foo).to.equal(42);
            }
        });

        it("should return false for non-matching actions", () => {
            const a = new Bar({ bar: 56 });
            expect(isType(a, Foo)).to.be.false;
        });

        describe("multiple creators", () => {

            const Action1 = action("ACTION_1", props<{ name: string }>());
            const Action2 = action("ACTION_2", props<{ name: string }>());
            const Action3 = action("ACTION_3", props<{ name: string }>());
            const Action4 = action("ACTION_4", props<{ name: string }>());

            it("should guard and narrow using two actions", () => {
                const a = new Action1({ name: "1" });
                expect(isType(a, Action1, Action2)).to.be.true;
                if (isType(a, Action1, Action2)) {
                    const name = a.name;
                }
            });

            it("should guard and narrow using three actions", () => {
                const a = new Action1({ name: "1" });
                expect(isType(a, Action1, Action2, Action3)).to.be.true;
                if (isType(a, Action1, Action2, Action3)) {
                    const name = a.name;
                }
            });

            it("should guard but not narrow using more than three actions", () => {
                const a = new Action1({ name: "1" });
                expect(isType(a, Action1, Action2, Action3, Action4)).to.be.true;
            });
        });
    });
});
