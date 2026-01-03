import { useCallback, useEffect, useState } from "react";

export default function useFetch<T = any>(
  url: string,
  options: { responseType?: "json" | "text" } = {}
): {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log('=== FETCH STARTED ===>', url);
    try {
      const response = await fetch(url);
      console.log('=== FETCH RESPONSE ===>', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText,
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      let result;
      if (options.responseType === "text") {
        result = (await response.text()) as unknown as T;
        console.log('=== FETCH TEXT RESULT (first 200 chars) ===>', typeof result === 'string' ? result.substring(0, 200) : 'Not a string');
      } else {
        result = await response.json();
        console.log('=== FETCH JSON RESULT ===>', result);
      }
      setData(result);
    } catch (err: unknown) {
      console.error('=== FETCH ERROR ===>', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, [url, options.responseType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
