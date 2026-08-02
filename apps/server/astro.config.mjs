import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import { fileURLToPath } from 'node:url';

// BismiLLAH Ar-Rahman Ar-Roheem.
// Astro backend for the Minhaajulhudaa Hub monorepo.
//
// In production this server serves BOTH:
//   - The API (/api/* endpoints)
//   - The React static build (from ../dist, the Vite output)
//
// This means a single `npm run start` serves the entire application.
// In development, the React app runs on port 8080 (Vite dev server
// with /api proxied to this server on port 4321).
export default defineConfig({
  server: {
    port: 4321,
    host: true,
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // Serve the React build output as static assets.
  publicDir: '../dist',
  vite: {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src/', import.meta.url)),
      },
    },
  },
});
