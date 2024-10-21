/** @type {import('next').NextConfig} */

module.exports = {
  assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
};
