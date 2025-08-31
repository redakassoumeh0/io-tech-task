// src/hooks/useStrapi.ts
import { useEffect, useState } from "react";

type UseStrapiResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

export function useStrapi<T = any>(endpoint: string): UseStrapiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `http://localhost:1337/api/${endpoint}?populate=*`
        );
        if (!res.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const json = await res.json();
        setData(json.data);
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, loading, error };
}
