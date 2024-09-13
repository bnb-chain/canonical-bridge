import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
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
    minify: false,
    lib: {
      formats: ['es'],
      entry: {
        'src/index': 'src/index.ts',
      },
    },
    rollupOptions: {
      plugins: [
        peerDepsExternal({
          includeDependencies: true,
        }),
      ],
    },
  },
});
