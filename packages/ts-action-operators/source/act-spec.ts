/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression rxjs-no-explicit-generics*/

import { expect } from "chai";
import { exhaustMap, mapTo, mergeMap, switchMap } from "rxjs/operators";
import { marbles } from "rxjs-marbles";
import { action } from "ts-action";
import { act } from "./act";

describe("act", () => {
  const foo = action("FOO");
  const boo = action("BOO");
  const coo = action("COO");
  const doo = action("DOO");
  const poo = action("POO");
  const f = foo();
  const b = boo();
  const c = coo();
  const d = doo();
  const p = poo();

  it(
    "should support project",
    marbles(m => {
      const source = m.cold("   f", { f });
      const response = m.cold(" r");
      const expected = m.cold(" b", { b });

      const effect = source.pipe(
        act({
          error: () => p,
          project: (action, index) => {
            expect(action).to.equal(f);
            expect(index).to.equal(0);
            return response.pipe(mapTo(b));
          }
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support complete",
    marbles(m => {
      const source = m.cold("   f-", { f });
      const response = m.cold(" r|");
      const expected = m.cold(" bc", { b, c });

      const effect = source.pipe(
        act({
          complete: (nexts, action) => {
            expect(nexts).to.equal(1);
            expect(action).to.equal(f);
            return c;
          },
          error: () => p,
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support error",
    marbles(m => {
      const source = m.cold("   f-", { f });
      const response = m.cold(" r#");
      const expected = m.cold(" bp", { b, p });

      const effect = source.pipe(
        act({
          error: (error, action) => {
            expect(error).to.not.be.undefined;
            expect(action).to.equal(f);
            return p;
          },
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should default to concatMap",
    marbles(m => {
      const source = m.cold("   ff-----", { f });
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---b--b", { b });

      const effect = source.pipe(
        act({
          error: () => p,
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support mergeMap",
    marbles(m => {
      const source = m.cold("   ff-----", { f });
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---bb--", { b });

      const effect = source.pipe(
        act({
          error: () => p,
          operator: mergeMap,
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support switchMap",
    marbles(m => {
      const source = m.cold("   ff-----", { f });
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ----b--", { b });

      const effect = source.pipe(
        act({
          error: () => p,
          operator: switchMap,
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support exhaustMap",
    marbles(m => {
      const source = m.cold("   ff-----", { f });
      const response = m.cold(" ---(r|)");
      const expected = m.cold(" ---b---", { b });

      const effect = source.pipe(
        act({
          error: () => p,
          operator: exhaustMap,
          project: () => response.pipe(mapTo(b))
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );

  it(
    "should support unsubscribe",
    marbles(m => {
      const source = m.cold("   ff", { f });
      const response = m.cold(" --");
      const expected = m.cold(" -d", { d });

      const effect = source.pipe(
        act({
          error: () => p,
          operator: switchMap,
          project: () => response.pipe(mapTo(b)),
          unsubscribe: (nexts, action) => {
            expect(nexts).to.equal(0);
            expect(action).to.equal(f);
            return d;
          }
        })
      );
      m.expect(effect).toBeObservable(expected);
    })
  );
});
