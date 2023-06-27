<p align="center"> <img width="233" src="https://situm.com/wp-content/themes/situm/img/logo-situm.svg" style="margin-bottom:1rem" /> <h1 align="center">Upgrading @situm/react-native-wayfinding</h1> </p>

## Introduction <a name="introduction"></a>

In this file we share a way to upgrade previous versions of situm wayfinding plugin to newer versions.

---

## 0.3.X to 0.4.0 <a name="0.3.X-to-0.4.0"></a>

- Update this plugin to 1.0.0 version on your package.json and install via npm or yarn.

  ```yarn add @situm/react-native-wayfinding@^0.4.0```
- Install our plugin peer dependencies, as React Native does not do it for you.

  ```yarn add react-native-permissions react-native-situm-plugin react-native-webview```
- As we have moved from Google Maps to Mapbox, remove the Google Maps API Key from “android/src/main/AndroidManifest.xml” file:

  ```
    <meta-data
        android:name="com.google.android.geo.API_KEY"
        android:value="GOOGLE_MAPS_APIKEY" />
  ```
- Wrap your application with our new component `<SitumProvider>`, this component handles our SDK status and provides it to usage inside your application
- Go to your usage of our component `<Mapview/>` and :

  * Remove the `user` and `apikey` props.
  * Pass the mapboxApiKey props, otherwise only your floor plan will be shown without underlying map.
  * TODO: If you use Android 14 please specify in your `android/app/src/main/AndroidManifest.xml` the next permission

    ```
    <uses-permission android:name="android.permission.USE_EXACT_ALARM"/>
    ```

### Code example

```js
// your imports

const SITUM_EMAIL = 'YOUR_EMAIL_HERE';
const SITUM_API_KEY = 'YOUR_APIKEY_HERE';
const SITUM_BUILDING_ID = 'YOUR_BUILDING_ID_HERE';

const App: React.FC = () => {
  return (
    <View>
      <SitumProvider email={SITUM_EMAIL} apiKey={SITUM_API_KEY}>
        <MapView
          user={SITUM_EMAIL}
          apikey={SITUM_API_KEY}
          buildingId={SITUM_BUILDING_ID}
          // other props
        />
      </SitumProvider>
    </View>
  );
};
```
