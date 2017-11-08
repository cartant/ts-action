<a name="2.0.2"></a>
## [2.0.2](https://github.com/cartant/ts-action/compare/v2.0.1...v2.0.2) (2017-11-09)

### Bug Fixes

* **action**: Set `prototype` to `null` for React compatibility. ([9925f79](https://github.com/cartant/ts-action/commit/9925f79))

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