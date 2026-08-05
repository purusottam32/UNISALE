"use client";

import { useState } from "react";
import { cn } from "./cn";
import { StarIcon } from "./icons";

/** Read-only star row with an optional "(12)" count. */
export function RatingStars({ value = 0, count, size = 14, showValue = true, className }) {
  const rounded = Math.round(Number(value) * 2) / 2;

  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span className="flex text-warn" aria-hidden>
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon key={star} size={size} filled={star <= rounded} />
        ))}
      </span>
      {showValue && (
        <span className="text-xs font-semibold text-ink-2">
          {Number(value).toFixed(1)}
          {count !== undefined && <span className="font-normal text-muted"> ({count})</span>}
        </span>
      )}
      <span className="sr">
        Rated {Number(value).toFixed(1)} out of 5{count !== undefined ? ` from ${count} reviews` : ""}
      </span>
    </span>
  );
}

/** Interactive 1-5 picker used in the review sheet. */
export function RatingInput({ value = 0, onChange, size = 34 }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const labels = ["Poor", "Not great", "Okay", "Good", "Excellent"];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="flex gap-1.5"
        role="radiogroup"
        aria-label="Rating"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} star${star > 1 ? "s" : ""}`}
            onMouseEnter={() => setHovered(star)}
            onFocus={() => setHovered(star)}
            onClick={() => onChange(star)}
            className={cn(
              "rounded transition-transform duration-100",
              star <= active ? "text-warn" : "text-line-strong",
              star <= active && "scale-105"
            )}
          >
            <StarIcon size={size} filled={star <= active} />
          </button>
        ))}
      </div>
      <p className="h-5 text-sm font-medium text-ink-2">{active ? labels[active - 1] : ""}</p>
    </div>
  );
}

/** 5→1 histogram shown on profiles. */
export function RatingBreakdown({ distribution = {}, total = 0 }) {
  return (
    <div className="space-y-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] || 0;
        const percent = total ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs text-muted">
            <span className="w-3 tabular-nums">{star}</span>
            <StarIcon size={11} filled />
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <span
                className="block h-full rounded-full bg-warn transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </span>
            <span className="w-6 text-right tabular-nums">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
