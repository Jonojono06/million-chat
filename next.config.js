// /** @type {import('next').NextConfig} */
// const nextConfig = {
//     webpack: (config) => {
//         config.externals.push ({
//             "utf-8-validate": "commonjs utf-8-validate",
//             bufferutil: "commonjs bufferutil"
//         });

//         return config;
//     },
//     images: {
//         domains: [
//             "utfs.io"
//         ]
//     }
// }

// module.exports = nextConfig


// const withPWA = require ('next-pwa');

// const nextConfig = {
//   webpack: config => {
//     config.externals.push ({
//       'utf-8-validate': 'commonjs utf-8-validate',
//       bufferutil: 'commonjs bufferutil',
//     });

//     return config;
//   },
//   images: {
//     domains: ['utfs.io'],
//   },
// };

// module.exports = withPWA (nextConfig, ({
//      ...withPWA ({
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//   }),
// }));

// const withPWA = require ('next-pwa');

// const nextConfig = {
//   pwa: {
//     dest: 'public',
//     register: true,
//     skipWaiting: true,
//   },
//   webpack: config => {
//     // Consider commenting out this part if it's not necessary
//     config.externals.push ({
//       'utf-8-validate': 'commonjs utf-8-validate',
//       bufferutil: 'commonjs bufferutil',
//     });

//     return config;
//   },
//   images: {
//     domains: ['utfs.io'],
//   },
// };

// module.exports = withPWA (nextConfig);

// const withPWA = require ('next-pwa') ({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
// });

// module.exports = withPWA (
//   {
//     webpack: config => {
//     // Consider commenting out this part if it's not necessary
//     config.externals.push ({
//       'utf-8-validate': 'commonjs utf-8-validate',
//       bufferutil: 'commonjs bufferutil',
//     });

//     return config;
//   },
//   images: {
//     domains: ['utfs.io'],
//   },
//   }
// );



const withPWA = require ('next-pwa') ({
  dest: 'public',
  register: true,
  skipWaiting: true,
  sw: "/sw.js",
//   disable: process.env.NODE_ENV === 'development',
});
const withBundleAnalyzer = require ('@next/bundle-analyzer') ({
  enabled: process.env.ANALYZE === 'true',
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

module.exports = withBundleAnalyzer (withPWA (nextConfig));




