"use client";

import Link from "next/link";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { usePendingReviews } from "@/features/profile/hooks";
import { useSaveToggle } from "@/features/saved/hooks";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";
import { ArrowRightIcon, PlusIcon } from "@/components/ui/icons";
import { Sprout } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { useCampusFeed, useTrendingListings } from "../hooks";
import ProductCard from "../components/ProductCard";
import ListingGrid from "../components/ListingGrid";
import ProfileNudge from "./ProfileNudge";
import PendingReviewPrompt from "@/features/profile/components/PendingReviewPrompt";

/**
 * The campus home screen.
 *
 * Ordered by what a returning student needs first: anything waiting on them
 * (unrated deals, an incomplete profile), then what is moving right now
 * (trending), then the ranked feed to browse. Categories sit between the two
 * as the escape hatch for someone who arrived with a specific intent.
 */
export default function FeedScreen() {
  const { user } = useAuth();
  const { listings, totalItems, isLoading, hasMore, loadMore, isFetchingMore, error, refetch } =
    useCampusFeed();
  const { listings: trending, isLoading: trendingLoading } = useTrendingListings({ limit: 10 });
  const { pending } = usePendingReviews();
  const { isSaved, toggle, isPending } = useSaveToggle();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-md text-ink">Hey {firstName}</h1>
          <p className="mt-1.5 text-body-sm text-muted">
            {user?.college ? `What's moving at ${user.college} today` : "What's moving on campus today"}
          </p>
        </div>

        <Button href="/sell" className="hidden lg:inline-flex">
          <PlusIcon size={17} /> Sell an item
        </Button>
      </header>

      {pending.length > 0 && <PendingReviewPrompt deals={pending} />}
      <ProfileNudge user={user} />

      <section>
        {/* Chips, not bordered tiles. Ten outlined boxes in a row read as ten
            competing objects; a chip rail reads as one control — and it is the
            same rail idiom `FilterBar` already uses one route away.

            Hover shifts the label rather than filling the chip with brand-tint:
            at 14% alpha over `surface` that fill was nearly invisible anyway,
            and painting a non-button with the accent breaks the colour rule. */}
        <div className="rail rail-bleed gap-2">
          {LISTING_CATEGORIES.map((category) => {
            const { Icon } = CATEGORY_META[category];
            return (
              <Link
                key={category}
                href={`/explore?category=${encodeURIComponent(category)}`}
                className="group inline-flex h-9 items-center gap-2 rounded-full bg-surface px-3.5 text-body-sm text-ink-2 shadow-e1 transition-colors duration-[--duration-fast] hover:bg-surface-2 hover:text-ink"
              >
                <Icon
                  size={iconSize.xs}
                  strokeWidth={ICON_STROKE}
                  aria-hidden
                  className="text-muted transition-colors duration-[--duration-fast] group-hover:text-ink-2"
                />
                {category}
              </Link>
            );
          })}
        </div>
      </section>

      {(trendingLoading || trending.length > 0) && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-title text-ink">Moving fast on campus</h2>
            <Link
              href="/explore?sort=views%3Adesc"
              className="group inline-flex items-center gap-1.5 text-body-sm font-medium text-muted transition-colors duration-[--duration-fast] hover:text-ink"
            >
              See all
              <ArrowRightIcon
                size={15}
                className="transition-transform duration-[--duration-fast] group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* `gap-3` is not optional: `rail` sets `display:flex` but declares no
              gap, so without it the 168px cards butt edge to edge and two
              listings read as one. */}
          <div className="rail -mx-4 gap-3 px-4 md:mx-0 md:px-0">
            {trendingLoading
              ? /* The composed skeleton, not a bare block: it mirrors the card's
                   photo plus three text rows, so nothing shifts on arrival. */
                Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="w-[168px]">
                    <ProductCardSkeleton />
                  </div>
                ))
              : trending.map((listing) => (
                  <div key={listing._id} className="w-[168px]">
                    <ProductCard
                      listing={listing}
                      isSaved={isSaved(listing._id)}
                      onToggleSave={toggle}
                      savePending={isPending}
                    />
                  </div>
                ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-title text-ink">For you</h2>
          <Link
            href="/explore"
            className="text-body-sm font-medium text-muted transition-colors duration-[--duration-fast] hover:text-ink"
          >
            Browse all
          </Link>
        </div>

        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isFetchingMore={isFetchingMore}
          error={error}
          onRetry={refetch}
          emptyState={
            <EmptyState
              icon={<Sprout size={iconSize.xl} strokeWidth={ICON_STROKE} />}
              title={
                totalItems === 0 && user?.college
                  ? `${user.college} is just getting started`
                  : "Nothing here yet"
              }
              description="Be the first to list something. Early sellers get the whole campus to themselves — and the first listings are what pull everyone else in."
              action={{ label: "List your first item", href: "/sell" }}
              secondaryAction={{ label: "Browse other colleges", href: "/explore?all=1" }}
            />
          }
        />
      </section>
    </div>
  );
}
