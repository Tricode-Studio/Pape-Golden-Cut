import { useState, useEffect } from 'react';
import { getLandingConfig } from '../api/cms';

export function useLandingConfig() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getLandingConfig()
      .then(res => {
        if (!cancelled) {
          setData(res);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.warn('[CMS] landing-config unavailable:', err.message);
          setError(err);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading, error };
}
