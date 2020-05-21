import {NativeModules} from 'react-native';
import {SitumNativeModule} from './privateTypes';

const SitumPluginManager: SitumNativeModule | undefined =
  NativeModules.SitumPlugin;

if (!SitumPluginManager) {
  throw new Error('react-native-situm-plugin: NativeModule is null');
}

export default SitumPluginManager as SitumNativeModule;
