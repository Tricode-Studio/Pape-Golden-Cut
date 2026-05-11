import { useState, useEffect } from 'react';
import { getEntries, parseEntriesResponse } from '../api/cms';

const isDev = import.meta.env.DEV;

/**
 * Fetches and normalises entries for a given Tricode CMS content type.
 * Handles all response shapes: { items }, { entries }, { data }, raw array.
 * Each entry is exposed as { id, slug, fields }.
 *
 * @param {'barber-services'|'booking-rules'|'announcements'|string} contentTypeSlug
 * @param {number} [limit=24]
 * @returns {{ entries: import('../api/cms').CMSEntry[], loading: boolean, error: Error|null }}
 */
export function useCMSEntries(contentTypeSlug, limit = 24) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError  ] = useState(null);

  useEffect(() => {
    if (!contentTypeSlug) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    getEntries(contentTypeSlug, limit)
      .then(raw => {
        if (cancelled) return;
        const normalised = parseEntriesResponse(raw);
        if (isDev) {
          console.log(`[useCMSEntries] "${contentTypeSlug}" → ${normalised.length} entries`);
          if (normalised.length > 0) console.log('[useCMSEntries] sample entry:', normalised[0]);
        }
        setEntries(normalised);
      })
      .catch(err => {
        if (cancelled) return;
        console.warn(`[useCMSEntries] "${contentTypeSlug}" failed:`, err.message);
        setError(err);
        setEntries([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [contentTypeSlug, limit]);

  return { entries, loading, error };
}
