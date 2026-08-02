/**
 * Server-side Lightbase client
 *
 * BismiLLAH Ar-Rahman Ar-Roheem.
 *
 * Thin wrapper around fetch that talks to the Lightbase core /api/v1
 * endpoint. Server-side only - the Lightbase API key lives in
 * process.env and never reaches the browser.
 */

const BASE_URL = (process.env.LIGHTBASE_BASE_URL || process.env.VITE_LIGHTBASE_BASE_URL || '').replace(/\/+$/, '');
const API_KEY = process.env.LIGHTBASE_API_KEY || process.env.VITE_LIGHTBASE_API_KEY || '';
const PROJECT_ID = process.env.LIGHTBASE_PROJECT_ID || process.env.VITE_LIGHTBASE_PROJECT_ID || '';

export interface LightbaseDoc {
  id: string;
  _created_at?: string;
  _updated_at?: string;
  _revision?: number;
  _deleted?: boolean;
  [key: string]: any;
}

function headers(): Record<string, string> {
  return {
    apikey: API_KEY,
    'x-lightbase-project': PROJECT_ID,
    'Content-Type': 'application/json',
  };
}

function apiUrl(path: string): string {
  return `${BASE_URL}/api/v1/projects/${PROJECT_ID}${path}`;
}

export async function listDocs(collection: string, opts: { limit?: number; filter?: any; sort?: string } = {}): Promise<LightbaseDoc[]> {
  const params = new URLSearchParams();
  params.set('limit', String(opts.limit || 1000));
  if (opts.filter) params.set('filter', JSON.stringify(opts.filter));
  if (opts.sort) params.set('sort', opts.sort);
  const url = `${apiUrl(`/collections/${encodeURIComponent(collection)}/docs`)}?${params}`;
  const res = await fetch(url, { method: 'GET', headers: headers() });
  if (!res.ok) {
    if (res.status === 404) return [];
    throw new Error(`Lightbase listDocs(${collection}) failed: ${res.status} ${await res.text()}`);
  }
  const json = await res.json();
  return (json.data || []) as LightbaseDoc[];
}

export async function getDoc(collection: string, id: string): Promise<LightbaseDoc | null> {
  const res = await fetch(`${apiUrl(`/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`)}`, { method: 'GET', headers: headers() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Lightbase getDoc failed: ${res.status}`);
  const json = await res.json();
  return (json.document || json) as LightbaseDoc;
}

export async function insertDoc(collection: string, doc: any): Promise<LightbaseDoc> {
  const res = await fetch(`${apiUrl(`/collections/${encodeURIComponent(collection)}`)}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error(`Lightbase insertDoc failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return json.document as LightbaseDoc;
}

export async function updateDoc(collection: string, id: string, patch: any, expectedRevision?: number): Promise<LightbaseDoc> {
  const reqHeaders = headers();
  // If-Match header for optimistic concurrency: if the document's
  // _revision on the server doesn't match expectedRevision, Lightbase
  // returns 409 Conflict. This prevents silent overwrites when two
  // clients edit the same document concurrently.
  if (expectedRevision !== undefined) {
    reqHeaders['If-Match'] = String(expectedRevision);
  }

  let res = await fetch(`${apiUrl(`/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`)}`, {
    method: 'PATCH',
    headers: reqHeaders,
    body: JSON.stringify(patch),
  });

  // On 409 Conflict, throw a typed error so callers can retry
  if (res.status === 409) {
    const conflictErr: any = new Error('Document was modified by another client (revision conflict)');
    conflictErr.code = 'CONFLICT';
    conflictErr.status = 409;
    throw conflictErr;
  }

  if (!res.ok) throw new Error(`Lightbase updateDoc failed: ${res.status} ${await res.text()}`);
  const json = await res.json();
  return (json.document || json) as LightbaseDoc;
}

export async function deleteDoc(collection: string, id: string): Promise<void> {
  const res = await fetch(`${apiUrl(`/collections/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  if (!res.ok && res.status !== 404) throw new Error(`Lightbase deleteDoc failed: ${res.status}`);
}

export function isConfigured(): boolean {
  return Boolean(BASE_URL && API_KEY && PROJECT_ID);
}

export function getConfig() {
  return { baseUrl: BASE_URL, projectId: PROJECT_ID, configured: isConfigured() };
}
