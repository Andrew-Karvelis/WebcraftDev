/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your other Next.js config options here
  transpilePackages: ['lucide-react'], // Add this line for dynamic imports

  webpack: (config) => {
    const webpack = require('webpack'); // Import webpack here

    // Custom Webpack configurations
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

module.exports = nextConfig;
