"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useListings } from "@/features/listings/hooks";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { popIn } from "@/lib/motion";
import SearchSuggestions from "./SearchSuggestions";
import {
  MIN_QUERY_LENGTH,
  useDebounced,
  useRecentSearches,
  useRovingSelection,
  useTrendingSearches,
  type SuggestionRow,
} from "./use-search";

const MAX_LISTING_ROWS = 5;
const MAX_CATEGORY_ROWS = 3;
const MAX_TRENDING_ROWS = 6;

/**
 * Search — a full interaction, not an input.
 *
 * ARIA: implements the combobox-with-listbox pattern. The input keeps focus at
 * all times and `aria-activedescendant` points at the highlighted row, so
 * screen readers announce the selection without focus ever leaving the field.
 * This is what lets ↑↓ browse results while you keep typing.
 *
 * The row list is flattened across groups before it reaches the panel, so the
 * keyboard index and the rendered order are the same array. Group headings are
 * decorative; a heading in the roving index would be a stop you cannot select.
 *
 * Pointer events use `onMouseDown` + `preventDefault` rather than `onClick`:
 * the input's blur fires first and would tear the panel down before the click
 * resolves.
 */
export interface SearchBarProps {
  /** Renders the panel inline rather than absolutely — for the mobile sheet. */
  variant?: "bar" | "inline";
  autoFocus?: boolean;
  placeholder?: string;
  defaultValue?: string;
  onNavigate?: () => void;
  className?: string;
}

export default function SearchBar({
  variant = "bar",
  autoFocus = false,
  placeholder = "Search cycles, books, laptops…",
  defaultValue = "",
  onNavigate,
  className,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [query, setQuery] = useState(defaultValue);
  const [open, setOpen] = useState(false);

  const debounced = useDebounced(query.trim());
  const isSearching = debounced.length >= MIN_QUERY_LENGTH;

  const listboxId = useId();
  const { recents, add: addRecent, remove: removeRecent, clear: clearRecents } = useRecentSearches();
  const trending = useTrendingSearches();

  const { listings, isLoading } = useListings(
    { q: debounced, limit: MAX_LISTING_ROWS, allColleges: true },
    { enabled: isSearching }
  );

  /* ── Row assembly ────────────────────────────────────────────────────── */
  const rows = useMemo<SuggestionRow[]>(() => {
    if (!isSearching) {
      return [
        ...recents.map((term, i) => ({
          id: `${listboxId}-recent-${i}`,
          kind: "recent" as const,
          label: term,
          term,
          href: `/search?q=${encodeURIComponent(term)}`,
        })),
        ...trending.slice(0, MAX_TRENDING_ROWS).map((term, i) => ({
          id: `${listboxId}-trending-${i}`,
          kind: "trending" as const,
          label: term,
          term,
          href: `/search?q=${encodeURIComponent(term)}`,
        })),
      ];
    }

    const needle = debounced.toLowerCase();

    const categories = LISTING_CATEGORIES.filter((category) =>
      category.toLowerCase().includes(needle)
    )
      .slice(0, MAX_CATEGORY_ROWS)
      .map((category, i) => ({
        id: `${listboxId}-category-${i}`,
        kind: "category" as const,
        label: category,
        emoji: CATEGORY_META[category]?.emoji,
        meta: CATEGORY_META[category]?.blurb,
        href: `/explore?category=${encodeURIComponent(category)}`,
      }));

    const items = listings.slice(0, MAX_LISTING_ROWS).map((listing, i) => ({
      id: `${listboxId}-listing-${i}`,
      kind: "listing" as const,
      label: listing.title,
      meta: [listing.category, listing.college].filter(Boolean).join(" · "),
      price: listing.price,
      image: listing.images?.[0]?.url,
      href: `/listings/${listing._id}`,
    }));

    return [
      ...categories,
      ...items,
      {
        id: `${listboxId}-all`,
        kind: "all" as const,
        label: `Search for “${debounced}”`,
        term: debounced,
        href: `/search?q=${encodeURIComponent(debounced)}`,
      },
    ];
  }, [isSearching, debounced, recents, trending, listings, listboxId]);

  const { index, setIndex, move, activeRow } = useRovingSelection(rows, open);

  /* ── Navigation ──────────────────────────────────────────────────────── */
  const go = useCallback(
    (row: SuggestionRow) => {
      if (row.term) addRecent(row.term);
      setOpen(false);
      inputRef.current?.blur();
      onNavigate?.();
      router.push(row.href);
    },
    [addRecent, onNavigate, router]
  );

  const submit = useCallback(() => {
    // Enter with nothing highlighted means "search exactly what I typed".
    if (activeRow) return go(activeRow);
    const trimmed = query.trim();
    if (!trimmed) return;
    go({
      id: "submit",
      kind: "all",
      label: trimmed,
      term: trimmed,
      href: `/search?q=${encodeURIComponent(trimmed)}`,
    });
  }, [activeRow, query, go]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) setOpen(true);
        move(1);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(-1);
        break;
      case "Enter":
        event.preventDefault();
        submit();
        break;
      case "Escape":
        // First Escape closes the panel; a second clears the field. Closing
        // and clearing at once loses work the user may still want.
        if (open) setOpen(false);
        else setQuery("");
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  /* ── ⌘K / Ctrl+K ─────────────────────────────────────────────────────── */
  useEffect(() => {
    if (variant !== "bar") return undefined;

    const onGlobalKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", onGlobalKey);
    return () => window.removeEventListener("keydown", onGlobalKey);
  }, [variant]);

  /* ── Dismiss on outside pointer ──────────────────────────────────────── */
  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const showPanel = open && (rows.length > 0 || isSearching);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <div
        role="combobox"
        aria-expanded={showPanel}
        aria-owns={listboxId}
        aria-haspopup="listbox"
        className="relative"
      >
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
          <Search size={iconSize.md} strokeWidth={ICON_STROKE} />
        </span>

        <input
          ref={inputRef}
          type="text"
          role="searchbox"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder={placeholder}
          aria-label="Search listings"
          aria-autocomplete="list"
          aria-controls={listboxId}
          aria-activedescendant={activeRow?.id}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "h-11 w-full rounded-full bg-surface-2 pl-11 pr-24 text-body-sm text-ink",
            "shadow-e1 outline-none placeholder:text-muted",
            "transition-[background-color,box-shadow] duration-[--duration-fast] ease-[--ease-standard]",
            "focus:bg-surface focus:shadow-[inset_0_0_0_1px_var(--color-brand)] focus:ring-4 focus:ring-brand-ring"
          )}
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="grid h-8 w-8 place-items-center rounded-full text-muted transition-colors hover:bg-surface-3 hover:text-ink"
            >
              <X size={iconSize.sm} strokeWidth={ICON_STROKE} />
            </button>
          )}

          {/* Discoverability for the shortcut. Hidden on touch, where there is
              no keyboard to advertise, and while typing, where it is clutter. */}
          {variant === "bar" && !query && (
            <kbd
              aria-hidden
              className="mr-1.5 hidden select-none rounded-xs bg-surface-3 px-1.5 py-0.5 text-[0.6875rem] font-medium text-muted md:block"
            >
              ⌘K
            </kbd>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showPanel && (
          <motion.div
            variants={popIn}
            initial="hidden"
            animate="show"
            exit="exit"
            className={cn(
              "z-[60] origin-top",
              variant === "bar" ? "absolute inset-x-0 top-[calc(100%+8px)]" : "mt-2"
            )}
          >
            <SearchSuggestions
              listboxId={listboxId}
              rows={rows}
              activeIndex={index}
              onHover={setIndex}
              onSelect={go}
              onRemoveRecent={removeRecent}
              onClearRecents={clearRecents}
              query={debounced}
              isLoading={isSearching && isLoading}
              isSearching={isSearching}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
