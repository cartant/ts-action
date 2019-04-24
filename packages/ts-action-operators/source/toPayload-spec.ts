/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression rxjs-no-explicit-generics*/

import { expect } from "chai";
import { of } from "rxjs";
import { tap, toArray } from "rxjs/operators";
import { observe } from "rxjs-marbles/mocha";
import { Action } from "ts-action";
import { usingPayload } from "./foobar-spec";
import { ofType } from "./ofType";
import { toPayload } from "./toPayload";

describe("toPayload", () => {
  const { foo } = usingPayload;

  it(
    "should obtain the payload",
    observe(() => {
      return of<Action>(foo({ foo: 42 })).pipe(
        ofType(foo),
        toPayload(),
        toArray(),
        tap(array => expect(array).to.deep.equal([{ foo: 42 }]))
      );
    })
  );
});
