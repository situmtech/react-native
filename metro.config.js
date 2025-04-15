/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  
  return {
    ...config,
    resolver: {
      ...config.resolver,
      resolverMainFields: ['react-native', 'module', 'main'],
    },
    watchFolders: [
      ...config.watchFolders || [],
      __dirname,
    ],
  };
})();
