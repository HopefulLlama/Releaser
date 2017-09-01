# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### Fixed
- Execution now properly waits for completion before continuing.

## [0.0.5] 2017-08-31
### Changed
- Configuration now takes `preRelease` and `release` properties; Both of which require an array of functions.

## [0.0.4] - 2017-08-14
### Changed
- Now using `done()` to finish an execution block, to support async llama-rlsr modules

## [0.0.3] - 2017-08-05
### Added
- Updating metadata file after execution

### Fixed
- Corrected configuration path resolution

## [0.0.2] - 2017-08-04
### Changed
- Renamed module to llama-rlsr because someone else got rlsr first

## [0.0.1] - 2017-08-04
### Added
- Added basic skeleton for calling rlsr modules

[Unreleased]: https://github.com/HopefulLlama/llama-rlsr/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/HopefulLlama/llama-rlsr/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/HopefulLlama/llama-rlsr/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/HopefulLlama/llama-rlsr/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/HopefulLlama/llama-rlsr/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/HopefulLlama/llama-rlsr/compare/06a80b339d2803211d62b6fc9dfd6e5f8fd952ea...v0.0.1