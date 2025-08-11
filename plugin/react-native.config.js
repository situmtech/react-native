module.exports = {
  dependencies: {
    '@situm/react-native': {
      platforms: {
        android: {
          packageInstance: 'new WebViewReactPackage()',
        },
      },
    },
  },
};