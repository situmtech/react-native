const path = require('path');
const fs = require('fs');

const pluginRoot = path.resolve(__dirname, '..', 'plugin');

/** @type {import('@babel/core').TransformOptions} */
module.exports = function (api) {
  api.cache(true);

  // Get information from the package.json at plugin level
  const pluginPackage = require(path.join(pluginRoot, 'package.json'));
  
  // Setup alias only for plugin
  const alias = {};
  if (pluginPackage.source) {
    alias[pluginPackage.name] = path.resolve(pluginRoot, pluginPackage.source);
  }

  return {
    presets: ['@react-native/babel-preset'],
    plugins: [
      '@babel/plugin-transform-strict-mode',
      [
        'module-resolver',
        {
          extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
          alias,
        },
      ],
    ],
    env: {
      production: {
        plugins: ['transform-remove-console'],
      },
    },
  };
};