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
          // Vendor splitting for better caching
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation-vendor';
            }
            if (id.includes('@supabase') || id.includes('@tanstack')) {
              return 'data-vendor';
            }
            if (id.includes('lucide-react') || id.includes('react-icons')) {
              return 'icons-vendor';
            }
            return 'vendor';
          }
          
          // Route-based splitting
          if (id.includes('pages/')) {
            if (id.includes('PropertySearch') || id.includes('PropertyDetail')) {
              return 'property-pages';
            }
            if (id.includes('Dubai') || id.includes('Antalya') || id.includes('Cyprus')) {
              return 'location-pages';
            }
            return 'pages';
          }
          
          // Component splitting
          if (id.includes('components/ui/')) {
            return 'ui-components';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
    assetsDir: "assets",
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
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
