/**
 * Tricode CMS — Public API client
 * Tenant : pape-golden-cut
 * Proxy  : /cms-proxy → https://cms.tricode.studio/api/v1  (vercel.json rewrite)
 * Schema snapshot: 2026-05-08
 */

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '/cms-proxy').trim(); // "/cms-proxy"
const TENANT   = (import.meta.env.VITE_TENANT_SLUG || 'pape-golden-cut').trim();
const TIMEOUT_MS  = 8000;
const MAX_ATTEMPTS = 3; // 1 initial + 2 retries

const isDev = import.meta.env.DEV;

// ---------------------------------------------------------------------------
// Logger — verbose in dev, minimal in prod
// ---------------------------------------------------------------------------
const log = {
  info : (...a) => { if (isDev) console.log ('[CMS]', ...a); },
  warn : (...a) => console.warn ('[CMS]', ...a),
  error: (...a) => console.error('[CMS]', ...a),
};

// ---------------------------------------------------------------------------
// JSDoc types
// ---------------------------------------------------------------------------

/**
 * @typedef {{ id: string|null, slug: string|null, fields: Record<string,any> }} CMSEntry
 *
 * @typedef {{ servicecode:string, name:string, description?:string,
 *   durationminutes:number, allowonlinebooking:boolean, requiresdeposit?:boolean,
 *   depositamount?:number, price:number, currency:string }} BarberServiceFields
 *
 * @typedef {{ name:string, maxAdvanceDays?:number, slotMinutes:number, active:boolean }} BookingRuleFields
 *
 * @typedef {{ title:string, summary?:string, body:string,
 *   audience?:string, startsAt?:string, endsAt?:string }} AnnouncementFields
 *
 * @typedef {{ name:string, phone:string, email?:string,
 *   service:string, requestedDate:string, requestedTime:string, notes?:string }} PresupuestoPayload
 */

// ---------------------------------------------------------------------------
// CMSError
// ---------------------------------------------------------------------------

export class CMSError extends Error {
  /** @param {string} message @param {number} status */
  constructor(message, status) {
    super(message);
    this.name   = 'CMSError';
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Fetch with timeout
// ---------------------------------------------------------------------------

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchWithTimeout(url, options = {}) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...options.headers,
      },
    });
    clearTimeout(tid);
    return res;
  } catch (err) {
    clearTimeout(tid);
    if (err.name === 'AbortError') throw new CMSError('Request timeout', 408);
    throw err;
  }
}

// ---------------------------------------------------------------------------
// Core request — retries for GET, single attempt for writes
// ---------------------------------------------------------------------------

async function apiRequest(url, options = {}) {
  if (!API_BASE) throw new CMSError('VITE_API_BASE_URL not configured', 0);

  const isWrite  = !!options.method && options.method !== 'GET';
  const attempts = isWrite ? 1 : MAX_ATTEMPTS;

  for (let i = 0; i < attempts; i++) {
    try {
      log.info(`${options.method ?? 'GET'} ${url}${i > 0 ? ` (retry ${i})` : ''}`);
      const res = await fetchWithTimeout(url, options);

      if (res.status === 404) throw new CMSError('Not found', 404);

      if (res.status === 429) {
        const wait = parseInt(res.headers.get('Retry-After') || '2', 10);
        log.warn(`429 rate-limit — waiting ${wait + i}s`);
        await delay((wait + i) * 1000);
        continue;
      }

      if (res.status >= 500) {
        if (i < attempts - 1) {
          const wait = Math.pow(2, i) * 1000;
          log.warn(`${res.status} server error — retrying in ${wait}ms`);
          await delay(wait);
          continue;
        }
        throw new CMSError(`Server error ${res.status}`, res.status);
      }

      if (!res.ok) throw new CMSError(`HTTP ${res.status}`, res.status);

      const json = await res.json();
      log.info(`← ${res.status} ${url}`);
      return json;

    } catch (err) {
      if (err instanceof CMSError) throw err;   // known errors: rethrow immediately
      if (i === attempts - 1) throw err;        // last attempt: propagate
      const wait = Math.pow(2, i) * 800;
      log.warn(`Network error (attempt ${i + 1}/${attempts}), retrying in ${wait}ms:`, err.message);
      await delay(wait);
    }
  }
}

// ---------------------------------------------------------------------------
// parseEntriesResponse — THE single normalizer for all API response shapes
//
// Handles:
//   { items: [...] }      ← Tricode CMS v2 (current)
//   { entries: [...] }    ← legacy / alternate
//   { data: [...] }       ← generic REST shape
//   [...]                 ← raw array
//
// Each entry is normalized to:
//   { id, slug, fields }
//   where fields = entry.fields ?? entry.data ?? (entry minus metadata keys)
// ---------------------------------------------------------------------------

const META_KEYS = new Set([
  'id', '_id', 'slug', 'createdAt', 'updatedAt', 'publishedAt',
  'status', 'tenantId', 'contentTypeId',
]);

/**
 * @param {any} res - Raw API response
 * @returns {CMSEntry[]}
 */
export function parseEntriesResponse(res) {
  // 1. Extract the array from any known wrapper shape
  let raw;
  if (Array.isArray(res))          raw = res;
  else if (Array.isArray(res?.items))   raw = res.items;
  else if (Array.isArray(res?.entries)) raw = res.entries;
  else if (Array.isArray(res?.data))    raw = res.data;
  else {
    log.warn('parseEntriesResponse: unrecognised response shape', res);
    return [];
  }

  if (isDev) {
    const shape = Array.isArray(res) ? 'raw array'
      : res?.items   ? 'items'
      : res?.entries ? 'entries'
      : 'data';
    log.info(`parseEntriesResponse: shape="${shape}", count=${raw.length}`);
  }

  // 2. Normalise each entry
  return raw.map(entry => {
    let fields;
    if (entry.fields && typeof entry.fields === 'object') {
      fields = entry.fields;
    } else if (entry.data && typeof entry.data === 'object') {
      fields = entry.data;
    } else {
      // Flatten entry, stripping known metadata keys
      fields = Object.fromEntries(
        Object.entries(entry).filter(([k]) => !META_KEYS.has(k))
      );
    }

    return {
      id:     entry.id ?? entry._id ?? null,
      slug:   entry.slug ?? null,
      fields,
    };
  });
}

// ---------------------------------------------------------------------------
// Public endpoints
// ---------------------------------------------------------------------------

export function getIntegrationManifest() {
  return apiRequest(`${API_BASE}/public/${TENANT}/integration-manifest`);
}

export function getLandingConfig() {
  return apiRequest(`${API_BASE}/public/${TENANT}/landing-config`);
}

/**
 * Raw entries response — use parseEntriesResponse() to normalise.
 * @param {'barber-services'|'booking-rules'|'announcements'} slug
 * @param {number} [limit=24]
 */
export function getEntries(slug, limit = 24) {
  return apiRequest(
    `${API_BASE}/public/${TENANT}/content-types/${slug}/entries?limit=${limit}`
  );
}

/** @returns {Promise<CMSEntry[]>} */
export const getBarberServices  = () => getEntries('barber-services').then(parseEntriesResponse);
/** @returns {Promise<CMSEntry[]>} */
export const getBookingRules    = () => getEntries('booking-rules').then(parseEntriesResponse);
/** @returns {Promise<CMSEntry[]>} */
export const getAnnouncements   = () => getEntries('announcements').then(parseEntriesResponse);

/**
 * @param {string} from - YYYY-MM-DD
 * @param {string} to - YYYY-MM-DD
 */
export function getReservationAvailability(from, to) {
  const params = new URLSearchParams({ from, to });
  return apiRequest(
    `${API_BASE}/public/${TENANT}/reservations/availability?${params.toString()}`
  );
}

/**
 * @param {{
 *   serviceName:string,
 *   startsAt:string,
 *   endsAt:string,
 *   recurrenceFrequency?:'NONE'|'DAILY'|'WEEKLY'|'MONTHLY',
 *   recurrenceInterval?:number,
 *   recurrenceCount?:number,
 *   recurrenceUntil?:string
 * }} payload
 */
export function previewReservation(payload) {
  return apiRequest(`${API_BASE}/public/${TENANT}/reservations/preview`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * @param {{
 *   serviceName:string,
 *   startsAt:string,
 *   endsAt:string,
 *   customerName:string,
 *   customerEmail:string,
 *   customerPhone?:string,
 *   notes?:string
 * }} payload
 */
export function createReservation(payload) {
  return apiRequest(`${API_BASE}/public/${TENANT}/reservations`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * POST a reservation / budget request.
 * @param {PresupuestoPayload} payload
 */
export function submitPresupuesto(payload) {
  return apiRequest(`${API_BASE}/public/${TENANT}/presupuestos`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
