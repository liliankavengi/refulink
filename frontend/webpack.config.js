const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Allow extension-less imports for ESM packages that target react-native-web.
  // This fixes fully-specified import resolution errors like:
  //   react-native-web/dist/exports/StyleSheet
  if (!config.resolve) {
    config.resolve = {};
  }
  config.resolve.fullySpecified = false;

  return config;
};
