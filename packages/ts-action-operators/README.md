# ts-action-operators

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/ts-action/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/ts-action-operators.svg)](https://www.npmjs.com/package/ts-action-operators)
[![Build status](https://img.shields.io/travis/cartant/ts-action.svg)](http://travis-ci.org/cartant/ts-action)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/ts-action.svg)](https://greenkeeper.io/)

### What is it?

The `ts-action-operators` package contains RxJS operators for action observables.

### Why might you need it?

I created the [`ts-action`](https://github.com/cartant/ts-action) package because I wanted a mechanism for declaring and consuming actions that involved writing as little boilerplate as possible. And I created this package so that I could apply the TypeScript narrowing mechanisms in `ts-action` to the composition of NgRx effects and redux-observable epics.

If you, too, want less cruft in your effects or epics, you might find this package useful.

For an in-depth look at TypeScript, Redux and `ts-action`, have a look at: [How to Reduce Action Boilerplate](https://blog.angularindepth.com/how-to-reduce-action-boilerplate-90dc3d389e2b).

## Install

Install the package using npm:

```
npm install ts-action-operators --save
```

## Usage

The package includes operators for filtering and narrowing actions and for selecting strongly typed payloads. The operators can be used in NgRx effects or redux-observable epics, like this:

```ts
import { ofType, toPayload } from "ts-action-operators";
const epic = actions => actions.pipe(
  ofType(foo),
  toPayload(),
  tap(payload => console.log(payload.foo)),
  ...
);
```

Using `pipe` is recommended; however, you if use a version of RxJS that does not include `pipe`, you can use `let` instead:

```ts
import { ofType, toPayload } from "ts-action-operators";
import "rxjs/add/operator/let";
const epic = actions => actions
  .let(ofType(foo))
  .let(toPayload())
  .do(payload => console.log(payload.foo))
  ...
```

## API

* [ofType](#ofType)
* [toPayload](#toPayload)

<a name="ofType"></a>

### ofType

The `ofType` operator can be passed `ts-action`-declared action creators. The operator will remove unwanted actions from the observable stream.

If only a single action creator is specified, the action's type will be narrowed. For example:

```ts
.pipe(
  ofType(foo),
  tap(action => {
    // Here, TypeScript has narrowed the type, so the action is strongly typed
    // and individual properties can be accessed in a type-safe manner.
  })
)
```

If multiple action creators are specified - in an array literal - the action's type will be narrowed to a union:

```ts
.pipe(
  ofType([foo, bar]),
  tap(action => {
    // Here, the action has been narrowed to `typeof union([foo, bar])`.
    // Common properties will be accessible, other will require further narrowing.
    if (isType(action, foo)) {
      // Here, the action has been narrowed to a FOO action.
    } else if (isType(action, bar)) {
      // Here, the action has been narrowed to a BAR action.
    }
  })
)
```

<a name="toPayload"></a>

### toPayload

The `toPayload` operator takes no parameters. It can be applied to an obserable stream that emits narrowed actions that contain payloads. For example:

```ts
.pipe(
  ofType(foo),
  toPayload()
  tap(payload => {
    // Here, TypeScript has narrowed the type, so the payload is strongly typed
    // and individual properties can be accessed in a type-safe manner.
  })
)
```