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
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      let result;
      if (options.responseType === "text") {
        result = (await response.text()) as unknown as T;
      } else {
        result = await response.json();
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
