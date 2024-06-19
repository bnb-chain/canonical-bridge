/** @type {import('next').NextConfig} */
const getPublicEnv = (prefix) => {
  const envs = process.env;
  const res = {};

  Object.keys(envs).forEach((key) => {
    if (key.startsWith(prefix)) {
      res[key] = envs[key];
    }
  });

  return res;
};

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    ...getPublicEnv('NEXT_PUBLIC_'),
  },
};

export default nextConfig;
