/**
 * GET /api/health
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Returns the server status and Lightbase connectivity. Used by the
 * React app to verify the backend is reachable and the DB is wired.
 */
import type { APIRoute } from 'astro';
import { isConfigured, getConfig, listDocs } from '@/lib/lightbase';

export const GET: APIRoute = async () => {
  const config = getConfig();
  let dbReachable = false;
  let dbError: string | null = null;

  if (config.configured) {
    try {
      // Try listing 1 doc from the users collection as a ping
      await listDocs('users', { limit: 1 });
      dbReachable = true;
    } catch (err: any) {
      dbError = err?.message || String(err);
    }
  }

  const status = dbReachable ? 'ok' : config.configured ? 'degraded' : 'misconfigured';

  return new Response(
    JSON.stringify({
      status,
      server: 'minhaajulhudaa-hub-api',
      time: new Date().toISOString(),
      lightbase: {
        configured: config.configured,
        baseUrl: config.baseUrl,
        projectId: config.projectId,
        reachable: dbReachable,
        error: dbError,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
};
