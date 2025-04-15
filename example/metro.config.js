const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

module.exports = (async () => {
  const config = await getDefaultConfig(projectRoot);

  return {
    ...config,
    resolver: {
      ...config.resolver,
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(workspaceRoot, 'node_modules'),
      ],
      resolverMainFields: ['react-native', 'module', 'main'],
    },
    watchFolders: [
      ...config.watchFolders || [],
      workspaceRoot,
    ],
  };
})();