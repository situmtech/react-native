# Notices for @situm/react-native

Copyright (c) 2023 Situm Technologies

The plugin source code is licensed under the MIT License. The complete license
text is provided in the accompanying LICENSE file in the published package.

## Declared native dependencies

| Component | Platform | Version | License or terms |
| --- | --- | --- | --- |
| SitumSDK | iOS | 3.40.0 | Applicable Situm terms and conditions |
| SitumSDK | Android | 3.38.0@aar | Applicable Situm terms and conditions |
| JTS Topology Suite (`org.locationtech.jts:jts-core`) | Android | 1.16.1 | EDL-1.0 |

SitumSDK is a separate product of Situm Technologies. The MIT License for this
plugin does not grant rights to SitumSDK beyond its applicable terms and
conditions.

### JTS Topology Suite

Copyright (c) LocationTech JTS contributors

JTS 1.16.1 is dual-licensed under the Eclipse Public License 1.0 (EPL-1.0)
and the Eclipse Distribution License 1.0 (EDL-1.0). This distribution uses the
EDL-1.0 option.

JTS includes content sourced from the GeoTools project. That content was
licensed to JTS under the OSGeo BSD License. The applicable JTS license and
third-party notice are available at:

https://github.com/locationtech/jts/blob/jts-1.16.1/LICENSES.md

## Peer dependencies

The following peer dependencies are installed and version-selected by the
consuming application. They are not bundled in the published npm package.

| Component | Version range | License |
| --- | --- | --- |
| React | >=17.0.0 | MIT |
| React Native | Any version | MIT |
| react-native-webview | >=11.0.0 | MIT |

React is Copyright (c) Meta Platforms, Inc. and affiliates.
React Native is Copyright (c) Meta Platforms, Inc. and affiliates.
react-native-webview is Copyright (c) 2015-present Facebook, Inc.

## Source manifests

Dependency declarations are maintained in `package.json`,
`ReactNativeSitumPlugin.podspec`, and `android/build.gradle`.

Development-only dependencies used to build, test, lint, or release this
package are not part of the published runtime artifact.
