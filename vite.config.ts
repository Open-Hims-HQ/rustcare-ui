import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
      serverModuleFormat: "esm",
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  build: {
    // Optimize build for production - use esbuild (faster and no extra deps)
    minify: "esbuild",
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Only chunk vendor modules for client build
          // Skip React and Remix as they're externalized in SSR
          if (id.includes('node_modules')) {
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            // Group other vendor modules
            if (!id.includes('react') && !id.includes('remix')) {
              return 'vendor';
            }
          }
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Disable source maps for smaller bundle size
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'esnext',
  },
  optimizeDeps: {
    // Pre-bundle dependencies for faster dev server startup
    include: ["lucide-react"],
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: 'https://api.openhims.health',
        changeOrigin: true,
        secure: false, // Allow self-signed certificates in development
        rewrite: (path) => path,
      },
    },
  },
});
