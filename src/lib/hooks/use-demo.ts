"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getServerState, getState, subscribe, type DemoState } from "../services/store";

/** Subscribe to the browser-local demo store. Server render uses the seed so hydration stays consistent. */
export function useDemoState(): DemoState {
  return useSyncExternalStore(subscribe, getState, getServerState);
}

export type QueryState<T> = {
  data: T | undefined;
  error: Error | null;
  loading: boolean;
  refetch: () => void;
};

/**
 * Minimal data-fetching hook around the async `api` layer: loading / error / data states,
 * re-runs automatically whenever demo data changes. Swap for TanStack Query when a real backend lands.
 */
export function useQuery<T>(fn: () => Promise<T>, deps: unknown[] = []): QueryState<T> {
  const state = useDemoState();
  const [data, setData] = useState<T>();
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);
  const fnRef = useRef(fn);
  const first = useRef(true);
  useEffect(() => {
    fnRef.current = fn;
  });

  useEffect(() => {
    let alive = true;
    // Only show the skeleton on the first load; later refetches keep stale data on screen.
    if (first.current) setLoading(true);
    fnRef.current()
      .then((d) => {
        if (!alive) return;
        setData(d);
        setError(null);
      })
      .catch((e: unknown) => {
        if (alive) setError(e instanceof Error ? e : new Error(String(e)));
      })
      .finally(() => {
        if (alive) {
          setLoading(false);
          first.current = false;
        }
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, tick, ...deps]);

  const refetch = useCallback(() => {
    first.current = true;
    setTick((t) => t + 1);
  }, []);

  return { data, error, loading, refetch };
}
