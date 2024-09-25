/** @type {import('next').NextConfig} */

const STATIC_HOST = process.env.NEXT_PUBLIC_STATIC_HOST || '';

const getEnv = (type = 'public') => {
  const regexp = type === 'public' ? /^NEXT_PUBLIC_/ : /^(?!NEXT_PUBLIC_)/;
  const envs = process.env;

  const res = {};
  Object.keys(envs).forEach((key) => {
    if (regexp.test(key)) {
      res[key] = envs[key];
    }
  });
  return res;
};

module.exports = {
  assetPrefix: STATIC_HOST,
  publicRuntimeConfig: {
    ...getEnv('public'),
  },
  serverRuntimeConfig: {
    ...getEnv('server'),
  },
  experimental: {
    esmExternals: 'loose',
  },
};
