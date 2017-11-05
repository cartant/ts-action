/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression*/

import { expect } from "chai";
import { action, payload, props } from "./action";

describe("action", () => {

    describe("with types only", () => {

        it("should create an action", () => {
            const Boo = action({ type: "BOO" });
            const boo = new Boo();
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.not.have.property("payload");
        });

        it("should support create", () => {
            const Boo = action({ type: "BOO" });
            const boo = Boo.create();
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.not.have.property("payload");
        });

        it("should expose the action type", () => {
            const Boo = action({ type: "BOO" });
            type BooAction = typeof Boo.action;
            const boo: BooAction = new Boo();
        });

        it("should narrow the action", () => {
            const Boo = action({ type: "BOO" });
            const narrow = (action: typeof Boo.action | { type: "OTHER", payload: number }) => {
                if (action.type === Boo.type) {
                    throw new Error("Should not get here.");
                } else {
                    expect(action.payload).to.equal(42);
                }
            };
            narrow({ type: "OTHER", payload: 42 });
        });
    });

    describe("with payloads", () => {

        it("should create an action", () => {
            const Boo = action({ type: "BOO", ...payload<number>() });
            const boo = new Boo(42);
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.have.property("payload", 42);
        });

        it("should support create", () => {
            const Boo = action({ type: "BOO", ...payload<number>() });
            const boo = Boo.create(42);
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.have.property("payload", 42);
        });

        it("should expose the action type", () => {
            const Boo = action({ type: "BOO", ...payload<number>() });
            type BooAction = typeof Boo.action;
            const boo: BooAction = new Boo(42);
        });

        it("should narrow the action", () => {
            const Boo = action({ type: "BOO", ...payload<{ boo: number }>() });
            const Coo = action({ type: "COO", ...payload<{ coo: number }>() });
            const narrow = (action: typeof Boo.action | typeof Coo.action) => {
                if (action.type === Boo.type) {
                    expect(action.payload.boo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Boo({ boo: 42 }));
        });
    });

    describe("with props", () => {

        it("should create an action", () => {
            const Boo = action({ type: "BOO", ...props<{ boo: number }>() });
            const boo = new Boo({ boo: 42 });
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.have.property("boo", 42);
        });

        it("should support create", () => {
            const Boo = action({ type: "BOO", ...props<{ boo: number }>() });
            const boo = Boo.create({ boo: 42 });
            expect(boo).to.have.property("type", "BOO");
            expect(boo).to.have.property("boo", 42);
        });

        it("should expose the action type", () => {
            const Boo = action({ type: "BOO", ...props<{ boo: number }>() });
            type BooAction = typeof Boo.action;
            const boo: BooAction = new Boo({ boo: 42 });
        });

        it("should narrow the action", () => {
            const Boo = action({ type: "BOO", ...props<{ boo: number }>() });
            const Coo = action({ type: "COO", ...props<{ coo: number }>() });
            const narrow = (action: typeof Boo.action | typeof Coo.action) => {
                if (action.type === Boo.type) {
                    expect(action.boo).to.equal(42);
                } else {
                    throw new Error("Should not get here.");
                }
            };
            narrow(new Boo({ boo: 42 }));
        });
    });
});
