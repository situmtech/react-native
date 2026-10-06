## Changelog

## Changed

- [`setApiKey`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setapikey), [`setToken`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#settoken), [`setUserPass`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setuserpass), [`setConfiguration`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setconfiguration), [`removeLocationUpdates`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#removelocationupdates), [`updateNavigationWithLocation`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#updatenavigationwithlocation), [`configureUserHelper`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#configureuserhelper), [`enableUserHelper`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#enableuserhelper) and [`disableUserHelper`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#disableuserhelper) now return a `Promise` that resolves when the operation completes and rejects if it fails. Existing calls keep working, but to be notified of failures you need to `await` the call inside `try/catch` or add a `.catch()` handler.

## Fixed

- Fixed [`setApiKey`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setapikey), [`setToken`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#settoken), [`setUserPass`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setuserpass), [`setConfiguration`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setconfiguration), [`removeLocationUpdates`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#removelocationupdates) and [`configureUserHelper`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#configureuserhelper) throwing errors that integrating apps could not catch when the operation failed. These failures are now reported by rejecting the returned `Promise`.
- Fixed [`setApiKey`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setapikey) and [`setUserPass`](https://developers.situm.com/sdk_documentation/react-native/typedoc/classes/default.html#setuserpass) reporting success on iOS when the SDK rejected the provided credentials.

## Removed

- Removed the SNR/Open Sky configuration. This obsolete configuration was removed in version 3.39.0 of the Android SDK.
