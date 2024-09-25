import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      include: 'src',
    }),
  ],
  resolve: {
    alias: {
      '@/dev': path.resolve(__dirname, '__dev__'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      formats: ['es'],
      entry: {
        index: 'src/index.tsx',
      },
    },
    rollupOptions: {
      plugins: [peerDepsExternal()],
    },
  },
});
