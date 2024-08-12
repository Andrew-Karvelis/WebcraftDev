const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack(config) {
    config.resolve.fallback = {
      stream: require.resolve('stream-browserify'),
      // Add other Node.js core modules as needed
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );

    return config;
  },
};
