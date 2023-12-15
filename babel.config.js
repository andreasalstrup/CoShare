module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo'], ["@babel/preset-typescript"]],
    plugins: [
      // Required for expo-router
      ['expo-router/babel'],
      ['@babel/plugin-transform-private-methods', { 'loose': true }],
    ],
  };
};
