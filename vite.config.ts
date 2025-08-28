import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "/",
  server: {
    host: "::",
    port: 8080,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunking for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@radix-ui') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            if (id.includes('@tanstack') || id.includes('react-query')) {
              return 'data-vendor';
            }
            return 'vendor';
          }
        },
      },
    },
    target: 'esnext',
    minify: mode === 'production' ? 'esbuild' : false,
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    chunkSizeWarningLimit: 1000,
    assetsDir: "assets",
    reportCompressedSize: false,
    sourcemap: false,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
