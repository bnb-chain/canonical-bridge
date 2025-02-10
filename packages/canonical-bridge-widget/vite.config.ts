import path from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_VERSION__: new Date().getTime(),
  },
  plugins: [
    react(),
    cssInjectedByJsPlugin({
      injectCode: (cssCode: string) => {
        return `try{if(typeof document != 'undefined'){var elementStyle = document.createElement('style');elementStyle.appendChild(document.createTextNode(${cssCode}));document.head.insertBefore(elementStyle,document.head.firstChild);}}catch(e){console.error('vite-plugin-css-injected-by-js', e);}`;
      },
    }),
    dts({
      include: 'src',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    target: 'esnext',
    lib: {
      formats: ['es', 'cjs'],
      entry: {
        index: 'src/index.tsx',
      },
    },

    rollupOptions: {
      plugins: [peerDepsExternal()],
    },
  },
});
