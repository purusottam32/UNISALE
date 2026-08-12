"use client";

import Image from "next/image";
import {
  Clock,
  CornerDownLeft,
  ImageOff,
  Package,
  Search,
  SearchX,
  TrendingUp,
  X,
} from "lucide-react";
import { CATEGORY_META } from "@/config/catalog";
import { formatPriceCompact } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Skeleton from "@/components/ui/Skeleton";
import type { SuggestionRow } from "./use-search";

/**
 * The suggestions panel.
 *
 * Presentational only — every row, its order and its href are computed by
 * `SearchBar`, so the keyboard index and the rendered list can never disagree.
 * That split is the whole reason this is a separate file: a panel that builds
 * its own rows would need its own copy of the flattening logic.
 *
 * Rows are one flat list across groups. Group headings are decorative
 * (`aria-hidden`) because to a keyboard or screen-reader user this is a single
 * listbox — inserting real headings would put non-selectable stops in the
 * middle of the roving index.
 */
export interface SearchSuggestionsProps {
  listboxId: string;
  rows: SuggestionRow[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (row: SuggestionRow) => void;
  onRemoveRecent: (term: string) => void;
  onClearRecents: () => void;
  query: string;
  isLoading: boolean;
  /** True once the query is long enough that we are showing real results. */
  isSearching: boolean;
}

export default function SearchSuggestions({
  listboxId,
  rows,
  activeIndex,
  onHover,
  onSelect,
  onRemoveRecent,
  onClearRecents,
  query,
  isLoading,
  isSearching,
}: SearchSuggestionsProps) {
  const hasRecents = rows.some((row) => row.kind === "recent");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg bg-surface shadow-e3",
        "max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain"
      )}
    >
      <ul id={listboxId} role="listbox" aria-label="Search suggestions" className="p-1.5">
        {isLoading && <LoadingRows />}

        {!isLoading &&
          rows.map((row, index) => {
            const previous = rows[index - 1];
            const startsGroup = !previous || previous.kind !== row.kind;

            return (
              <li key={row.id}>
                {startsGroup && (
                  <GroupHeading
                    kind={row.kind}
                    onClear={row.kind === "recent" && hasRecents ? onClearRecents : undefined}
                  />
                )}

                <Row
                  row={row}
                  active={index === activeIndex}
                  query={query}
                  onHover={() => onHover(index)}
                  onSelect={() => onSelect(row)}
                  onRemove={row.kind === "recent" ? () => onRemoveRecent(row.term!) : undefined}
                />
              </li>
            );
          })}

        {!isLoading && isSearching && rows.length <= 1 && (
          /* `<=1` because the trailing "search for X" row is always present —
             on its own it means we found nothing. */
          <li className="flex flex-col items-center px-3 py-10 text-center">
            <span
              aria-hidden
              className="grid h-9 w-9 place-items-center rounded-full bg-surface-2 text-muted"
            >
              <SearchX size={iconSize.md} strokeWidth={ICON_STROKE} />
            </span>
            <p className="mt-3 text-body-sm font-medium text-ink">
              Nothing matching “{query}”
            </p>
            <p className="mt-1 text-caption text-muted">
              Try a simpler word — “cycle” finds more than “Hero Sprint 26 inch”.
            </p>
          </li>
        )}
      </ul>
    </div>
  );
}

/* ── Rows ─────────────────────────────────────────────────────────────────*/

const HEADINGS: Partial<Record<SuggestionRow["kind"], string>> = {
  recent: "Recent",
  trending: "Trending on campus",
  category: "Categories",
  listing: "Listings",
};

function GroupHeading({
  kind,
  onClear,
}: {
  kind: SuggestionRow["kind"];
  onClear?: () => void;
}) {
  const label = HEADINGS[kind];
  if (!label) return null;

  return (
    <div aria-hidden className="flex items-center justify-between px-2.5 pb-1 pt-3 first:pt-1.5">
      <span className="text-micro uppercase text-muted">{label}</span>
      {onClear && (
        <button
          type="button"
          /* Not in the roving index: clearing history is a rare, deliberate
             act and should not sit between two search results. */
          tabIndex={-1}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onClear}
          className="text-caption font-medium text-muted transition-colors hover:text-ink"
        >
          Clear
        </button>
      )}
    </div>
  );
}

function Row({
  row,
  active,
  query,
  onHover,
  onSelect,
  onRemove,
}: {
  row: SuggestionRow;
  active: boolean;
  query: string;
  onHover: () => void;
  onSelect: () => void;
  onRemove?: () => void;
}) {
  return (
    <div
      id={row.id}
      role="option"
      aria-selected={active}
      onMouseMove={onHover}
      /* `onMouseDown` + preventDefault, not `onClick`: the input's blur fires
         before click and would close the panel out from under the pointer. */
      onMouseDown={(event) => {
        event.preventDefault();
        onSelect();
      }}
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-sm px-2.5 py-2",
        "transition-colors duration-[--duration-fast]",
        active ? "bg-surface-2" : "hover:bg-surface-2/60"
      )}
    >
      <Leading row={row} />

      <span className="min-w-0 flex-1">
        <span className="block truncate text-body-sm text-ink">
          {row.kind === "listing" || row.kind === "all" ? (
            row.label
          ) : (
            <Highlight text={row.label} query={query} />
          )}
        </span>
        {row.meta && <span className="block truncate text-caption text-muted">{row.meta}</span>}
      </span>

      {row.price !== undefined && (
        <span className="shrink-0 text-body-sm tabular font-semibold text-ink">
          {formatPriceCompact(row.price)}
        </span>
      )}

      {onRemove && (
        <span
          role="button"
          tabIndex={-1}
          aria-label={`Remove ${row.label} from recent searches`}
          onMouseDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
            onRemove();
          }}
          /* Always visible, never hover-gated: there is no hover on touch, and
             a remove affordance you cannot reach on a phone is not one. */
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-surface-3 hover:text-ink"
        >
          <X size={iconSize.xs} strokeWidth={ICON_STROKE} />
        </span>
      )}

      {/* Only the highlighted row advertises Enter — showing it on every row
          would be noise, and showing it nowhere hides the shortcut. */}
      {active && !onRemove && (
        <CornerDownLeft
          size={iconSize.xs}
          strokeWidth={ICON_STROKE}
          className="shrink-0 text-muted"
          aria-hidden
        />
      )}
    </div>
  );
}

function Leading({ row }: { row: SuggestionRow }) {
  if (row.kind === "listing") {
    return row.image ? (
      <Image
        src={row.image}
        alt=""
        width={40}
        height={40}
        className="h-10 w-10 shrink-0 rounded-sm object-cover"
      />
    ) : (
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-sm bg-surface-2 text-faint">
        <ImageOff size={iconSize.md} strokeWidth={ICON_STROKE} />
      </span>
    );
  }

  if (row.kind === "category") {
    const CategoryIcon =
      row.Icon ?? CATEGORY_META[row.label as keyof typeof CATEGORY_META]?.Icon ?? Package;
    return (
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-surface-2 text-muted">
        <CategoryIcon size={iconSize.md} strokeWidth={ICON_STROKE} />
      </span>
    );
  }

  const Icon = row.kind === "recent" ? Clock : row.kind === "trending" ? TrendingUp : Search;

  return (
    <span className="grid h-9 w-9 shrink-0 place-items-center text-muted">
      <Icon size={iconSize.md} strokeWidth={ICON_STROKE} />
    </span>
  );
}

/** Bolds the typed portion so the match is visible without re-reading. */
function Highlight({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <>{text}</>;

  const at = text.toLowerCase().indexOf(trimmed.toLowerCase());
  if (at === -1) return <>{text}</>;

  return (
    <>
      {text.slice(0, at)}
      <span className="font-semibold text-ink">{text.slice(at, at + trimmed.length)}</span>
      {text.slice(at + trimmed.length)}
    </>
  );
}

function LoadingRows() {
  return (
    <li aria-hidden>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-3 px-2.5 py-2">
          <Skeleton className="h-10 w-10 shrink-0" rounded="rounded-sm" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="h-4 w-12 shrink-0" />
        </div>
      ))}
    </li>
  );
}
