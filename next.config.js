const { config } = require('dotenv');

const path = require('path');


//const withWorkers = require('@zeit/next-workers');



module.exports = {
  reactStrictMode: true,
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {
    // Important: return the modified config
    if (!isServer) {
      config.module.rules.push({
        test: /\.worker\.js$/,
        loader: 'worker-loader',
        options: {
          name: 'static/[hash].worker.js',
        },
      });
    }
    return config
  },
  experimental: {
    forceSwcTransforms: true,
  },
  // future: {

  //   // by default, if you customize webpack config, they switch back to version 4.
  //   // Looks like backward compatibility approach.
  //   webpack5: true,   
  // },

  webpack(config) {
    config.module.rules.push({
      test: /\.worker\.js$/,
      use: { loader: 'worker-loader' },
    });
    config.resolve.fallback = {

      // if you miss it, all the other options in fallback, specified
      // by next.js will be dropped.
      ...config.resolve.fallback,  

      fs: false, // the solution
    };
    
    return config;
  },
}