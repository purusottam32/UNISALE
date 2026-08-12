"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/features/auth/auth-context";
import { useStartConversation } from "@/features/chat/hooks";
import { useUserListings } from "@/features/listings/hooks";
import ListingGrid from "@/features/listings/components/ListingGrid";
import ReportSheet from "@/features/listings/components/ReportSheet";
import { formatCampusLine, formatMemberSince } from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import Skeleton from "@/components/ui/Skeleton";
import Tabs from "@/components/ui/Tabs";
import TrustBadge from "@/components/ui/TrustBadge";
import { RatingStars } from "@/components/ui/Rating";
import { ChevronLeftIcon, FlagIcon } from "@/components/ui/icons";
import { usePublicProfile, useReportUser, useUserReviews } from "../hooks";
import ReviewList from "../components/ReviewList";
import { FilterX, Ghost } from "lucide-react";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";

/** Another student's storefront: what they're selling and whether to trust them. */
export default function PublicProfileScreen({ userId }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { profile, isLoading, error } = usePublicProfile(userId);
  const { listings, isLoading: listingsLoading } = useUserListings(userId, { limit: 50 });
  const { reviews, totalItems: reviewCount } = useUserReviews(userId);
  const startConversation = useStartConversation();
  const reportUser = useReportUser();

  const [tab, setTab] = useState("listings");
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" rounded="rounded-lg" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <EmptyState
        icon={<Ghost size={iconSize.xl} strokeWidth={ICON_STROKE} />}
        title="Profile not found"
        description={error || "This student may have left UniSale."}
        action={{ label: "Back to explore", href: "/explore" }}
      />
    );
  }

  const isMe = String(profile.id) === String(user?.id);
  const active = listings.filter((listing) => listing.status === "active");

  const message = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/u/${userId}`)}`);
      return;
    }
    try {
      const conversation = await startConversation.mutateAsync({ sellerId: userId });
      router.push(`/messages/${conversation._id}`);
    } catch (caught) {
      toast.error(getErrorMessage(caught, "Could not open that chat."));
    }
  };

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-1 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <ChevronLeftIcon size={17} /> Back
      </button>

      <header className="rounded-lg border border-line bg-surface p-5">
        <div className="flex flex-wrap items-start gap-4">
          <Avatar src={profile.avatar} name={profile.name} size="xl" />

          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-extrabold tracking-[-0.02em] text-ink">{profile.name}</h1>
            <p className="mt-0.5 text-sm text-muted">{formatCampusLine(profile)}</p>

            <div className="mt-2.5 flex flex-wrap items-center gap-2.5">
              <TrustBadge tier={profile.trustTier} isEmailVerified={profile.isEmailVerified} />
              {profile.ratingCount > 0 ? (
                <RatingStars value={profile.ratingAverage} count={profile.ratingCount} />
              ) : (
                <span className="text-xs text-muted">No ratings yet</span>
              )}
            </div>

            {profile.bio && <p className="mt-3 text-sm leading-relaxed text-ink-2">{profile.bio}</p>}

            {profile.responsiveness?.label && (
              <p className="mt-2 text-xs font-medium text-success">
                {profile.responsiveness.label}
              </p>
            )}
          </div>

          {!isMe && (
            <div className="flex gap-2">
              <Button size="sm" loading={startConversation.isPending} onClick={message}>
                Message
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Report this student"
                onClick={() => setReportOpen(true)}
              >
                <FlagIcon size={16} />
              </Button>
            </div>
          )}
        </div>

        <dl className="mt-5 grid grid-cols-3 divide-x divide-line rounded-md bg-surface-2 py-3 text-center">
          <Stat value={profile.activeListings ?? active.length} label="Listing" plural="Listings" />
          <Stat value={profile.soldListings ?? 0} label="Deal" plural="Deals" />
          <Stat value={profile.ratingCount ?? 0} label="Review" plural="Reviews" />
        </dl>

        <p className="mt-3 text-center text-xs text-muted">
          Member since {formatMemberSince(profile.memberSince)}
        </p>
      </header>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { value: "listings", label: "Listings", count: active.length },
          { value: "reviews", label: "Reviews", count: reviewCount },
        ]}
      />

      {tab === "listings" ? (
        <ListingGrid
          listings={active}
          isLoading={listingsLoading}
          emptyState={
            <EmptyState
              icon={<FilterX size={iconSize.xl} strokeWidth={ICON_STROKE} />}
              title={`${profile.name.split(" ")[0]} has nothing listed right now`}
              description="Check back later, or message them about something specific."
            />
          }
        />
      ) : (
        <ReviewList
          reviews={reviews}
          emptyMessage={`${profile.name.split(" ")[0]} hasn't been rated yet.`}
        />
      )}

      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetLabel="student"
        isPending={reportUser.isPending}
        onSubmit={(reason) => reportUser.mutateAsync({ userId, reason })}
      />
    </div>
  );
}

function Stat({ value, label, plural }) {
  return (
    <div>
      <dt className="sr-only">{plural}</dt>
      <dd>
        <span className="block text-lg font-bold text-ink">{value}</span>
        <span className="block text-[11px] text-muted">{value === 1 ? label : plural}</span>
      </dd>
    </div>
  );
}
