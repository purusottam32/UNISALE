"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { TRENDING_SEARCHES } from "@/config/site";

const RECENT_KEY = "unisale.recentSearches";
const MAX_RECENT = 6;
/** Long enough that a fast typist doesn't fire a request per keystroke,
 *  short enough that the panel feels like it is keeping up. */
export const SEARCH_DEBOUNCE_MS = 220;
/** Below this the result set is too broad to be useful. */
export const MIN_QUERY_LENGTH = 2;

const read = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(RECENT_KEY) || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
};

/**
 * Recent searches, persisted locally.
 *
 * Most marketplace searches are repeats — "cycle" this week, "cycle" next
 * week — so surfacing recents the instant the field is focused removes the
 * most common piece of typing in the product. Local-only on purpose: search
 * history is mildly personal and there is no product reason to put it on a
 * server.
 */
export function useRecentSearches() {
  const [recents, setRecents] = useState<string[]>([]);

  // Read after mount: localStorage does not exist during SSR, and reading it
  // in useState's initialiser would desync the hydrated markup.
  useEffect(() => setRecents(read()), []);

  const add = useCallback((term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;

    const next = [trimmed, ...read().filter((item) => item.toLowerCase() !== trimmed.toLowerCase())]
      .slice(0, MAX_RECENT);

    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecents(next);
  }, []);

  const remove = useCallback((term: string) => {
    const next = read().filter((item) => item !== term);
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    setRecents(next);
  }, []);

  const clear = useCallback(() => {
    window.localStorage.removeItem(RECENT_KEY);
    setRecents([]);
  }, []);

  return { recents, add, remove, clear };
}

/** Swap the source here when campus query aggregation ships. */
export function useTrendingSearches() {
  return useMemo(() => TRENDING_SEARCHES, []);
}

/** Debounces the query so suggestions fire on a pause, not per keystroke. */
export function useDebounced<T>(value: T, delay = SEARCH_DEBOUNCE_MS) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export interface SuggestionRow {
  /** Stable id for `aria-activedescendant`. */
  id: string;
  kind: "recent" | "trending" | "category" | "listing" | "all";
  label: string;
  /** Where activating this row navigates to. */
  href: string;
  /** The term to record in recents, if any. */
  term?: string;
  meta?: string;
  price?: number;
  image?: string;
  emoji?: string;
}

/**
 * Roving keyboard selection over a flat list of rows.
 *
 * The list is deliberately flattened across groups: a user pressing ↓ expects
 * to move to the next *row*, not to be stopped at a group boundary. Returns
 * -1 when nothing is highlighted, which is the state Enter uses to mean
 * "search for exactly what I typed".
 */
export function useRovingSelection(rows: SuggestionRow[], isOpen: boolean) {
  const [index, setIndex] = useState(-1);

  // Any change to the result set invalidates the highlight — keeping it would
  // leave the ring pointing at a row that has since been replaced.
  useEffect(() => setIndex(-1), [rows.length, isOpen]);

  const move = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (rows.length === 0) return -1;
        const next = current + delta;
        // Wraps both ways: ↑ from the top lands on the last row.
        if (next < 0) return rows.length - 1;
        if (next >= rows.length) return 0;
        return next;
      });
    },
    [rows.length]
  );

  return { index, setIndex, move, activeRow: index >= 0 ? rows[index] : null };
}
