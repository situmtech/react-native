import {NativeEventEmitter, NativeModules} from 'react-native';

const {RNCSitumPlugin} = NativeModules;

if (!RNCSitumPlugin) {
  throw new Error('react-native-situm-plugin: NativeModule is null');
}

let nativeEventEmitter = null;
module.exports = {
  RNCSitumPlugin,
  get SitumPluginEventEmitter() {
    if (!nativeEventEmitter) {
      nativeEventEmitter = new NativeEventEmitter(RNCSitumPlugin);
    }
    return nativeEventEmitter;
  },
};
