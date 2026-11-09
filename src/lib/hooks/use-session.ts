"use client";

import { useSyncExternalStore } from "react";
import type { DemoUser } from "../types";
import { useDemoState } from "./use-demo";

const noop = () => () => {};

/** True only after hydration — lets us avoid SSR/client mismatches for session-dependent UI. */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}

export function useSession(): { user: DemoUser | null; ready: boolean } {
  const state = useDemoState();
  const ready = useHydrated();
  return { user: ready ? state.user : null, ready };
}
