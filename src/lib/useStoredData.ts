"use client";

import { useSyncExternalStore } from "react";
import {
  BLOG_KEY,
  BlogPost,
  DESTINATIONS_KEY,
  Destination,
  SPECIALTIES_KEY,
  Specialty,
  defaultBlogPosts,
  defaultDestinations,
  defaultSpecialties,
} from "./db";

/**
 * Reading localStorage directly while rendering breaks hydration: the server
 * renders the defaults and the browser renders whatever is stored, so React
 * finds two different trees and throws "Hydration failed".
 *
 * useSyncExternalStore fixes that properly — it renders `getServerSnapshot`
 * (the defaults, matching the server) for the hydration pass, then swaps to the
 * stored copy right after. No mismatch, and no `mounted` flag to thread around.
 */

/** Parsed values, keyed by storage key. getSnapshot MUST return the same
 *  reference while the underlying string is unchanged — a fresh array on every
 *  call makes React re-render forever. */
const cache = new Map<string, { raw: string; value: unknown }>();

function snapshot<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  let raw: string | null;
  try {
    raw = localStorage.getItem(key);
  } catch {
    return fallback; // private mode / storage disabled
  }
  if (raw === null) return fallback;

  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value as T[];

  let value: T[];
  try {
    value = JSON.parse(raw) as T[];
  } catch {
    value = fallback;
  }
  cache.set(key, { raw, value });
  return value;
}

/** Module-level so the reference stays stable across renders. */
function subscribe(onStoreChange: () => void) {
  // bc_db_update covers saves from this tab; storage covers other tabs.
  window.addEventListener("bc_db_update", onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener("bc_db_update", onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function useSpecialties(): Specialty[] {
  return useSyncExternalStore(
    subscribe,
    () => snapshot(SPECIALTIES_KEY, defaultSpecialties),
    () => defaultSpecialties,
  );
}

export function useDestinations(): Destination[] {
  return useSyncExternalStore(
    subscribe,
    () => snapshot(DESTINATIONS_KEY, defaultDestinations),
    () => defaultDestinations,
  );
}

export function useBlogPosts(): BlogPost[] {
  return useSyncExternalStore(
    subscribe,
    () => snapshot(BLOG_KEY, defaultBlogPosts),
    () => defaultBlogPosts,
  );
}
