/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression rxjs-no-explicit-generics*/

import { expect } from "chai";
import { exhaustMap, mergeMap, switchMap } from "rxjs/operators";
import { marbles } from "rxjs-marbles";
import { action } from "ts-action";
import { act } from "./act";

describe("act", () => {
  const foo = action("FOO");
  const boo = action("BOO");
  const coo = action("COO");
  const moo = action("MOO");
  const poo = action("POO");
  const values = { b: boo(), c: coo(), f: foo(), m: moo(), p: poo() };

  it(
    "should support next",
    marbles(m => {
      const source = m.cold("   f", values);
      const response = m.cold(" r");
      const expected = m.cold(" b", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: (value, index) => {
            expect(value).to.equal("r");
            expect(index).to.equal(0);
            return values.b;
          },
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support complete",
    marbles(m => {
      const source = m.cold("   f-", values);
      const response = m.cold(" r|");
      const expected = m.cold(" bc", values);

      const effect = source.pipe(
        act({
          complete: nexts => {
            expect(nexts).to.equal(1);
            return values.c;
          },
          error: () => values.p,
          next: () => values.b,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support error",
    marbles(m => {
      const source = m.cold("   f-", values);
      const response = m.cold(" r#");
      const expected = m.cold(" bp", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: () => values.b,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should default to concatMap",
    marbles(m => {
      const source = m.cold("   ff-----", values);
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---b--b", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: value => values.b,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support mergeMap",
    marbles(m => {
      const source = m.cold("   ff-----", values);
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---bb--", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: value => values.b,
          operator: mergeMap,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support switchMap",
    marbles(m => {
      const source = m.cold("   ff-----", values);
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ----b--", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: value => values.b,
          operator: switchMap,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support exhaustMap",
    marbles(m => {
      const source = m.cold("   ff-----", values);
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---b---", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: value => values.b,
          operator: exhaustMap,
          project: action => response
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support empty for unsubscriptions",
    marbles(m => {
      const source = m.cold("   ff", values);
      const response = m.cold(" --");
      const expected = m.cold(" -m", values);

      const effect = source.pipe(
        act({
          error: () => values.p,
          next: () => values.b,
          operator: switchMap,
          project: action => response,
          unsubscribe: nexts => {
            expect(nexts).to.equal(0);
            return values.m;
          }
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );
});
