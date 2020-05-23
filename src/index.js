import {RNCSitumPlugin} from './nativeInterface';

const SitumPlugin = {
  initSitumSDK: function () {
    RNCSitumPlugin.initSitumSDK();
  },

  setApiKey: function (email: string, apiKey: string, callback: any) {
    return RNCSitumPlugin.setApiKey(email, apiKey, callback);
  },

  setUserPass: function (email: string, password: string, callback: any) {
    return RNCSitumPlugin.setUserPass(email, password, callback);
  },

  setCacheMaxAge: function (cacheAge: number, callback: any) {
    return RNCSitumPlugin.setCacheMaxAge(cacheAge, callback);
  },
};

module.exports = SitumPlugin;
