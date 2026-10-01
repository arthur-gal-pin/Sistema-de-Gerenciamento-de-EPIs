import { useCallback, useEffect, useState } from 'react';
import { apiMessage } from '../utils/apiHelpers';

export function useResource(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');

    fetcher()
      .then((result) => !cancelled && setData(result))
      .catch((e) => !cancelled && setError(apiMessage(e, 'Não foi possível carregar os dados.')))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [...deps, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data, setData, loading, error, reload };
}
