const path = require('path');
const fs = require('fs');
// Important: using escape-string-regexp@4.0.0, last with support for require.
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('@react-native/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

const root = path.resolve(__dirname, '..');
const pluginRoot = path.resolve(root, 'plugin');

const defaultConfig = getDefaultConfig(__dirname);

// Obtain plugin dependencies
const pluginPackageJson = JSON.parse(
  fs.readFileSync(path.join(pluginRoot, 'package.json'), 'utf8')
);

// List of excluded modules (peerDependencies)
const modules = []
  .concat(
    pluginPackageJson.peerDependencies
      ? Object.keys(pluginPackageJson.peerDependencies)
      : []
  )
  .sort()
  .filter((m, i, self) => self.lastIndexOf(m) === i);

/** @type {import('metro-config').MetroConfig} */
module.exports = {
  ...defaultConfig,

  projectRoot: __dirname,

  // Observe both root and plugin folders
  watchFolders: [root, pluginRoot],

  resolver: {
    ...defaultConfig.resolver,

    // Exclude plugin peerDependencies
    blacklistRE: exclusionList(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(pluginRoot, 'node_modules', m))}\\/.*$`)
      )
    ),

    // Redirect dependencies to example node_modules
    extraNodeModules: modules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);
      return acc;
    }, {
      // Aliasing for our plugin
      [pluginPackageJson.name]: pluginRoot,
    }),

    resolveRequest: (context, realModuleName, platform) => {
      if (
        platform === 'web' &&
        (realModuleName === 'react-native-gesture-handler' ||
          realModuleName === 'react-native-reanimated')
      ) {
        throw new Error(
          `The module '${realModuleName}' should not be imported on Web.`
        );
      }
      return context.resolveRequest(context, realModuleName, platform);
    },
  },

  transformer: {
    ...defaultConfig.transformer,
  },

  server: {
    ...defaultConfig.server,
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        // Adjust path for assets
        if (/\/plugin\/.+\.(png|jpg|jpeg|gif|bmp|webp|svg)\?.+$/.test(req.url)) {
          req.url = `/assets/../${req.url}`;
        }
        return middleware(req, res, next);
      };
    },
  },
};