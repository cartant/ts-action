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