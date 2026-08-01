import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// BismiLLAH Ar-Rahman Ar-Roheem.
// Astro backend for the Minhaajulhudaa Hub monorepo.
//
// Serves ONLY the API (no UI). All UIs remain on the React app
// (the repo root Vite project). The Astro server exposes REST endpoints
// under /api that proxy to Lightbase, handle auth, webhooks, etc.
//
// In development the React app (port 8080) talks to this server
// (port 4321) via the VITE_API_URL env var. In production both can be
// deployed behind the same origin with a reverse proxy.
export default defineConfig({
  server: {
    port: 4321,
    host: true,
  },
  output: 'server',
  adapter: node({ mode: 'standalone' }),
});
