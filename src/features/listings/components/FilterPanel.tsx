"use client";

import { useEffect, useState } from "react";
import {
  CATEGORY_META,
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
  LOCATION_SCOPES,
  PRICE_BANDS,
  SORT_OPTIONS,
} from "@/config/catalog";
import { formatCount } from "@/lib/format";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import Chip from "@/components/ui/Chip";
import { Input } from "@/components/ui/Field";

/**
 * All filters in one panel.
 *
 * ── Draft and apply, not live ────────────────────────────────────────────
 * Changes accumulate locally and commit on "Show results". Filtering live
 * would reshuffle the grid underneath a user who is still deciding, and on a
 * slow campus connection it fires a request per tap. The trade is one extra
 * tap for a result set that never moves unexpectedly.
 *
 * ── Baymard's three rules ────────────────────────────────────────────────
 * From their product-list research (35 filtering-specific guidelines):
 *   1. every attribute shown on a card must be filterable — ours are
 *      condition, price, category and campus, and all four are here
 *   2. applied filters must be visible and individually removable — that is
 *      `<FilterBar>`, which renders them as pills on the results page
 *   3. show the result count before applying, so a filter never leads to a
 *      dead end — `resultCount` below
 */

export interface Filters {
  category: string;
  condition: string;
  type: string;
  locationScope: string;
  minPrice: string | number;
  maxPrice: string | number;
  sort: string;
  allColleges: boolean;
}

export const EMPTY_FILTERS: Filters = {
  category: "",
  condition: "",
  type: "",
  locationScope: "",
  minPrice: "",
  maxPrice: "",
  sort: "createdAt:desc",
  allColleges: false,
};

export const countActiveFilters = (filters: Partial<Filters> = {}) =>
  (Object.entries(filters) as [keyof Filters, unknown][]).filter(([key, value]) => {
    if (key === "sort") return Boolean(value) && value !== EMPTY_FILTERS.sort;
    if (key === "allColleges") return value === true;
    return Boolean(value);
  }).length;

export interface FilterPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: Filters;
  onApply: (filters: Filters) => void;
  /** Live total for the *draft* filters, so the CTA can promise a number. */
  resultCount?: number;
  isCounting?: boolean;
}

export default function FilterPanel({
  open,
  onOpenChange,
  filters,
  onApply,
  resultCount,
  isCounting,
}: FilterPanelProps) {
  const [draft, setDraft] = useState<Filters>(filters);

  // Re-sync each time it opens: the user may have removed a pill on the
  // results page since the panel was last closed.
  useEffect(() => {
    if (open) setDraft(filters);
  }, [open, filters]);

  const set = (patch: Partial<Filters>) => setDraft((current) => ({ ...current, ...patch }));

  /** Chips toggle: tapping the active option clears it rather than no-op. */
  const toggle = (key: keyof Filters, value: string) =>
    set({ [key]: draft[key] === value ? "" : value } as Partial<Filters>);

  const bandActive = (band: (typeof PRICE_BANDS)[number]) =>
    String(draft.minPrice) === String(band.minPrice ?? "") &&
    String(draft.maxPrice) === String(band.maxPrice ?? "");

  const activeCount = countActiveFilters(draft);

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title="Filters"
      description="Narrow down to what you actually want"
      size="md"
      footer={
        <>
          <Button
            variant="secondary"
            block
            disabled={activeCount === 0}
            onClick={() => setDraft(EMPTY_FILTERS)}
          >
            Clear all
          </Button>
          <Button
            block
            onClick={() => {
              onApply(draft);
              onOpenChange(false);
            }}
          >
            {isCounting
              ? "Show results"
              : resultCount === undefined
                ? "Show results"
                : `Show ${formatCount(resultCount)} ${resultCount === 1 ? "item" : "items"}`}
          </Button>
        </>
      }
    >
      <div className="space-y-7 pt-1">
        <Group label="Sort by">
          <Wrap>
            {SORT_OPTIONS.map((option) => (
              <Chip
                key={option.value}
                active={draft.sort === option.value}
                onClick={() => set({ sort: option.value })}
              >
                {option.label}
              </Chip>
            ))}
          </Wrap>
        </Group>

        <Group label="Category">
          <Wrap>
            {LISTING_CATEGORIES.map((category) => {
              const { Icon } = CATEGORY_META[category];
              return (
                <Chip
                  key={category}
                  active={draft.category === category}
                  icon={<Icon size={iconSize.xs} strokeWidth={ICON_STROKE} aria-hidden />}
                  onClick={() => toggle("category", category)}
                >
                  {category}
                </Chip>
              );
            })}
          </Wrap>
        </Group>

        <Group label="Price">
          <Wrap>
            {PRICE_BANDS.map((band) => (
              <Chip
                key={band.label}
                active={bandActive(band)}
                onClick={() =>
                  set(
                    bandActive(band)
                      ? { minPrice: "", maxPrice: "" }
                      : { minPrice: band.minPrice ?? "", maxPrice: band.maxPrice ?? "" }
                  )
                }
              >
                {band.label}
              </Chip>
            ))}
          </Wrap>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Min"
              leading="₹"
              aria-label="Minimum price"
              value={draft.minPrice}
              onChange={(event) => set({ minPrice: event.target.value })}
            />
            <Input
              type="number"
              min="0"
              inputMode="numeric"
              placeholder="Max"
              leading="₹"
              aria-label="Maximum price"
              value={draft.maxPrice}
              onChange={(event) => set({ maxPrice: event.target.value })}
            />
          </div>
        </Group>

        <Group label="Condition">
          <Wrap>
            {LISTING_CONDITIONS.map((condition) => (
              <Chip
                key={condition.value}
                active={draft.condition === condition.value}
                onClick={() => toggle("condition", condition.value)}
              >
                {condition.label}
              </Chip>
            ))}
          </Wrap>
        </Group>

        <Group label="Listing type">
          <Wrap>
            {LISTING_TYPES.map((type) => (
              <Chip
                key={type.value}
                active={draft.type === type.value}
                onClick={() => toggle("type", type.value)}
              >
                {type.label}
              </Chip>
            ))}
          </Wrap>
        </Group>

        <Group label="Meet-up">
          <Wrap>
            {LOCATION_SCOPES.map((scope) => (
              <Chip
                key={scope.value}
                active={draft.locationScope === scope.value}
                onClick={() => toggle("locationScope", scope.value)}
              >
                {scope.label}
              </Chip>
            ))}
          </Wrap>
        </Group>

        <Group
          label="Reach"
          hint="Campus-only keeps every deal to someone you can meet between classes."
        >
          <Wrap>
            <Chip active={!draft.allColleges} onClick={() => set({ allColleges: false })}>
              My campus only
            </Chip>
            <Chip active={draft.allColleges} onClick={() => set({ allColleges: true })}>
              All colleges
            </Chip>
          </Wrap>
        </Group>
      </div>
    </Drawer>
  );
}

function Group({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2.5 text-body-sm font-semibold text-ink">{label}</h3>
      {children}
      {hint && <p className="mt-2 text-caption text-muted">{hint}</p>}
    </section>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
