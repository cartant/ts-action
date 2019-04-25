# ts-action-immer

[![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/cartant/ts-action/blob/master/LICENSE)
[![NPM version](https://img.shields.io/npm/v/ts-action-immer.svg)](https://www.npmjs.com/package/ts-action-immer)
[![Build status](https://img.shields.io/travis/cartant/ts-action.svg)](http://travis-ci.org/cartant/ts-action)
[![Greenkeeper badge](https://badges.greenkeeper.io/cartant/ts-action.svg)](https://greenkeeper.io/)

### What is it?

The `ts-action-immer` package contains an alternative implementation of the `reducer` function in `ts-action` that uses [Immer](https://github.com/immerjs/immer).

### Why might you need it?

If you like the action and reducer creators in `ts-action` or in NgRx - which are [based on those in `ts-action`](https://github.com/ngrx/platform/issues/1634#issuecomment-476289210) - and also like Immer, you might want to use this package's Immer-based `reducer` function to create your reducers.

## Install

Install the package using npm:

```
npm install ts-action-immer --save
```

## Usage


The `reducer` function creates a reducer function out of the combined, action-specific reducers declared using the `on` function.

The `on` function creates a reducer for a specific, narrowed action and returns an object - containing the created reducer and the types of one or more action creators.

The reducer within each `on` function is passed a `state` that is an Immer `Draft`. The reducers can either modify the draft state and return nothing or can return a new state.

```ts
import { action, props } from "ts-action";
import { on, reducer } from "ts-action-immer";

const foo = action("FOO", props<{ foo: number }>());
const bar = action("BAR", props<{ bar: number }>());
const fooError = action("FOO_ERROR", props<{ foo: number, error: {} }>());
const barError = action("BAR_ERROR", props<{ bar: number, error: {} }>());

interface State { foo?: number; bar?: number; error?: {} }
const initialState: State = {};

const fooBarReducer = reducer(
  initialState,
  on(foo, (state, { foo }) => { state.foo = foo; }),
  on(bar, (state, { bar }) => { state.bar = bar; }),
  on(fooError, barError, (state, { error }) => { state.error = error; })
);
```