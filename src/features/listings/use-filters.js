"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EMPTY_FILTERS } from "./components/FilterPanel";

/**
 * Filter state lives in the URL, not component state.
 *
 * That makes a filtered grid shareable, survivable across a refresh, and
 * navigable with the back button — all of which students expect from a search
 * results page and none of which you get for free from `useState`.
 */
export function useListingFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      category: searchParams.get("category") || "",
      condition: searchParams.get("condition") || "",
      type: searchParams.get("type") || "",
      locationScope: searchParams.get("scope") || "",
      minPrice: searchParams.get("min") || "",
      maxPrice: searchParams.get("max") || "",
      sort: searchParams.get("sort") || EMPTY_FILTERS.sort,
      allColleges: searchParams.get("all") === "1",
    }),
    [searchParams]
  );

  const query = searchParams.get("q") || "";

  const setFilters = useCallback(
    (patch) => {
      const next = { ...filters, ...patch };
      const params = new URLSearchParams();

      if (query) params.set("q", query);
      if (next.category) params.set("category", next.category);
      if (next.condition) params.set("condition", next.condition);
      if (next.type) params.set("type", next.type);
      if (next.locationScope) params.set("scope", next.locationScope);
      if (next.minPrice) params.set("min", String(next.minPrice));
      if (next.maxPrice) params.set("max", String(next.maxPrice));
      if (next.sort && next.sort !== EMPTY_FILTERS.sort) params.set("sort", next.sort);
      if (next.allColleges) params.set("all", "1");

      const search = params.toString();
      // `scroll: false` keeps the user's place in the grid when they tweak a filter.
      router.replace(search ? `${pathname}?${search}` : pathname, { scroll: false });
    },
    [filters, query, pathname, router]
  );

  /** Translates UI filter state into the shape the listings API expects. */
  const apiParams = useMemo(() => {
    const [sortBy, sortOrder] = (filters.sort || EMPTY_FILTERS.sort).split(":");

    return {
      ...(query ? { q: query } : {}),
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.condition ? { condition: filters.condition } : {}),
      ...(filters.type ? { type: filters.type } : {}),
      ...(filters.locationScope ? { locationScope: filters.locationScope } : {}),
      ...(filters.minPrice ? { minPrice: Number(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { maxPrice: Number(filters.maxPrice) } : {}),
      ...(filters.allColleges ? { allColleges: true } : {}),
      sortBy,
      sortOrder,
    };
  }, [filters, query]);

  return { filters, setFilters, query, apiParams };
}
