# ts-action

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/ts-action/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/ts-action.svg)](https://www.npmjs.com/package/ts-action)
[![Build status](https://img.shields.io/travis/cartant/ts-action.svg)](http://travis-ci.org/cartant/ts-action)
[![dependency status](https://img.shields.io/david/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action)
[![devDependency Status](https://img.shields.io/david/dev/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action#info=peerDependencies)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/ts-action.svg)](https://greenkeeper.io/)

### What is it?

`ts-action` is a package for declaring Redux action creators with less TypeScript cruft.

### Why might you need it?

I wanted a mechanism for declaring and consuming actions that involved writing as little boilerplate as possible. If you, too, want less cruft, you might find this package useful.

Also, if you are using NgRx or redux-observable, you might find the [`ts-action-operators`](https://github.com/cartant/ts-action-operators) package useful, too - it includes an RxJS pipeable `ofType` operator that can be passed a `ts-action` action creator.

For an in-depth look at TypeScript, Redux and `ts-action`, have a look at: [How to Reduce Action Boilerplate](https://blog.angularindepth.com/how-to-reduce-action-boilerplate-90dc3d389e2b).

## Install

Install the package using npm:

```
npm install ts-action --save
```

TypeScript version 3.0 or later is required.

### Function-based versus class-based action creators

Early versions of `ts-action` used class-based action creators. That is, the actions themselves were classes.

In version 8, class-based action creators were deprecated in favour of function-based action creators - functions that return plain objects. Function-based action creators are simpler and don't require a prototype-setting kludge to be used with `reactjs/redux`.

There is more information on class-based action creators - which can still be used - [here](./CLASSES.md).

## Usage

Action creators are declared using the `action` method:

```ts
import { action } from "ts-action";
const foo = action("FOO");
```

Actions are created using the returned action creator function:

```ts
store.dispatch(foo());
```

For actions with payloads, the payload type is specified using the [`payload`](#payload) method:

```ts
import { action, payload } from "ts-action";
const foo = action("FOO", payload<{ foo: number }>());
```

and the payload value is specified when creating the action:

```ts
store.dispatch(foo({ foo: 42 }));
```

To have the properties added to the action itself - rather than a `payload` property - use the [`props`](#props) method instead. Or, for more control over the parameters accepted by the action creator, pass a [creator](#creator) function.

Action creators have a `type` property that can be used to narrow an action's TypeScript type in a reducer.

The action types can be combined into a discriminated union and the action can be narrowed to a specific TypeScript type using a `switch` statement, like this:

```ts
import { action, payload, union } from "ts-action";

const foo = action("FOO", payload<{ foo: number }>());
const bar = action("BAR", payload<{ bar: number }>());
const both = union([foo, bar]);

interface State { foo?: number; bar?: number; }
const initialState = {};

function fooBarReducer(state: State = initialState, action: typeof both): State {
  switch (action.type) {
  case foo.type:
    return { ...state, foo: action.payload.foo };
  case bar.type:
    return { ...state, bar: action.payload.bar };
  default:
    return state;
  }
}
```

Or, the package's `isType` method can be used to narrow the action's type using `if` statements, like this:

```ts
import { action, isType, payload } from "ts-action";

const foo = action("FOO", payload<{ foo: number }>());
const bar = action("BAR", payload<{ bar: number }>());

interface State { foo?: number; bar?: number; }
const initialState = {};

function fooBarReducer(state: State = initialState, action: Action): State {
  if (isType(action, foo)) {
    return { ...state, foo: action.payload.foo };
  }
  if (isType(action, bar)) {
    return { ...state, bar: action.payload.bar };
  }
  return state;
}
```

Or, the package's [`reducer`](#reducer) method can be used to create a reducer function, like this:

```ts
import { action, on, payload, reducer } from "ts-action";

const foo = action("FOO", payload<{ foo: number }>());
const bar = action("BAR", payload<{ bar: number }>());

interface State { foo?: number; bar?: number; }
const initialState = {};

const fooBarReducer = reducer<State>([
  on(foo, (state, { payload }) => ({ ...state, foo: payload.foo })),
  on(bar, (state, { payload }) => ({ ...state, bar: payload.bar }))
], initialState);
```

## API

* [action](#action)
* [empty](#empty)
* [payload](#payload)
* [fsa](#fsa)
* [props](#props)
* [creator](#creator)
* [union](#union)
* [isType](#isType)
* [guard](#guard)
* [reducer](#reducer)

<a name="action"></a>

### action

```ts
function action<T>(type: T)
function action<T>(type: T, config: unknown)
function action<T>(type: T, creator: (...args: any[]) => object)
```

The `action` method returns an action creator. Action creators are functions:

```ts
const foo = action("FOO");
const fooAction = foo();
console.log(fooAction); // { type: "FOO" }
```

The `type` argument passed to `action` must be a string literal or have a string-literal type. Otherwise, TypeScript will not be able to narrow actions in a discriminated union.

The `type` option passed to the `action` method can be obtained using the creator's static `type` property:

```ts
switch (action.type) {
case foo.type:
  return { ...state, foo: action.payload.foo };
default:
  return state;
}
```

To define propeties, the `action` method can be passed a `config`. The `config` should be created using the `empty`, `payload`, `props` or `fsa` methods.

<a name="empty"></a>

### empty

```ts
function empty()
```

The `empty` method constructs the `config` for the `action` method. To declare an action without a payload or properties , call it like this:

```ts
const foo = action("FOO", empty());
const fooAction = foo();
console.log(fooAction); // { type: "FOO" }
```

Actions default to being empty; if only a `type` is passed to the `action` call, an empty action is created by default:

```ts
const foo = action("FOO");
const fooAction = foo();
console.log(fooAction); // { type: "FOO" }
```

<a name="payload"></a>

### payload

```ts
function payload<T>()
```

The `payload` method constructs the `config` for the `action` method. To declare action properties within a `payload` property, call it like this:

```ts
const foo = action("FOO", payload<{ name: string }>());
const fooAction = foo({ name: "alice" });
console.log(fooAction); // { type: "FOO", payload: { name: "alice" } }
```

<a name="fsa"></a>

### fsa

```ts
function fsa<T>()
```

The `fsa` method constructs the `config` for the `action` method. To declare action properties within a `payload` property, call it like this:

```ts
const foo = action("FOO", fsa<{ name: string }>());
const fooAction = foo({ name: "alice" });
console.log(fooAction); // { type: "FOO", payload: { name: "alice" }, error: false, meta: undefined }
```

The action creator returns a Flux Standard Action and can also be passed an `Error` instance:

```ts
const fooAction = foo(new Error("Kaboom!"));
console.log(fooAction); // { type: "FOO", payload: Error("Kaboom!"), error: true, meta: undefined }
```

<a name="props"></a>

### props

```ts
function props<T>()
```

The `props` method constructs the `config` for the `action` method. To declare action properties at the same level as the `type` property, call it like this:

```ts
const foo = action("FOO", props<{ name: string }>());
const fooAction = foo({ name: "alice" });
console.log(fooAction); // { type: "FOO", name: "alice" }
```

The `props` method is similar to the `payload` method, but with `props`, the specified properties are added to the action itself - rather than a `payload` property.

<a name="creator"></a>

### creator

Instead of passing a `config` to the `action` method, a creator function can be passed like this:

```ts
const foo = action("FOO", (name: string) => ({ name }));
const fooAction = foo("alice");
console.log(fooAction); // { type: "FOO", name: "alice" }
```

Passing a creator function  offers more control over property defaults, etc.

<a name="union"></a>

### union

The `union` method can be used to infer a union of actions - for type narrowing using a discriminated union. It's passed an array literal of action creators and returns a value that can be used with TypeScript's `typeof` operator, like this:

```ts
const both = union([foo, bar]);
function reducer(state: any = [], action: typeof both): any {
  switch (action.type) {
  case fFoo.type:
    return ... // Here the action will be narrowed to Foo.
  case bar.type:
    return ... // Here the action will be narrowed to Bar.
  default:
    return state;
  }
}
```

<a name="isType"></a>

### isType

`isType` is a TypeScript [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) that will return either `true` or `false` depending upon whether the passed action is of the appropriate type. TypeScript will narrow the type when used with an `if` statement.

For example:

```ts
if (isType(action, foo)) {
  // Here, TypeScript has narrowed the type, so the action is strongly typed
  // and individual properties can be accessed in a type-safe manner.
}
```

`isType` can also be passed multiple action creators:

```ts
if (isType(action, [foo, bar])) {
  // Here, TypeScript has narrowed the type to `typeof union([foo, bar])`.
}
```

### guard

`guard` is a higher-order equivalent of `isType`. That is, it returns a TypeScript [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) that will, in turn, return either `true` or `false` depending upon whether the passed action is of the appropriate type. The `guard` method is useful when dealing with APIs that accept type guards.

For example, `Array.prototype.filter` accepts a type guard:

```ts
const actions = [foo(), bar()];
const filtered = actions.filter(guard(foo));
// TypeScript will have narrowed the type of filtered, so the actions within
// the array are strongly typed and individual properties can be accessed in
// a type-safe manner.
```

`guard` can also be passed multiple action creators:

```ts
const actions = [foo(), bar(), baz()];
const filtered = actions.filter(guard([foo, bar]));
```

<a name="reducer"></a>

### reducer

The `reducer` method creates a reducer function out of the combined, action-specific reducers specified in the array. The array should be populated with the results of calls to the `on` method.

The `on` method creates a reducer for a specific, narrowed action and returns an object - containing the created reducer and the types of one or more actions creators.

```ts
import { action, on, payload, reducer } from "ts-action";

const foo = action("FOO", payload<{ foo: number }>());
const bar = action("BAR", payload<{ bar: number }>());
const fooError = action("FOO_ERROR", payload<{ foo: number, error: {} }>());
const barError = action("BAR_ERROR", payload<{ bar: number, error: {} }>());

interface State { foo?: number; bar?: number; error?: {} }
const initialState = {};

const fooBarReducer = reducer<State>([
  on(foo, (state, { payload }) => ({ ...state, foo: payload.foo })),
  on(bar, (state, { payload }) => ({ ...state, bar: payload.bar })),
  on({ fooError, barError }, (state, { payload }) => ({ ...state, error: payload.error }))
], initialState);
```