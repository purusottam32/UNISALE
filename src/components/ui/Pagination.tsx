"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Numbered pagination.
 *
 * The listing grid uses infinite scroll — this exists for surfaces where a
 * user needs to *return* to a known position: order history, admin queues,
 * search results deep-linked from elsewhere. Infinite scroll cannot be
 * bookmarked; pagination can.
 *
 * The window always renders the same number of slots so the control never
 * changes width as you page through it.
 */
function buildPages(current: number, total: number): (number | "gap")[] {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, "gap", total];
  if (current >= total - 3) return [1, "gap", total - 4, total - 3, total - 2, total - 1, total];

  return [1, "gap", current - 1, current, current + 1, "gap", total];
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  className,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
      <Arrow
        direction="prev"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      />

      {pages.map((entry, index) =>
        entry === "gap" ? (
          <span
            key={`gap-${index}`}
            aria-hidden
            className="grid h-10 w-10 place-items-center text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={entry}
            type="button"
            aria-label={`Page ${entry}`}
            aria-current={entry === page ? "page" : undefined}
            onClick={() => onChange(entry)}
            className={cn(
              "grid h-10 w-10 place-items-center rounded-sm text-body-sm tabular",
              "transition-colors duration-[--duration-fast]",
              entry === page
                ? "bg-brand font-semibold text-brand-fg"
                : "text-ink-2 hover:bg-surface-2 hover:text-ink"
            )}
          >
            {entry}
          </button>
        )
      )}

      <Arrow
        direction="next"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      />
    </nav>
  );
}

function Arrow({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "prev" ? "Previous page" : "Next page"}
      className={cn(
        "grid h-10 w-10 place-items-center rounded-sm text-ink-2",
        "transition-colors duration-[--duration-fast] hover:bg-surface-2 hover:text-ink",
        "disabled:pointer-events-none disabled:opacity-35"
      )}
    >
      <Icon size={iconSize.lg} strokeWidth={ICON_STROKE} />
    </button>
  );
}

/**
 * The infinite-scroll counterpart. Always rendered alongside the intersection
 * sentinel, never instead of it — if IntersectionObserver never fires
 * (keyboard-only, reduced motion, an unsupported browser) this button is the
 * only way to reach the rest of the list.
 */
export function LoadMore({
  hasMore,
  loading,
  onLoadMore,
  total,
  shown,
}: {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
  total?: number;
  shown?: number;
}) {
  if (!hasMore) {
    return total !== undefined && total > 0 ? (
      <p className="py-8 text-center text-body-sm text-muted">
        That&apos;s everything — {total} {total === 1 ? "listing" : "listings"}.
      </p>
    ) : null;
  }

  return (
    <div className="flex flex-col items-center gap-2 py-8">
      {shown !== undefined && total !== undefined && (
        <p className="text-caption tabular text-muted" aria-live="polite">
          Showing {shown} of {total}
        </p>
      )}
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loading}
        className={cn(
          "h-11 rounded-md bg-surface px-6 text-button text-ink shadow-e1",
          "transition-colors duration-[--duration-fast] hover:bg-surface-2",
          "disabled:opacity-60"
        )}
      >
        {loading ? "Loading…" : "Load more"}
      </button>
    </div>
  );
}
