const withPWA = require ('next-pwa') ({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});
/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: config => {
    config.externals.push ({
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
    });

    return config;
  },
  images: {
    domains: ['utfs.io'],
  },
};

module.exports = withPWA (nextConfig);



