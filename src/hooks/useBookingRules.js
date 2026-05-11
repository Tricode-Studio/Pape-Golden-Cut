import { useState, useEffect } from 'react';
import { getEntries } from '../api/cms';

export function useBookingRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getEntries('booking-rules', 24)
      .then(res => {
        if (!cancelled) {
          const items = res?.entries ?? res?.data ?? (Array.isArray(res) ? res : []);
          setRules(items);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.warn('[CMS] booking-rules unavailable, using defaults:', err.message);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { rules, loading, error };
}
