/* eslint-disable no-undef */

import {NativeModules} from 'react-native';
import SitumPlugin from '..';

describe('react-native-situm-plugin', () => {
  it('should set the location observer configuration', () => {
    SitumPlugin.initSitumSDK();
    expect(NativeModules.RNCSitumPlugin.initSitumSDK.mock.calls.length).toEqual(
      1,
    );
  });
});
