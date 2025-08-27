
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
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
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for better caching
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // UI components chunk
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', 'lucide-react'],
          // Query and state management
          query: ['@tanstack/react-query', '@supabase/supabase-js'],
          // Motion and animations
          motion: ['framer-motion', 'gsap'],
        },
        // Use contenthash for better cache busting
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
    // Optimize CSS
    cssCodeSplit: true,
    // Use esbuild for minification (faster than terser and built-in)
    minify: 'esbuild',
    target: 'es2015',
    // Drop console/debugger in production
    esbuild: {
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
  },
  // Optimize deps for faster dev server
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
      'lucide-react'
    ],
  },
}));
