/**
 * @license Copyright © 2017 Nicholas Jamieson. All Rights Reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { Compiler, snippet } from "ts-snippet";

const compiler = new Compiler({
    moduleResolution: "node",
    target: "es2015"
});

export const expectSnippet = (code: string) => snippet({
    "research.ts": `
        import { action, base, Ctor, empty, payload, props, union } from "./dist";
        ${code}
    `
}, compiler).expect("research.ts");

export const timeout = 5000;
