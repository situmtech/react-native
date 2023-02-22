# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

#### Version 0.0.15 – February 16, 2023

- Added a embedded sample app inside [`example/`](./example/README.md)
- Updated Android SDK to [2.83.9](https://situm.com/docs/01-android-sdk-changelog/)
- Updated iOS SDK to [2.57.0](https://situm.com/docs/ios-sdk-changelog/)

#### Version 0.0.14 – January 04, 2023 

*   Updated Android SDK to [2.83.4](https://situm.com/docs/01-android-sdk-changelog/)
*   Added new callbacks ([onEnterGeofences](https://github.com/situmtech/situm-react-native-plugin#--onentergeofences) and [onExitGeofences](https://github.com/situmtech/situm-react-native-plugin#--onexitgeofences)) to get notified when the user enters or leaves geofences:
    *   Only available in Android, will be availble also in iOS soon.

#### Version 0.0.13 – April 19, 2022 

*   Updated iOS SDK to [2.52.1](https://situm.com/docs/ios-sdk-changelog/)
*   Updated Android SDK to [2.73.0](https://situm.com/docs/01-android-sdk-changelog/)
*   Added support for some new features present in out native SDKs:
    *   [setUseRemoteConfig](https://situm.com/docs/07-remote-configuration/) – When set to true the location engine will use a remote configuration stored on the dashboard so you can easily change and adapt it to your app’s needs

#### Version 0.0.12 – July 1, 2021 

*   Updated iOS SDK to [2.50.11](https://situm.com/docs/ios-sdk-changelog/)
*   Updated Android SDK to [2.68.6](https://situm.com/docs/01-android-sdk-changelog/)
*   Added support for some new features present in our native SDKs:
    *   [useLocationCache](https://situm.com/docs/04-positioning/#23-toc-title) – Caches location for 30s after stopping positioning.
    *   [useGeofencesInBuildingSelector](https://situm.com/docs/04-positioning/#5-toc-title) – Use geofences for building detection. GPS + WIFI/BLE based building detector.
    *   [enableOutdoorPositions](https://situm.com/docs/04-positioning/#8-toc-title) – new in iOS. Enable/disable the use of outdoor positions in global mode.
    *   [minimumOutdoorLocationAccuracy](https://situm.com/docs/04-positioning/#10-toc-title) – new in Android. Set the minimum accuracy for outdoor positions. Positions with lower accuray will be discarded.
    *   Android only
        *   [ignoreWifiThrottling](https://situm.com/docs/04-positioning/#13-toc-title) – Ignore wifi throttling limitations in Android 10 and above.
        *   [scansBasedDetectorAlwaysOn](https://situm.com/docs/04-positioning/#5-toc-title) – Keep scans based building detetor active aftyer buliding detection.
        *   [enableOpenSkyDetector](https://situm.com/docs/04-positioning/#11-toc-title) – Enable/disable the open sky detector. Not recommended.
*   Fixed bug in the following iOS options. The boolean values were not being correctly parsed so they were automatically always set to true. This is now fixed and the value will be set correctly.
    *   [useGps](https://situm.com/docs/04-positioning/#15-toc-title) – Use GPS signlas for indoor positioning.
    *   useBarometer – Use the barometer for indoor positioning.
    *   [useDeadReckoning](https://situm.com/docs/04-positioning/#18-toc-title) – Faster orientation changes.
    *   [useGlobalLocation](https://situm.com/docs/04-positioning/#3-toc-title)

#### Version 0.0.11 – March 23, 2021 

*   Solved bug in iOS useBarotemter configuration option
*   Solved bug in iOS realtimeUpdateInterval configuration options

#### Version 0.0.10 – January 13, 2021 

*   Additional outdoor configuration options
*   Updated iOS SDK to version 2.50.4
*   Updated Android SDK to version 2.67.1

#### Version 0.0.9 – November 25, 2020 

*   Additional configuration methods (enable outdoor positions and battery saver)
*   Updated iOS SDK to version 2.48.0
*   Updated Android SDK to version 2.64.1

#### Version 0.0.6 – July 15, 2020 

*   Include real time support
*   Updated iOS SDK to version 2.45.2
*   Updated Android SDK to version 2.60.0

#### Version 0.0.5 – July 06, 2020 

*   Additional fetching methods to communicate with REST API (poi categories)

#### Version 0.0.4 – July 02, 2020 

*   Fix global location

#### Version 0.0.3 – June 23, 2020 

*   Navigation API
*   Additional configuration methods (credentials, sdkVersion)

#### Version 0.0.2 – June 05, 2020 

*   Basic fetching methods to communicate with REST API (buildings, building info)
*   Location API
*   Direction API

#### Version 0.0.1 – May 28, 2020 

*   Public interfaces