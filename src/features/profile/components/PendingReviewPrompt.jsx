"use client";

import { useState } from "react";
import Image from "next/image";
import { StarIcon } from "@/components/ui/icons";
import ReviewSheet from "./ReviewSheet";

/**
 * Surfaces deals the user closed but never rated.
 *
 * Ratings are the trust engine, and nobody navigates to a rating form on their
 * own — asking at the top of the feed, where they already are, is what makes
 * the review system produce data instead of empty profiles.
 */
export default function PendingReviewPrompt({ deals = [] }) {
  const [activeDeal, setActiveDeal] = useState(null);

  if (deals.length === 0) return null;

  const [first] = deals;

  return (
    <>
      <section className="rounded-lg border border-line bg-warn-tint p-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-ink">
          <span className="text-warn">
            <StarIcon size={16} filled />
          </span>
          Rate your recent {deals.length === 1 ? "deal" : "deals"}
        </h2>

        <div className="mt-3 space-y-2">
          {deals.slice(0, 3).map((deal) => (
            <button
              key={deal.listingId}
              type="button"
              onClick={() => setActiveDeal(deal)}
              className="flex w-full items-center gap-3 rounded-md bg-surface p-2.5 text-left transition-colors hover:bg-surface-2"
            >
              {deal.image ? (
                <Image
                  src={deal.image}
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 shrink-0 rounded-md object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-surface-3 text-lg">
                  📦
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">{deal.title}</span>
                <span className="block truncate text-xs text-muted">
                  {deal.yourRole === "seller" ? "Sold to" : "Bought from"}{" "}
                  {deal.counterparty?.name || "a student"}
                </span>
              </span>

              <span className="shrink-0 text-xs font-semibold text-brand">Rate</span>
            </button>
          ))}
        </div>

        {deals.length > 3 && (
          <p className="mt-2 text-xs text-muted">
            +{deals.length - 3} more waiting for a rating.
          </p>
        )}
      </section>

      <ReviewSheet
        open={Boolean(activeDeal)}
        deal={activeDeal || first}
        onClose={() => setActiveDeal(null)}
      />
    </>
  );
}
