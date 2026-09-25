// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { resolve } from "node:path";

const browserStartStorageShim = {
  name: "browser-start-storage-context-shim",
  enforce: "pre" as const,
  resolveId(source: string, _importer: string | undefined, options: { ssr?: boolean }) {
    if (source === "@tanstack/start-storage-context" && !options?.ssr) {
      return resolve(process.cwd(), "src/lib/start-storage-context.browser.ts");
    }
  },
};

export default defineConfig({
  plugins: [browserStartStorageShim],
  vite: {
    optimizeDeps: {
      exclude: ["@tanstack/start-storage-context"],
    },
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
