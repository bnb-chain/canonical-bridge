// vite.config.ts
import { defineConfig } from "file:///Users/liwen/Documents/bnb-chain/canonical-bridge/common/temp/node_modules/.pnpm/vite@4.5.5_@types+node@22.7.5_terser@5.36.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/liwen/Documents/bnb-chain/canonical-bridge/common/temp/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@4.5.5_@types+node@22.7.5_terser@5.36.0_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import dts from "file:///Users/liwen/Documents/bnb-chain/canonical-bridge/common/temp/node_modules/.pnpm/vite-plugin-dts@3.9.1_@types+node@22.7.5_rollup@3.29.5_typescript@5.5.4_vite@4.5.5_@types+node@22.7.5_terser@5.36.0_/node_modules/vite-plugin-dts/dist/index.mjs";
import peerDepsExternal from "file:///Users/liwen/Documents/bnb-chain/canonical-bridge/common/temp/node_modules/.pnpm/rollup-plugin-peer-deps-external@2.2.4_rollup@3.29.5/node_modules/rollup-plugin-peer-deps-external/dist/rollup-plugin-peer-deps-external.js";
import path from "path";
var __vite_injected_original_dirname = "/Users/liwen/Documents/bnb-chain/canonical-bridge/packages/canonical-bridge-sdk";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    dts({
      include: "src"
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  build: {
    target: "esnext",
    minify: false,
    lib: {
      formats: ["es"],
      entry: {
        index: "src/index.ts"
      }
    },
    rollupOptions: {
      plugins: [
        peerDepsExternal({
          includeDependencies: true
        })
      ],
      output: {
        chunkFileNames: "common.js"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbGl3ZW4vRG9jdW1lbnRzL2JuYi1jaGFpbi9jYW5vbmljYWwtYnJpZGdlL3BhY2thZ2VzL2Nhbm9uaWNhbC1icmlkZ2Utc2RrXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbGl3ZW4vRG9jdW1lbnRzL2JuYi1jaGFpbi9jYW5vbmljYWwtYnJpZGdlL3BhY2thZ2VzL2Nhbm9uaWNhbC1icmlkZ2Utc2RrL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9saXdlbi9Eb2N1bWVudHMvYm5iLWNoYWluL2Nhbm9uaWNhbC1icmlkZ2UvcGFja2FnZXMvY2Fub25pY2FsLWJyaWRnZS1zZGsvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5pbXBvcnQgcGVlckRlcHNFeHRlcm5hbCBmcm9tICdyb2xsdXAtcGx1Z2luLXBlZXItZGVwcy1leHRlcm5hbCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIGR0cyh7XG4gICAgICBpbmNsdWRlOiAnc3JjJyxcbiAgICB9KSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMnKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgbWluaWZ5OiBmYWxzZSxcbiAgICBsaWI6IHtcbiAgICAgIGZvcm1hdHM6IFsnZXMnXSxcbiAgICAgIGVudHJ5OiB7XG4gICAgICAgIGluZGV4OiAnc3JjL2luZGV4LnRzJyxcbiAgICAgIH0sXG4gICAgfSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIHBlZXJEZXBzRXh0ZXJuYWwoe1xuICAgICAgICAgIGluY2x1ZGVEZXBlbmRlbmNpZXM6IHRydWUsXG4gICAgICAgIH0pLFxuICAgICAgXSxcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2NvbW1vbi5qcycsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1osU0FBUyxvQkFBb0I7QUFDNWIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sU0FBUztBQUNoQixPQUFPLHNCQUFzQjtBQUM3QixPQUFPLFVBQVU7QUFKakIsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLElBQ04sSUFBSTtBQUFBLE1BQ0YsU0FBUztBQUFBLElBQ1gsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLEtBQUs7QUFBQSxJQUNwQztBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFFBQVE7QUFBQSxJQUNSLEtBQUs7QUFBQSxNQUNILFNBQVMsQ0FBQyxJQUFJO0FBQUEsTUFDZCxPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0Y7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFNBQVM7QUFBQSxRQUNQLGlCQUFpQjtBQUFBLFVBQ2YscUJBQXFCO0FBQUEsUUFDdkIsQ0FBQztBQUFBLE1BQ0g7QUFBQSxNQUNBLFFBQVE7QUFBQSxRQUNOLGdCQUFnQjtBQUFBLE1BQ2xCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
