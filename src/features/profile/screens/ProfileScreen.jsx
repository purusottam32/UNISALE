"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/features/auth/auth-context";
import { useUserListings } from "@/features/listings/hooks";
import ListingGrid from "@/features/listings/components/ListingGrid";
import { formatCampusLine, formatMemberSince } from "@/lib/format";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import Tabs from "@/components/ui/Tabs";
import TrustBadge from "@/components/ui/TrustBadge";
import { RatingStars } from "@/components/ui/Rating";
import { SettingsIcon } from "@/components/ui/icons";
import { usePendingReviews, useUserReviews } from "../hooks";
import PendingReviewPrompt from "../components/PendingReviewPrompt";
import ReviewList from "../components/ReviewList";
import TrustMeter from "../components/TrustMeter";
import { Handshake, PauseCircle, ShoppingBag } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/**
 * Your own profile — part storefront, part dashboard.
 *
 * Statuses are split into tabs rather than mixed together: an active listing
 * needs attention, a sold one is history, and a paused one is a decision the
 * seller left half-made.
 */
export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState(searchParams.get("tab") || "listings");

  const { listings, isLoading } = useUserListings(user?.id, { limit: 50 });
  const { reviews, distribution, totalItems: reviewCount } = useUserReviews(user?.id);
  const { pending } = usePendingReviews();

  const active = listings.filter((listing) => listing.status === "active");
  const sold = listings.filter((listing) => listing.status === "sold");
  const paused = listings.filter((listing) => listing.status === "paused");

  const changeTab = (value) => {
    setTab(value);
    router.replace(`/profile?tab=${value}`, { scroll: false });
  };

  const shown = tab === "sold" ? sold : tab === "paused" ? paused : active;

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar src={user?.avatar} name={user?.name} size="xl" />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">{user?.name}</h1>
            <p className="mt-0.5 text-sm text-muted">{formatCampusLine(user)}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <TrustBadge tier={user?.trustTier} isEmailVerified={user?.isEmailVerified} />
              {user?.ratingCount > 0 ? (
                <RatingStars value={user.ratingAverage} count={user.ratingCount} />
              ) : (
                <span className="text-xs text-muted">No ratings yet</span>
              )}
            </div>

            {user?.bio && <p className="mt-3 text-sm leading-relaxed text-ink-2">{user.bio}</p>}
          </div>

          <Button href="/settings" variant="secondary" size="sm">
            <SettingsIcon size={16} /> Edit profile
          </Button>
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-md bg-surface-2 py-3 text-center">
          <Stat value={active.length} label="Active" />
          <Stat value={sold.length} label="Sold" />
          <Stat value={reviewCount} label="Reviews" />
        </dl>

        <p className="mt-3 text-center text-xs text-muted">
          Member since {formatMemberSince(user?.createdAt)}
        </p>
      </header>

      {pending.length > 0 && <PendingReviewPrompt deals={pending} />}

      <TrustMeter user={user} />

      <Tabs
        value={tab}
        onChange={changeTab}
        tabs={[
          { value: "listings", label: "Active", count: active.length },
          { value: "sold", label: "Sold", count: sold.length },
          { value: "paused", label: "Paused", count: paused.length },
          { value: "reviews", label: "Reviews", count: reviewCount },
        ]}
      />

      {tab === "reviews" ? (
        <div className="space-y-4">
          {reviewCount > 0 && (
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-ink">
                    {Number(user?.ratingAverage || 0).toFixed(1)}
                  </p>
                  <p className="text-xs text-muted">{reviewCount} reviews</p>
                </div>
                <div className="flex-1">
                  <RatingBreakdownInline distribution={distribution} total={reviewCount} />
                </div>
              </div>
            </div>
          )}
          <ReviewList
            reviews={reviews}
            emptyMessage="Complete a deal and rate the other student — they'll be prompted to rate you back."
          />
        </div>
      ) : (
        <ListingGrid
          listings={shown}
          isLoading={isLoading}
          emptyState={
            <EmptyState
              icon={
                tab === "sold" ? (
                  <Handshake size={iconSize.xl} strokeWidth={ICON_STROKE} />
                ) : tab === "paused" ? (
                  <PauseCircle size={iconSize.xl} strokeWidth={ICON_STROKE} />
                ) : (
                  <ShoppingBag size={iconSize.xl} strokeWidth={ICON_STROKE} />
                )
              }
              title={
                tab === "sold"
                  ? "No completed deals yet"
                  : tab === "paused"
                    ? "Nothing paused"
                    : "You haven't listed anything"
              }
              description={
                tab === "listings"
                  ? "Everything you're not using this semester is worth something to someone two floors down."
                  : undefined
              }
              action={tab === "listings" ? { label: "List your first item", href: "/sell" } : undefined}
            />
          }
        />
      )}
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd>
        <span className="block text-lg font-bold text-ink">{value}</span>
        <span className="block text-[11px] text-muted">{label}</span>
      </dd>
    </div>
  );
}

function RatingBreakdownInline({ distribution, total }) {
  return (
    <div className="space-y-1">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution[star] || 0;
        return (
          <div key={star} className="flex items-center gap-2 text-[11px] text-muted">
            <span className="w-2 tabular-nums">{star}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-3">
              <span
                className="block h-full rounded-full bg-warn"
                style={{ width: `${total ? (count / total) * 100 : 0}%` }}
              />
            </span>
            <span className="w-5 text-right tabular-nums">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
