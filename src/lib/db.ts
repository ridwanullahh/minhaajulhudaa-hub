/**
 * Global database singleton
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * This module re-exports the active DB instance from `db-provider.ts`.
 *
 * When VITE_DB_PROVIDER=lightbase (default) it returns a LightbaseSDK
 * instance talking to the Lightbase BaaS core `/api/v1` endpoint.
 *
 * When VITE_DB_PROVIDER=github it returns the legacy UniversalSDK
 * instance backed by the GitHub-repo-as-database implementation.
 *
 * The legacy UniversalSDK config (including the schemas registry) is kept
 * in `db-schemas.ts` so the GitHub path can still use it without
 * duplicating the schema definitions.
 *
 * Callers use `db.get('users')`, `db.insert('users', {...})`,
 * `db.update('users', id, {...})`, `db.delete('users', id)` - the same
 * interface that auth-context.tsx and the payment / media / blog / cms
 * services already use. No call-site changes are required.
 */

import { globalDb } from './db-provider';

const db = globalDb;

// Kick off initialization in the background so the first user-facing
// query is warm. Errors are logged but never block app boot.
db.init().catch((err: unknown) => {
  console.error('[db] initialization failed:', err);
});

export default db;
