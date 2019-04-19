<a name="10.0.1"></a>
## [10.0.1](https://github.com/cartant/ts-action/compare/v10.0.0...v10.0.1) (2019-04-19)

* Update documentation. ([5db1725](https://github.com/cartant/ts-action/commit/5db1725))

### Fixes

<a name="10.0.0"></a>
## [10.0.0](https://github.com/cartant/ts-action/compare/v9.0.0...v10.0.0) (2019-04-19)

### Breaking changes

* `reducer` now takes the `intialState` as its first parameter, followed by any number of `on` declarations - using a rest parameter, rather than an array.
* The types used for the `reducer` parameters have been simplified, but unless said types have been explicitly referenced, this won't be a breaking change.

<a name="9.0.0"></a>
## [9.0.0](https://github.com/cartant/ts-action/compare/v8.1.2...v9.0.0) (2019-04-06)

### Breaking changes

* Expressing multiple actions using array or object literals is no longer supported. Pass multiple actions as separate arguments instead.

    That is, instead of this:

        union({ foo, bar }); // or union([foo, bar]);

    Do this:

        union(foo, bar);

    This breaking change applies to `union`, `guard`, `isType` and `on`.

* Support for class-based action creators has been removed.

<a name="8.1.1"></a>
## [8.1.1](https://github.com/cartant/ts-action/compare/v8.1.0...v8.1.1) (2019-04-04)

### Fixes

* Replace `ReturnType` with `ActionType` for TypeScript 3.4 compatibility. ([f20ed2e](https://github.com/cartant/ts-action/commit/f20ed2e))

<a name="8.1.0"></a>
## [8.1.0](https://github.com/cartant/ts-action/compare/v8.0.0...v8.1.0) (2019-04-04)

### Features

* Support using array literals to represent multiple action types. ([f0a98be](https://github.com/cartant/ts-action/commit/f0a98be))

### Changes

* Deprecate using object literals to represent multiple action types.

<a name="8.0.0"></a>
## [8.0.0](https://github.com/cartant/ts-action/compare/v7.0.0...v8.0.0) (2018-11-03)

### Breaking changes

* Action creators are now simple functions - instead of classes.
* Class-based actions creators are deprecated, but can still be used via the `"ts-action/classes"` import location.
* The action creator's static `action` property has been removed.
* TypeScript 3.0 is required.

<a name="7.0.0"></a>
## [7.0.0](https://github.com/cartant/ts-action/compare/v6.0.3...v7.0.0) (2018-09-29)

### Features

* Support passing multiple action creators to `on`. ([11e3e73](https://github.com/cartant/ts-action/commit/11e3e73))

### Breaking changes

To support passing multiple action creators to `on`, the return type was changed - which is technically a breaking change. However, if you are using `on` and `reducer` in the manner described in the README, this change will not affect you.

* Changed the return type of `on` to support multiple actions.
* Removed the `ActionCreator` interface.

<a name="6.0.3"></a>
## [6.0.3](https://github.com/cartant/ts-action/compare/v6.0.2...v6.0.3) (2018-07-09)

### Fixes

* **reducer**: Allow the `state` parameter in `Reducer` to be `undefined`. ([b8dab43](https://github.com/cartant/ts-action/commit/b8dab43))

<a name="6.0.2"></a>
## [6.0.2](https://github.com/cartant/ts-action/compare/v6.0.1...v6.0.2) (2018-02-26)

### Fixes

* **action**: Add [ponyfills](https://github.com/sindresorhus/ponyfill) for `getPrototypeOf` and `setPrototypeOf`. ([b004a4c](https://github.com/cartant/ts-action/commit/b004a4c))

<a name="6.0.1"></a>
## [6.0.1](https://github.com/cartant/ts-action/compare/v6.0.0...v6.0.1) (2018-02-04)

### Fixes

* **guard**: Like `isType`, the `guard` function now supports specifying multiple creators. ([9658da1](https://github.com/cartant/ts-action/commit/9658da1))

<a name="6.0.0"></a>
## [6.0.0](https://github.com/cartant/ts-action/compare/v5.0.0...v6.0.0) (2018-02-03)

### Breaking Changes

* **isType**: To support matching an arbitrary number of types, `isType` can now be passed either a single action creator or an object literal of action creators, so calls like `isType(action, Foo, Bar)` should be replaced with calls like `isType(action, { Foo, Bar })`. Calls that specify a single action creator - like `isType(action, Foo)` - do not need to be changed. ([0bbcf98](https://github.com/cartant/ts-action/commit/0bbcf98))

<a name="5.0.0"></a>
## [5.0.0](https://github.com/cartant/ts-action/compare/v4.0.0...v5.0.0) (2018-02-03)

### Breaking Changes

* **union**: The `union` function now takes an object literal of action creators, so calls like `union(Foo, Bar)` should be replaced with calls like `union({ Foo, Bar })`. ([9d453a5](https://github.com/cartant/ts-action/commit/9d453a5))

<a name="4.0.0"></a>
## [4.0.0](https://github.com/cartant/ts-action/compare/v3.3.0...v4.0.0) (2018-01-31)

### Breaking Changes

* **action**: Removed the overload in which the type could be passed in the `options`. ([742b17d](https://github.com/cartant/ts-action/commit/742b17d))
* The package is now distributed with CommonJS, ES5 and ES2015 files (see the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#heading=h.k0mh3o8u5hx)). The ES5 and ES2015 files use ES modules. The entry points in the `package.json` are:
    * `main` - CommonJS
    * `module` - ES5 with ES modules (in the `esm5` directory)
    * `es2015` - ES2015 (in the `esm2015` directory)

<a name="3.3.0"></a>
## [3.3.0](https://github.com/cartant/ts-action/compare/v3.2.3...v3.3.0) (2018-01-29)

### Features

* **isType**: Add support for passing multiple action creators. ([899603f](https://github.com/cartant/ts-action/commit/899603f))

<a name="3.2.3"></a>
## [3.2.3](https://github.com/cartant/ts-action/compare/v3.2.2...v3.2.3) (2018-01-27)

### Fixes

* Fix `types` filename in `package.json`.

<a name="3.2.2"></a>
## [3.2.2](https://github.com/cartant/ts-action/compare/v3.2.1...v3.2.2) (2017-11-18)

### Changes

* Minor documenation changes.

<a name="3.2.1"></a>
## [3.2.1](https://github.com/cartant/ts-action/compare/v3.2.0...v3.2.1) (2017-11-12)

### Bug Fixes

* **reducer**: Remove union with `undefined` from state. ([bd748f0](https://github.com/cartant/ts-action/commit/bd748f0))

<a name="3.2.0"></a>
## [3.2.0](https://github.com/cartant/ts-action/compare/v3.1.3...v3.2.0) (2017-11-12)

### Features

* **reducer**: Add a `reducer` method for creating reducer functions. ([d7e870e](https://github.com/cartant/ts-action/commit/d7e870e))

<a name="3.1.3"></a>
## [3.1.3](https://github.com/cartant/ts-action/compare/v3.1.2...v3.1.3) (2017-11-11)

### Changes

* **action**: Reset the `prototype` to that of `{}` rather than to `null`. ([3337e68](https://github.com/cartant/ts-action/commit/3337e68))

<a name="3.1.2"></a>
## [3.1.2](https://github.com/cartant/ts-action/compare/v3.1.1...v3.1.2) (2017-11-10)

### Changes

* **action**: The `options` are now optional and `empty` is the default. ([c91f3cd](https://github.com/cartant/ts-action/commit/c91f3cd))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/cartant/ts-action/compare/v3.1.0...v3.1.1) (2017-11-10)

### Documentation

* Improvemed API documentation.

<a name="3.1.0"></a>
## [3.1.0](https://github.com/cartant/ts-action/compare/v3.0.1...v3.1.0) (2017-11-10)

### Feature

* **action**: Add a more terse overload that takes the `type` and `options` as separate parameters. ([083403f](https://github.com/cartant/ts-action/commit/083403f))

<a name="3.0.1"></a>
## [3.0.1](https://github.com/cartant/ts-action/compare/v3.0.0...v3.0.1) (2017-11-10)

### Changes

* The distribution now includes `.d.ts` files rather than `.ts` files. ([b5ebbbf](https://github.com/cartant/ts-action/commit/b5ebbbf))

<a name="3.0.0"></a>
## [3.0.0](https://github.com/cartant/ts-action/compare/v2.0.3...v3.0.0) (2017-11-09)

### Breaking Changes

* **action**: Removed the static `action` property from action creators. Instead, there's a `union` method for creating discriminated unions from action creators. ([22067fb](https://github.com/cartant/ts-action/commit/22067fb))

<a name="2.0.3"></a>
## [2.0.3](https://github.com/cartant/ts-action/compare/v2.0.2...v2.0.3) (2017-11-09)

### Bug Fixes

* **action**: Enforce `base` parameter types. ([e3128d2](https://github.com/cartant/ts-action/commit/e3128d2))
* **action**: Enforce `props` parameter type. ([1571ee4](https://github.com/cartant/ts-action/commit/1571ee4))

<a name="2.0.2"></a>
## [2.0.2](https://github.com/cartant/ts-action/compare/v2.0.1...v2.0.2) (2017-11-09)

### Bug Fixes

* **action**: Set `prototype` to `null` for `reactjs/redux` compatibility. ([9925f79](https://github.com/cartant/ts-action/commit/9925f79))

<a name="2.0.1"></a>
## [2.0.1](https://github.com/cartant/ts-action/compare/v2.0.0...v2.0.1) (2017-11-07)

### Changes

* Remove `tslib`.

<a name="2.0.0"></a>
## [2.0.0](https://github.com/cartant/ts-action/compare/v1.0.3...v2.0.0) (2017-11-06)

### Features

* Add support for inline base classes using `base`.

### Breaking Changes

* Default payloads and props have been removed.
* `create` has been removed.
* `params` has been removed.
* `empty` must be called when for action creators with no payload or props.
* Most interfaces have been removed.