/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */

import { expecter } from "ts-snippet";

export const expectSnippet = expecter(
  code => `
    import { action, empty, fsa, on, payload, props, reducer, union } from "./source";
    ${code}
  `,
  {
    moduleResolution: "node",
    target: "es2015"
  }
);

export const timeout = 5000;
