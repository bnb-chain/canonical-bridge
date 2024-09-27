/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require('@sentry/nextjs');

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

const nextConfig = {
  assetPrefix: STATIC_HOST,
  publicRuntimeConfig: {
    ...getEnv('public'),
  },
  serverRuntimeConfig: {
    ...getEnv('server'),
  },
  sentry: {
    ignoreUrls: [/localhost/, /127\.0\.0\.1/],
  },
};

module.exports = withSentryConfig(nextConfig, { silent: true }, { hideSourcemaps: false });
