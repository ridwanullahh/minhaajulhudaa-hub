import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// BismiLLAH Ar-Rahman Ar-Roheem.
//
// Vite config for the React frontend.
//
// Uses the standard @vitejs/plugin-react (not SWC) for maximum
// portability across deployment platforms. SWC requires native
// binaries that may not be available on all hosts.
//
// Security: we do NOT inline `process.env` into the client bundle. Only
// explicitly-prefixed VITE_ vars are exposed to the client, and even
// then only the ones we read in src/lib/config.ts. The Lightbase API
// key (VITE_LIGHTBASE_API_KEY) is read conditionally only when
// VITE_DB_PROVIDER=lightbase, so with provider=api (default) the key
// is never referenced and never appears in the bundle.
//
// Dev proxy: /api/* is proxied to the Astro backend (port 4321) so the
// React app can call /api/db/* and /api/auth/* as same-origin in dev.

async function loadPlugins(mode: string) {
  const plugins: any[] = [react()];

  // lovable-tagger is a dev-only inspection tool. Load it dynamically
  // so production builds don't fail if it's missing or broken, and so
  // it never affects the production bundle.
  if (mode === 'development') {
    try {
      const { componentTagger } = await import('lovable-tagger');
      if (typeof componentTagger === 'function') {
        plugins.push(componentTagger());
      }
    } catch {
      // lovable-tagger not available - skip silently
    }
  }

  return plugins;
}

export default defineConfig(async ({ mode }) => {
  const plugins = await loadPlugins(mode);

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        '/api': {
          target: 'http://localhost:4321',
          changeOrigin: true,
        },
      },
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Only expose VITE_-prefixed env vars to the client. Do NOT expose
    // LIGHTBASE_* (server-only) or SESSION_SECRET or any other secret.
    envPrefix: 'VITE_',

    // Define VITE_DB_PROVIDER as a build-time constant so Vite's
    // dead-code elimination can drop the `if (provider === 'lightbase')`
    // branch entirely when provider=api. This prevents the static
    // `import.meta.env.VITE_LIGHTBASE_API_KEY` accesses inside that
    // branch from being inlined into the client bundle.
    define: {
      'import.meta.env.VITE_DB_PROVIDER': JSON.stringify(loadEnv(mode, process.cwd(), 'VITE_').VITE_DB_PROVIDER || 'api'),
    },

    build: {
      chunkSizeWarningLimit: 800,
    },
  };
});
