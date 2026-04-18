// FILE: apps/web/lib/usePolling.ts
// Reusable polling hook — fetches a URL every `interval` ms.
// Stops automatically when `shouldStop(data)` returns true.

"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface PollingResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

export function usePolling<T>(
  url: string,
  interval: number = 5000,
  shouldStop?: (data: T) => boolean
): PollingResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stoppedRef = useRef(false);

  const fetchData = useCallback(async () => {
    if (stoppedRef.current) return;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: T = await res.json();
      setData(json);
      setError(null);
      setLoading(false);

      if (shouldStop?.(json)) {
        stoppedRef.current = true;
        return; // Stop polling — order complete
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Fetch failed");
      setLoading(false);
    }

    if (!stoppedRef.current) {
      timerRef.current = setTimeout(fetchData, interval);
    }
  }, [url, interval, shouldStop]);

  useEffect(() => {
    stoppedRef.current = false;
    fetchData();
    return () => {
      stoppedRef.current = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fetchData]);

  return { data, error, loading };
}