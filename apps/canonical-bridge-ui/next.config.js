/** @type {import('next').NextConfig} */

const getEnv = (type = 'public') => {
  const regexp = type === 'public' ? /^NEXT_PUBLIC_/ : /^(?!NEXT_PUBLIC_)/;

  const res = {};
  Object.keys(process.env).forEach((key) => {
    if (regexp.test(key)) {
      res[key] = process.env[key];
    }
  });

  return res;
};

module.exports = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  output: 'export',
  distDir: 'dist',
  basePath: '/canonical-bridge',
  images: {
    unoptimized: true,
  },
  publicRuntimeConfig: {
    ...getEnv('public'),
  },
  serverRuntimeConfig: {
    ...getEnv('server'),
  },
};
