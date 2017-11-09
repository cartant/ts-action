# ts-action

[![NPM version](https://img.shields.io/npm/v/ts-action.svg)](https://www.npmjs.com/package/ts-action)
[![Build status](https://img.shields.io/travis/cartant/ts-action.svg)](http://travis-ci.org/cartant/ts-action)
[![dependency status](https://img.shields.io/david/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action)
[![devDependency Status](https://img.shields.io/david/dev/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action#info=devDependencies)
[![peerDependency Status](https://img.shields.io/david/peer/cartant/ts-action.svg)](https://david-dm.org/cartant/ts-action#info=peerDependencies)

### What is it?

`ts-action` is a package for declaring Redux action creators with less TypeScript cruft.

### Why might you need it?

I wanted a mechanism for declaring and consuming actions that involved writing as little boilerplate as possible. If you, too, want less cruft, you might find this package useful.

Also, if you are using NgRx or redux-observable, you might find the [`ts-action-operators`](https://github.com/cartant/ts-action-operators) package useful, too.

For an in-depth look at TypeScript, Redux and `ts-action`, have a look at: [How to Reduce Action Boilerplate](https://blog.angularindepth.com/how-to-reduce-action-boilerplate-90dc3d389e2b).

## Install

Install the package using npm:

```
npm install ts-action --save-dev
```

## Usage

Action creators are declared using the `action` method:

```ts
import { action, empty } from "ts-action";
const Foo = action({ type: "FOO", ...empty() });
```

Actions are created using the action creator as a class:

```ts
store.dispatch(new Foo());
```

For actions with payloads, the payload type is specified using the `payload` method:

```ts
import { action, payload } from "ts-action";
const Foo = action({ type: "FOO", ...payload<{ foo: number }>() });
```

and the payload value is specified when creating the action:

```ts
store.dispatch(new Foo({ foo: 42 }));
```

To have the properties added to the action itself - rather than a `payload` property - use the `props` method instead.

Action creators have `type` and `action` properties that can be used to narrow an action's TypeScript type in a reducer.

The action types can be combined into a discriminated union and the action can be narrowed to a specific TypeScript type using a `switch` statement, like this:

```ts
import { action, payload } from "ts-action";

const Foo = action({ type: "FOO", ...payload<{ foo: number }>() });
const Bar = action({ type: "BAR", ...payload<{ bar: number }>() });

type All = union(Foo, Bar);
type State = { foo?: number, bar?: number };

function fooBarReducer(state: State = {}, action: typeof All): State {
  switch (action.type) {
  case Foo.type:
    return { ...state, foo: action.payload.foo };
  case Bar.type:
    return { ...state, bar: action.payload.bar };
  default:
    return state;
  }
}
```

Or, the package's `isType` method can be used to narrow the action's type using `if` statements, like this:

```ts
import { action, isType, payload } from "ts-action";

const Foo = action({ type: "FOO", ...payload<{ foo: number }>() });
const Bar = action({ type: "BAR", ...payload<{ bar: number }>() });

function fooBarReducer(state: State = {}, action: Action): State {
  if (isType(action, Foo)) {
    return { ...state, foo: action.payload.foo };
  }
  if (isType(action, Bar)) {
    return { ...state, bar: action.payload.bar };
  }
  return state;
}
```

## API

* [action](#action)
* [empty](#empty)
* [payload](#payload)
* [props](#props)
* [base](#base)
* [union](#union)
* [isType](#isType)
* [guard](#guard)

<a name="action"></a>

### action

The `action` method returns an action creator:

```ts
const Foo = action({ type: "FOO", ...empty() });
```

Action creators are classes and actions are be created using `new`:

```ts
store.dispatch(new Foo());
```

The `type` option passed to the `action` method will be assigned to the created action's `type` property. The value passed should be either a literal or a literal type. That is, this is fine:

```ts
const Foo = action({ type: "FOO", ...empty() });
```

And this is fine, too:

```ts
const FOO = "FOO"; // Equivalent to: const FOO: "FOO" = "FOO";
const Foo = action({ type: FOO, ...empty() });
```

However, with the following, TypeScript will be unable to narrow the action in a discriminated union:

```ts
let foo: string = "FOO";
const Foo = action({ type: foo, ...empty() });
```

And the `type` option passed to the `action` method can be obtained using the creator's static `type` property:

```ts
switch (action.type) {
case Foo.type:
  return { ...state, foo: action.payload.foo };
default:
  return state;
}
```

<a name="empty"></a>

### empty

`empty` is a method that's used to construct the options passed to the `action` method. To declare an action without a payload or properties , call it like this:

```ts
action({ type: "FOO", ...empty() });
```

Note that the spread syntax is used, as `payload` merges more that one option.

<a name="payload"></a>

### payload

`payload` is a method that's used to construct the options passed to the `action` method. To declare a payload, call it like this, specifying the type:

```ts
action({ type: "FOO", ...payload<number>() });
```

Note that the spread syntax is used, as `payload` merges more that one option.

<a name="props"></a>

### props

`props` is a method that's used to construct the options passed to the `action` method. To declare properties, call it like this, specifying the type:

```ts
action({ type: "FOO", ...props<{ name: string }>() });
```

Note that the spread syntax is used, as `props` merges more that one option.

The `props` method is similar to the `payload` method, but with `props`, the specified properties are added to the action itself - rather than a `payload` property.

<a name="base"></a>

### base

`base` is a method that's used to construct the options passed to the `action` method. To declare a base class with properties, call it like this:

```ts
action({ type: "FOO", ...base(class { constructor(public foo: number) {} }) });
```

The `base` method is similar to the `props` method, but with offers more control over property defaults, etc. as the base class is declared inline.

<a name="union"></a>

### union

The `union` method can be used to infer a union of actions - for type narrowing using a discriminated union. It's passed two or more action creators and returns a value that can be used with TypeScript's `typeof` operator, like this:

```ts
const All = union(Foo, Bar);
function reducer(state: any = [], action: typeof All): any {
    switch (action.type) {
    case Foo.type:
        return ... // Here the action will be narrowed to Foo.
    case Bar.type:
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
if (isType(action, Foo)) {
  // Here, TypeScript has narrowed the type, so the action is strongly typed
  // and individual properties can be accessed in a type-safe manner.
}
```

### guard

`guard` is a higher-order equivalent of `isType`. That is, it returns a TypeScript [type guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html) that will, in turn, return either `true` or `false` depending upon whether the passed action is of the appropriate type. The `guard` method is useful when dealing with APIs that accept type guards.

For example, `Array.prototype.filter` accepts a type guard:

```ts
const actions = [new Foo(), new Bar()];
const filtered = actions.filter(guard(Foo)); // Inferred to be: const filtered: Foo[]
```

<a target='_blank' rel='nofollow' href='https://app.codesponsor.io/link/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-action'>
  <img alt='Sponsor' width='888' height='68' src='https://app.codesponsor.io/embed/jZB4ja6SvwGUN4ibgYVgUVYV/cartant/ts-action.svg' />
</a>