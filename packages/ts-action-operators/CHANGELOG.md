<a name="9.1.2"></a>
## [9.1.2](https://github.com/cartant/ts-action/compare/v9.1.1-ts-action-operators...v9.1.2-ts-action-operators) (2021-05-08)

### Changes

* Upgrade to RxJS version 7 and widen peer dependency range for `rxjs`. ([2aba46a](https://github.com/cartant/ts-action/commit/2aba46a))

<a name="9.1.1"></a>
## [9.1.1](https://github.com/cartant/ts-action/compare/v9.1.0-ts-action-operators...v9.1.1-ts-action-operators) (2019-10-26)

### Changes

* Widen peer dependency range for `ts-action`.

<a name="9.1.0"></a>
## [9.1.0](https://github.com/cartant/ts-action/compare/v9.0.1...v9.1.0-ts-action-operators) (2019-05-06)

### Features

* Add `act` convenience operator. ([b33eb9b](https://github.com/cartant/ts-action/commit/b33eb9b))

<a name="9.0.1"></a>
## [9.0.1](https://github.com/cartant/ts-action-operators/compare/v9.0.0...v9.0.1) (2019-04-19)

### Changes

* Support `ts-action` v10. ([c757e8d](https://github.com/cartant/ts-action-operators/commit/c757e8d))

<a name="9.0.0"></a>
## [9.0.0](https://github.com/cartant/ts-action-operators/compare/v8.1.0...v9.0.0) (2019-04-06)

### Breaking Changes

* Expressing multiple actions using array or object literals is no longer supported. Pass multiple actions as separate arguments instead.

    That is, instead of this:

        ofType({ foo, bar }); // or ofType([foo, bar]);

    Do this:

        ofType(foo, bar);

<a name="8.1.0"></a>
## [8.1.0](https://github.com/cartant/ts-action-operators/compare/v8.0.0...v8.1.0) (2019-04-04)

### Features

* Support using array literals to represent mulitple action types. ([f2264cc](https://github.com/cartant/ts-action-operators/commit/f2264cc))

### Changes

* Deprecate using object literals to represent multiple action types.

<a name="8.0.0"></a>
## [8.0.0](https://github.com/cartant/ts-action-operators/compare/v7.0.1...v8.0.0) (2018-11-03)

### Breaking Changes

* Upgrade to `ts-action` version 8.

<a name="7.0.1"></a>
## [7.0.1](https://github.com/cartant/ts-action-operators/compare/v7.0.0...v7.0.1) (2018-09-29)

### Changes

* Update dependencies to allow for multiple versions of `ts-action`. ([1f20efa](https://github.com/cartant/ts-action-operators/commit/1f20efa))

<a name="7.0.0"></a>
## [7.0.0](https://github.com/cartant/ts-action-operators/compare/v6.0.0...v7.0.0) (2018-04-25)

### Breaking Changes

* Upgrade to RxJS version 6.

<a name="6.0.0"></a>
## [6.0.0](https://github.com/cartant/ts-action-operators/compare/v5.0.1...v6.0.0) (2018-02-03)

### Breaking Changes

* **ofType**: To support matching an arbitrary number of types, `ofType` can now be passed either a single action creator or an object literal of action creators, so calls like `ofType(action, Foo, Bar)` should be replaced with calls like `ofType(action, { Foo, Bar })`. Calls that specify a single action creator - like `ofType(action, Foo)` - do not need to be changed. ([f4b3d7b](https://github.com/cartant/ts-action/commit/f4b3d7b))

<a name="5.0.1"></a>
## [5.0.1](https://github.com/cartant/ts-action-operators/compare/v5.0.0...v5.0.1) (2018-02-03)

### Changes

* Allow a version 5.0.0 `ts-action` peer.

<a name="5.0.0"></a>
## [5.0.0](https://github.com/cartant/ts-action-operators/compare/v4.0.0...v5.0.0) (2018-02-02)

### Breaking Changes

* Removed the prototype-patching operators; use `pipe` or `let` instead. Patching `Observable.prototype` with `ofType` is pointless, as `ofType` will be on the prototype of the framework's actions observable.

<a name="4.0.1"></a>
## [4.0.1](https://github.com/cartant/ts-action-operators/compare/v4.0.0...v4.0.1) (2018-01-31)

### Fixes

* Use the correct semver for the `ts-action` peer dependency.

<a name="4.0.0"></a>
## [4.0.0](https://github.com/cartant/ts-action-operators/compare/v3.2.0...v4.0.0) (2018-01-31)

### Breaking Changes

* Use `ts-action` 4.0.0.
* The package is now distributed with CommonJS, ES5 and ES2015 files (see the [Angular Package Format](https://docs.google.com/document/d/1CZC2rcpxffTDfRDs6p1cfbmKNLA6x5O-NtkJglDaBVs/edit#heading=h.k0mh3o8u5hx)). The ES5 and ES2015 files use ES modules. The entry points in the `package.json` are:
    * `main` - CommonJS
    * `module` - ES5 with ES modules (in the `esm5` directory)
    * `es2015` - ES2015 (in the `esm2015` directory)

<a name="3.2.0"></a>
## [3.2.0](https://github.com/cartant/ts-action-operators/compare/v3.1.1...v3.2.0) (2018-01-29)

### Features

* **ofType**: Support narrowing when passing multiple action creators. ([e862519](https://github.com/cartant/ts-action/commit/e862519))

<a name="3.1.1"></a>
## [3.1.1](https://github.com/cartant/ts-action-operators/compare/v3.1.0...v3.1.1) (2018-01-27)

### Fixes

* Fix `types` filename in `package.json`.

<a name="3.1.0"></a>
## [3.1.0](https://github.com/cartant/ts-action-operators/compare/v3.0.1...v3.1.0) (2017-11-10)

### Changes

* Use `ts-action` 3.1.0.

<a name="3.0.1"></a>
## [3.0.1](https://github.com/cartant/ts-action-operators/compare/v3.0.0...v3.0.1) (2017-11-10)

### Changes

* The distribution now includes `.d.ts` files rather than `.ts` files. ([b9ca7ac](https://github.com/cartant/ts-action-operators/commit/b9ca7ac))

<a name="3.0.0"></a>
## [3.0.0](https://github.com/cartant/ts-action-operators/compare/v2.0.2...v3.0.0) (2017-11-09)

### Fixes

**ofType**: Enforce the passing of at least one action creator. ([d9753aa](https://github.com/cartant/ts-action-operators/commit/d9753aa))

### Breaking Changes

* Use `ts-action` 3.0.0.

<a name="2.0.2"></a>
## [2.0.2](https://github.com/cartant/ts-action-operators/compare/v2.0.1...v2.0.2) (2017-11-07)

### Changes

* Remove `tslib`.

<a name="2.0.1"></a>
## [2.0.1](https://github.com/cartant/ts-action-operators/compare/v2.0.0...v2.0.1) (2017-11-07)

### Fixes

* Remove redundant type parameters from `ofType` signatures. ([a5a8a6e](https://github.com/cartant/ts-action-operators/commit/a5a8a6e))

<a name="2.0.0"></a>
## [2.0.0](https://github.com/cartant/ts-action-operators/compare/v1.0.3...v2.0.0) (2017-11-06)

### Breaking Changes

* Use `ts-action` 2.0.0.