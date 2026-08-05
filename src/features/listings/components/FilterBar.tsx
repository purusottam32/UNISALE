"use client";

import { SlidersHorizontal } from "lucide-react";
import {
  CATEGORY_META,
  LISTING_CATEGORIES,
  SORT_OPTIONS,
  formatCondition,
  formatScope,
  formatType,
} from "@/config/catalog";
import { formatCount } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Chip from "@/components/ui/Chip";
import { EMPTY_FILTERS, countActiveFilters, type Filters } from "./FilterPanel";

/**
 * The always-visible filter layer above the grid.
 *
 * Three jobs, in priority order:
 *   1. one-tap category switching — the most common filter by a wide margin,
 *      so it never goes behind a panel
 *   2. a live result count, announced politely, so the grid's size is known
 *      before you scroll it
 *   3. applied filters as individually removable pills
 *
 * (3) is the one that matters most. It is what prevents the "why are there no
 * results?" dead end — the cause is on screen and one tap from gone. Hiding
 * applied filters inside a panel is, per Baymard, a direct cause of
 * abandonment.
 */

/** How each filter reads as a pill. */
const PILL_LABEL: Partial<Record<keyof Filters, (value: string) => string>> = {
  category: (value) => value,
  condition: (value) => formatCondition(value),
  type: (value) => formatType(value),
  locationScope: (value) => formatScope(value),
  minPrice: (value) => `From ₹${value}`,
  maxPrice: (value) => `Up to ₹${value}`,
  allColleges: () => "All colleges",
  sort: (value) => SORT_OPTIONS.find((option) => option.value === value)?.label ?? value,
};

export interface FilterBarProps {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onOpenFilters: () => void;
  totalItems: number;
  isLoading?: boolean;
}

export default function FilterBar({
  filters,
  onChange,
  onOpenFilters,
  totalItems,
  isLoading,
}: FilterBarProps) {
  const activeCount = countActiveFilters(filters);

  const pills = (Object.entries(filters) as [keyof Filters, string | boolean][]).filter(
    ([key, value]) => {
      if (key === "sort") return Boolean(value) && value !== EMPTY_FILTERS.sort;
      if (key === "allColleges") return value === true;
      return Boolean(value);
    }
  );

  return (
    <div className="space-y-3">
      <div className="rail rail-bleed gap-2">
        <Chip active={!filters.category} onClick={() => onChange({ category: "" })}>
          All
        </Chip>
        {LISTING_CATEGORIES.map((category) => (
          <Chip
            key={category}
            active={filters.category === category}
            icon={<span aria-hidden>{CATEGORY_META[category].emoji}</span>}
            onClick={() =>
              onChange({ category: filters.category === category ? "" : category })
            }
          >
            {category}
          </Chip>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenFilters}
          className={cn(
            "inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3.5",
            "bg-surface text-body-sm font-semibold text-ink shadow-e1",
            "transition-colors duration-[--duration-fast] hover:bg-surface-2",
            "active:scale-[0.97]"
          )}
        >
          <SlidersHorizontal size={iconSize.sm} strokeWidth={ICON_STROKE} />
          Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-[0.625rem] tabular text-brand-fg">
              {activeCount}
            </span>
          )}
        </button>

        {/* `aria-live` so a screen-reader user hears the count change when a
            filter is applied, rather than having to go looking for it. */}
        <p className="text-body-sm text-muted" aria-live="polite" aria-atomic="true">
          {isLoading
            ? "Loading…"
            : `${formatCount(totalItems)} ${totalItems === 1 ? "item" : "items"}`}
        </p>
      </div>

      {pills.length > 0 && (
        <div className="rail rail-bleed gap-2">
          {pills.map(([key, value]) => (
            <Chip
              key={key}
              active
              onClick={() => onChange({ [key]: EMPTY_FILTERS[key] } as Partial<Filters>)}
              onRemove={() => onChange({ [key]: EMPTY_FILTERS[key] } as Partial<Filters>)}
            >
              {PILL_LABEL[key]?.(String(value)) ?? String(value)}
            </Chip>
          ))}

          <button
            type="button"
            onClick={() => onChange(EMPTY_FILTERS)}
            className="h-9 shrink-0 px-2 text-body-sm font-semibold text-brand"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
