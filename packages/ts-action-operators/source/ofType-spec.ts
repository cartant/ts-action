/**
 * @license Use of this source code is governed by an MIT-style license that
 * can be found in the LICENSE file at https://github.com/cartant/ts-action
 */
/*tslint:disable:no-unused-expression rxjs-no-explicit-generics*/

import { expect } from "chai";
import { of } from "rxjs";
import { map, tap, toArray } from "rxjs/operators";
import { observe } from "rxjs-marbles/mocha";
import { Action, isType } from "ts-action";
import { usingEmpty, usingFsa, usingPayload, usingProps } from "./foobar-spec";
import { ofType } from "./ofType";

describe("ofType", () => {
  describe("empty", () => {
    const { bar, baz, foo } = usingEmpty;

    it(
      "should filter actions matching a single type",
      observe(() => {
        return of<Action>(foo(), bar()).pipe(
          ofType(foo),
          tap(action => expect(isType(action, foo)).to.be.true),
          map(action => action.type),
          toArray(),
          tap(array => expect(array).to.deep.equal(["[foobar] FOO"]))
        );
      })
    );

    it(
      "should filter actions matching multiple types",
      observe(() => {
        return of<Action>(foo(), bar()).pipe(
          ofType(foo, bar),
          tap(action => expect(isType(action, foo, bar)).to.be.true),
          map(action => action.type),
          toArray(),
          tap(array =>
            expect(array).to.deep.equal(["[foobar] FOO", "[foobar] BAR"])
          )
        );
      })
    );

    it(
      "should filter actions not matching a type",
      observe(() => {
        return of<Action>(foo()).pipe(
          ofType(bar),
          tap(action => expect(isType(action, bar)).to.be.true),
          map(action => action.type),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );

    it(
      "should filter actions not matching multiple types",
      observe(() => {
        return of<Action>(foo()).pipe(
          ofType(bar, baz),
          tap(action => expect(isType(action, bar, baz)).to.be.true),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );
  });

  describe("fsa", () => {
    const { bar, baz, foo } = usingFsa;

    it(
      "should filter actions matching a single type",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo),
          tap(action => expect(isType(action, foo)).to.be.true),
          map(action => (action.error ? undefined : action.payload.foo)),
          toArray(),
          tap(array => expect(array).to.deep.equal([42]))
        );
      })
    );

    it(
      "should filter actions matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo, bar),
          tap(action => expect(isType(action, foo, bar)).to.be.true),
          map(action =>
            action.error
              ? undefined
              : action.type === foo.type
              ? action.payload.foo
              : action.payload.bar
          ),
          toArray(),
          tap(array => expect(array).to.deep.equal([42, 54]))
        );
      })
    );

    it(
      "should filter actions not matching a type",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar),
          tap(action => expect(isType(action, bar)).to.be.true),
          map(action => (action.error ? undefined : action.payload.bar)),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );

    it(
      "should filter actions not matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar, baz),
          tap(action => expect(isType(action, bar, baz)).to.be.true),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );
  });

  describe("payload", () => {
    const { bar, baz, foo } = usingPayload;

    it(
      "should filter actions matching a single type",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo),
          tap(action => expect(isType(action, foo)).to.be.true),
          map(action => action.payload.foo),
          toArray(),
          tap(array => expect(array).to.deep.equal([42]))
        );
      })
    );

    it(
      "should filter actions matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo, bar),
          tap(action => expect(isType(action, foo, bar)).to.be.true),
          map(action =>
            action.type === foo.type ? action.payload.foo : action.payload.bar
          ),
          toArray(),
          tap(array => expect(array).to.deep.equal([42, 54]))
        );
      })
    );

    it(
      "should filter actions not matching a type",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar),
          tap(action => expect(isType(action, bar)).to.be.true),
          map(action => action.payload.bar),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );

    it(
      "should filter actions not matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar, baz),
          tap(action => expect(isType(action, bar, baz)).to.be.true),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );
  });

  describe("props", () => {
    const { bar, baz, foo } = usingProps;

    it(
      "should filter actions matching a single type",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo),
          tap(action => expect(isType(action, foo)).to.be.true),
          map(action => action.foo),
          toArray(),
          tap(array => expect(array).to.deep.equal([42]))
        );
      })
    );

    it(
      "should filter actions matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 }), bar({ bar: 54 })).pipe(
          ofType(foo, bar),
          tap(action => expect(isType(action, foo, bar)).to.be.true),
          map(action => (action.type === foo.type ? action.foo : action.bar)),
          toArray(),
          tap(array => expect(array).to.deep.equal([42, 54]))
        );
      })
    );

    it(
      "should filter actions not matching a type",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar),
          tap(action => expect(isType(action, bar)).to.be.true),
          map(action => action.bar),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );

    it(
      "should filter actions not matching multiple types",
      observe(() => {
        return of<Action>(foo({ foo: 42 })).pipe(
          ofType(bar, baz),
          tap(action => expect(isType(action, bar, baz)).to.be.true),
          toArray(),
          tap(array => expect(array).to.deep.equal([]))
        );
      })
    );
  });
});
