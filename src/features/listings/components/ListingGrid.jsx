"use client";

import { useEffect, useRef } from "react";
import { useSaveToggle } from "@/features/saved/hooks";
import Button from "@/components/ui/Button";
import { ProductGridSkeleton } from "@/components/ui/Skeleton";
import { ErrorState } from "@/components/ui/States";
import ProductCard from "./ProductCard";

/**
 * Responsive listing grid with infinite scroll.
 *
 * Two columns on phones is deliberate: a single wide column shows too few items
 * per screen for browsing to feel productive, and every major marketplace
 * settles on two.
 *
 * An explicit "Load more" button sits under the sentinel so the list stays
 * reachable when IntersectionObserver never fires — keyboard users, reduced
 * motion, and any browser where the observer is unavailable.
 */
export default function ListingGrid({
  listings,
  isLoading,
  hasMore,
  onLoadMore,
  isFetchingMore,
  emptyState,
  /**
   * Error message from the query, if any. Without this the grid could only
   * distinguish "loading" from "no results", so an API outage rendered
   * "your campus has nothing yet" — telling every user on a broken deploy that
   * the marketplace is empty, which is both wrong and unrecoverable from.
   */
  error,
  onRetry,
  skeletonCount = 8,
}) {
  const { isSaved, toggle, isPending } = useSaveToggle();
  const sentinelRef = useRef(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || !onLoadMore) return undefined;
    if (typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) onLoadMore();
      },
      // Start fetching a screen early so the grid never visibly runs dry.
      { rootMargin: "600px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, onLoadMore, isFetchingMore]);

  if (isLoading) return <ProductGridSkeleton count={skeletonCount} />;

  /* Error before empty: an outage is not an empty campus. */
  if (error && (!listings || listings.length === 0)) {
    return (
      <ErrorState
        description={error}
        onRetry={onRetry}
        offline={typeof navigator !== "undefined" && navigator.onLine === false}
      />
    );
  }

  if (!listings || listings.length === 0) return emptyState || null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        {listings.map((listing, index) => (
          <ProductCard
            key={listing._id}
            listing={listing}
            priority={index < 4}
            isSaved={isSaved(listing._id)}
            onToggleSave={toggle}
            savePending={isPending}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={sentinelRef} className="flex justify-center py-8">
          <Button variant="secondary" onClick={onLoadMore} loading={isFetchingMore}>
            {isFetchingMore ? "Loading" : "Load more"}
          </Button>
        </div>
      )}
    </>
  );
}
