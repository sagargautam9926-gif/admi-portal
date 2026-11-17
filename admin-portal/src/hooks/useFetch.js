import { useState, useEffect, useCallback } from 'react';

export const useFetch = (fetchFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFunction();
      setData(result);
      return result;
    } catch (err) {
      console.error('Fetch error:', err);
      const errMsg = err?.response?.data?.message || err?.message || 'An unexpected error occurred';
      setError(errMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute().catch(() => {});
  }, [execute]);

  return { data, loading, error, refetch: execute, setData };
};

export default useFetch;

