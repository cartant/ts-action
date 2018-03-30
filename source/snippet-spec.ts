/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { reuseCompiler } from "ts-snippet";

export const expectSnippet = reuseCompiler(code => `
    import { action, base, Ctor, empty, on, payload, props, union } from "./dist";
    ${code}
`, {
    moduleResolution: "node",
    target: "es2015"
});

export const timeout = 5000;
