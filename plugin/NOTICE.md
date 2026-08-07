# Notices for @situm/react-native

Copyright (c) 2020 - 2026 Situm Technologies

The plugin source code is licensed under the MIT License. The complete license
text is provided in the accompanying LICENSE file in the published package.

## Declared native dependencies

| Component                                            | Platform | Version    | License or terms                      |
| ---------------------------------------------------- | -------- | ---------- | ------------------------------------- |
| SitumSDK                                             | iOS      | 3.40.0     | Applicable Situm terms and conditions |
| SitumSDK                                             | Android  | 3.38.0@aar | Applicable Situm terms and conditions |
| React Native (`com.facebook.react:react-native`)     | Android  | matches installed peer | MIT                     |
| JTS Topology Suite (`org.locationtech.jts:jts-core`) | Android  | 1.16.1     | EDL-1.0                               |

SitumSDK is a separate product of Situm Technologies. The MIT License for this
plugin does not grant rights to SitumSDK beyond its applicable terms and
conditions. SitumSDK for Android is resolved transitively; components it may
pull in are governed by their own respective terms.

### JTS Topology Suite

JTS 1.16.1 is dual-licensed under the Eclipse Public License 1.0 (EPL-1.0) and
the Eclipse Distribution License 1.0 (EDL-1.0). This distribution uses the
EDL-1.0 option.

Source files in JTS 1.16.1 carry the following notice:

    Copyright (c) 2016 Vivid Solutions.

    All rights reserved. This program and the accompanying materials
    are made available under the terms of the Eclipse Public License v1.0
    and Eclipse Distribution License v. 1.0 which accompanies this distribution.
    The Eclipse Public License is available at
    http://www.eclipse.org/legal/epl-v10.html
    and the Eclipse Distribution License is available at
    http://www.eclipse.org/org/documents/edl-v10.php.

JTS also includes content sourced from the GeoTools project, licensed to JTS
under the OSGeo BSD License by the GeoTools PSC. See:
https://github.com/locationtech/jts/blob/jts-1.16.1/LICENSES.md

#### Eclipse Distribution License - v 1.0

Copyright (c) 2007, Eclipse Foundation, Inc. and its licensors.

All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

- Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.
- Neither the name of the Eclipse Foundation, Inc. nor the names of its
  contributors may be used to endorse or promote products derived from this
  software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.

## Peer dependencies

The following peer dependencies are installed and version-selected by the
consuming application. They are not bundled in the published npm package.

| Component            | Version range | License |
| -------------------- | ------------- | ------- |
| React                | >=17.0.0      | MIT     |
| React Native         | *             | MIT     |
| react-native-webview | >=11.0.0      | MIT     |

React is Copyright (c) Meta Platforms, Inc. and affiliates.
React Native is Copyright (c) Meta Platforms, Inc. and affiliates.
react-native-webview is Copyright (c) 2015-present, Facebook, Inc.
(verify against the LICENSE file of the version you resolve).

## Source manifests

Dependency declarations are maintained in `package.json`,
`ReactNativeSitumPlugin.podspec`, and `android/build.gradle`.

Development-only dependencies used to build, test, lint, or release this
package are not part of the published runtime artifact.
