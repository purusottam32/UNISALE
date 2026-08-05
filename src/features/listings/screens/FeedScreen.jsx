"use client";

import Link from "next/link";
import { CATEGORY_META, LISTING_CATEGORIES } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { usePendingReviews } from "@/features/profile/hooks";
import { useSaveToggle } from "@/features/saved/hooks";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import Skeleton from "@/components/ui/Skeleton";
import { ArrowRightIcon, PlusIcon, SparkleIcon } from "@/components/ui/icons";
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
  const { listings, totalItems, isLoading, hasMore, loadMore, isFetchingMore } = useCampusFeed();
  const { listings: trending, isLoading: trendingLoading } = useTrendingListings({ limit: 10 });
  const { pending } = usePendingReviews();
  const { isSaved, toggle, isPending } = useSaveToggle();

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-[-0.02em] text-ink">
            Hey {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-muted">
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
        <div className="rail -mx-4 px-4 md:mx-0 md:px-0">
          {LISTING_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/explore?category=${encodeURIComponent(category)}`}
              className="flex w-[92px] flex-col items-center gap-2 rounded-lg border border-line bg-surface px-2 py-3 text-center transition-colors hover:border-brand hover:bg-brand-tint"
            >
              <span className="text-2xl" aria-hidden>
                {CATEGORY_META[category]?.emoji}
              </span>
              <span className="text-[11px] font-semibold leading-tight text-ink-2">{category}</span>
            </Link>
          ))}
        </div>
      </section>

      {(trendingLoading || trending.length > 0) && (
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="text-warn">
                <SparkleIcon size={17} />
              </span>
              Moving fast on campus
            </h2>
            <Link
              href="/explore?sort=views%3Adesc"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
            >
              See all <ArrowRightIcon size={15} />
            </Link>
          </div>

          <div className="rail -mx-4 px-4 md:mx-0 md:px-0">
            {trendingLoading
              ? Array.from({ length: 4 }, (_, index) => (
                  <Skeleton key={index} className="h-[248px] w-[168px]" rounded="rounded-lg" />
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
          <h2 className="text-lg font-bold text-ink">For you</h2>
          <Link href="/explore" className="text-sm font-semibold text-brand">
            Browse all
          </Link>
        </div>

        <ListingGrid
          listings={listings}
          isLoading={isLoading}
          hasMore={hasMore}
          onLoadMore={loadMore}
          isFetchingMore={isFetchingMore}
          emptyState={
            <EmptyState
              glyph="🌱"
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
