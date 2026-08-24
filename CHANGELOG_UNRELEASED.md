## Changelog

### Added

- Added a `NOTICE` file documenting the plugin's declared native, peer, and
  transitive dependencies, including applicable third-party notices.
- Included `NOTICE` in the published npm package and preserved it in the iOS
  podspec.
- Included the root `LICENSE` file in the package published to npm.

### Removed

- Removed the unused `react-dom` peer dependency from the plugin and the
  unused `react-dom` development dependency from the example application.
- Removed unused Babel, TypeScript, test, lint, commit, and release tooling
  dependencies from the plugin and example application.
- Removed the unused `release-it` configuration and dependency from the
  plugin.
- Removed obsolete commented test imports that referenced
  `jest-mock-extended`.

### Updated

- Updated the React Native CLI and transitive tooling dependencies to resolve
  known vulnerabilities.
