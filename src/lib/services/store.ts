/**
 * Browser-local demo store. This is the ONLY place that touches localStorage for demo data.
 * Replace the `api` layer (see ./api.ts) with real HTTP calls and this file can be deleted.
 *
 * Security notes: passwords are never stored. Only a display profile is kept for the demo session.
 */
import {
  SEED_ACTIVITIES,
  SEED_APPLICATIONS,
  SEED_CERTIFICATES,
  SEED_FACILITIES,
  SEED_NOTIFICATIONS,
  SEED_PRODUCTS,
  SEED_SHIPMENTS,
} from "../data/seed";
import type {
  ActivityItem,
  Application,
  Certificate,
  DemoUser,
  Facility,
  NotificationItem,
  Product,
  Shipment,
} from "../types";

export type DemoState = {
  v: 1;
  user: DemoUser | null;
  facilities: Facility[];
  products: Product[];
  applications: Application[];
  certificates: Certificate[];
  shipments: Shipment[];
  notifications: NotificationItem[];
  activities: ActivityItem[];
  /** Work-in-progress product registration form (draft). */
  productDraft: unknown | null;
};

const KEY = "masr-comply-demo-v1";

export const seedState = (): DemoState => ({
  v: 1,
  user: null,
  facilities: structuredClone(SEED_FACILITIES),
  products: structuredClone(SEED_PRODUCTS),
  applications: structuredClone(SEED_APPLICATIONS),
  certificates: structuredClone(SEED_CERTIFICATES),
  shipments: structuredClone(SEED_SHIPMENTS),
  notifications: structuredClone(SEED_NOTIFICATIONS),
  activities: structuredClone(SEED_ACTIVITIES),
  productDraft: null,
});

const SERVER_STATE: DemoState = seedState();
let cache: DemoState | null = null;
const listeners = new Set<() => void>();

function read(): DemoState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as DemoState;
      if (parsed && parsed.v === 1) return parsed;
    }
  } catch {
    /* corrupted or unavailable storage → fall back to seed */
  }
  return seedState();
}

export function getState(): DemoState {
  if (typeof window === "undefined") return SERVER_STATE;
  if (!cache) cache = read();
  return cache;
}

export const getServerState = (): DemoState => SERVER_STATE;

export function setState(updater: (s: DemoState) => DemoState): DemoState {
  const next = updater(getState());
  cache = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or privacy mode: keep in-memory state only */
  }
  listeners.forEach((l) => l());
  return next;
}

export function resetState(): void {
  cache = seedState();
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = read();
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
