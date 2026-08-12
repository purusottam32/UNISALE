"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { formatCondition, formatScope, formatType } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { useStartConversation } from "@/features/chat/hooks";
import { useSaveToggle } from "@/features/saved/hooks";
import {
  formatPrice,
  formatRelativeTime,
  getDiscountPercent,
} from "@/lib/format";
import { getErrorMessage } from "@/lib/errors";
import { ICON_STROKE, iconSize } from "@/lib/design-tokens";
import { PackageX } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/States";
import { cn } from "@/lib/cn";
import {
  ChevronLeftIcon,
  EyeIcon,
  FlagIcon,
  HeartIcon,
  MapPinIcon,
  ShareIcon,
  TagIcon,
} from "@/components/ui/icons";
import { useListing, useReportListing, useSimilarListings } from "../hooks";
import ListingGallery from "../components/ListingGallery";
import ProductCard from "../components/ProductCard";
import ReportSheet from "../components/ReportSheet";
import SafetyNote from "../components/SafetyNote";
import SellerCard from "../components/SellerCard";
import OwnerControls from "../components/OwnerControls";

/**
 * Listing detail.
 *
 * Desktop is a two-column layout with a sticky right rail so "Message seller"
 * is on screen no matter how far down the description runs. Mobile keeps the
 * same CTA pinned above the tab bar, which is the single most important
 * conversion surface in the product.
 */
export default function ListingDetailScreen({ listingId, initialData }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { listing, isLoading, error } = useListing(listingId, { initialData });
  const { listings: similar } = useSimilarListings(listingId);
  const { isSaved, toggle, isPending: savePending } = useSaveToggle();
  const startConversation = useStartConversation();
  const reportListing = useReportListing();
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) return <DetailSkeleton />;

  if (error || !listing) {
    /* Uses the shared EmptyState rather than a hand-rolled block, so the
       "listing is gone" case matches every other dead end in the app. */
    return (
      <EmptyState
        icon={<PackageX size={iconSize.xl} strokeWidth={ICON_STROKE} />}
        title="This listing is gone"
        description={error || "It may have sold or been removed."}
        action={{ label: "Browse other listings", href: "/explore" }}
      />
    );
  }

  const sellerId = listing.seller?._id || listing.seller;
  const isOwner = String(sellerId) === String(user?.id);
  const saved = isSaved(listing._id);
  const discount = getDiscountPercent(listing.price, listing.originalPrice);
  const isSold = listing.status === "sold";

  const messageSeller = async () => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(`/listings/${listing._id}`)}`);
      return;
    }

    try {
      const conversation = await startConversation.mutateAsync({
        sellerId,
        listingId: listing._id,
      });
      router.push(`/messages/${conversation._id}`);
    } catch (caught) {
      toast.error(getErrorMessage(caught, "Could not open that chat."));
    }
  };

  const share = async () => {
    const url = window.location.href;
    const payload = { title: listing.title, text: `${listing.title} on UniSale`, url };

    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        // User cancelled the share sheet — fall through to copying instead.
      }
    }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied.");
  };

  return (
    <div className="space-y-8">
      <button
        type="button"
        onClick={() => router.back()}
        className="-ml-1 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-ink"
      >
        <ChevronLeftIcon size={17} /> Back
      </button>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="space-y-6">
          <ListingGallery images={listing.images} title={listing.title} />

          <section>
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral">{listing.category}</Badge>
              <Badge tone="brand">{formatCondition(listing.condition)}</Badge>
              {listing.type !== "sale" && <Badge tone="info">{formatType(listing.type)}</Badge>}
              {isSold && <Badge tone="danger">Sold</Badge>}
            </div>

            <h1 className="mt-4 text-headline text-ink">{listing.title}</h1>

            <div className="mt-3 flex flex-wrap items-baseline gap-2.5">
              {/* The price scale, paired with `.tabular` — a price that reflows
                  as digits change is the detail that reads as amateur. */}
              <span className="text-price-lg tabular text-ink">
                {listing.type === "giveaway" ? "Free" : formatPrice(listing.price)}
              </span>
              {listing.originalPrice > listing.price && (
                <>
                  <span className="text-body tabular text-muted line-through">
                    {formatPrice(listing.originalPrice)}
                  </span>
                  <Badge tone="neutral">{discount}% off</Badge>
                </>
              )}
              {listing.isNegotiable && listing.type === "sale" && (
                <span className="text-body-sm text-muted">· Negotiable</span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-caption text-muted">
              <span className="inline-flex items-center gap-1">
                <MapPinIcon /> {listing.college}
              </span>
              <span className="inline-flex items-center gap-1">
                <TagIcon /> {formatScope(listing.locationScope)}
              </span>
              <span className="inline-flex items-center gap-1">
                <EyeIcon /> {listing.views || 0} views
              </span>
              <span>Listed {formatRelativeTime(listing.createdAt)}</span>
            </div>
          </section>

          <section>
            <h2 className="text-micro uppercase text-muted">Description</h2>
            <p className="mt-2.5 whitespace-pre-line text-body leading-relaxed text-ink-2">
              {listing.description}
            </p>
          </section>

          {listing.meetupHint && (
            <section className="rounded-lg bg-surface p-5 shadow-e1">
              <h2 className="text-micro uppercase text-muted">Where to meet</h2>
              <p className="mt-2 text-body-sm text-ink-2">{listing.meetupHint}</p>
            </section>
          )}

          <SafetyNote />
        </div>

        {/* Sticky action rail — desktop only; mobile gets the fixed bar below. */}
        <aside className="space-y-4 lg:sticky lg:top-[calc(var(--topbar-h)+24px)] lg:self-start">
          {isOwner ? (
            <OwnerControls listing={listing} />
          ) : (
            <>
              <SellerCard seller={listing.seller} />

              <div className="hidden gap-2 lg:flex">
                <Button
                  size="lg"
                  block
                  disabled={isSold}
                  loading={startConversation.isPending}
                  onClick={messageSeller}
                >
                  {isSold ? "Already sold" : "Message seller"}
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  aria-label={saved ? "Remove from saved" : "Save listing"}
                  onClick={() => toggle(listing._id)}
                  disabled={savePending}
                  className={cn("!w-[52px] !px-0", saved && "text-danger")}
                >
                  <HeartIcon size={20} filled={saved} />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="sm" block onClick={share}>
                  <ShareIcon size={16} /> Share
                </Button>
                <Button variant="ghost" size="sm" block onClick={() => setReportOpen(true)}>
                  <FlagIcon size={16} /> Report
                </Button>
              </div>
            </>
          )}
        </aside>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="mb-4 text-title text-ink">More like this</h2>
          <div className="rail -mx-4 px-4 md:mx-0 md:px-0">
            {similar.map((item) => (
              <div key={item._id} className="w-[168px]">
                <ProductCard
                  listing={item}
                  isSaved={isSaved(item._id)}
                  onToggleSave={toggle}
                  savePending={savePending}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {!isOwner && (
        <div
          /* Same chrome mechanism as TopBar and BottomNav: glass plus a hairline
             drawn as a shadow, so it costs no layout and matches the rest. */
          className="glass-chrome fixed inset-x-0 z-40 flex gap-2 p-3 shadow-[0_-1px_0_var(--color-line)] lg:hidden"
          style={{ bottom: "calc(var(--tabbar-h) + env(safe-area-inset-bottom))" }}
        >
          <Button
            variant="secondary"
            aria-label={saved ? "Remove from saved" : "Save listing"}
            onClick={() => toggle(listing._id)}
            disabled={savePending}
            className={cn("!w-12 !px-0", saved && "text-danger")}
          >
            <HeartIcon size={19} filled={saved} />
          </Button>
          <Button
            block
            disabled={isSold}
            loading={startConversation.isPending}
            onClick={messageSeller}
          >
            {isSold ? "Already sold" : "Message seller"}
          </Button>
        </div>
      )}

      <ReportSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        isPending={reportListing.isPending}
        onSubmit={(reason) => reportListing.mutateAsync({ id: listing._id, reason })}
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Skeleton className="aspect-[4/3] w-full" rounded="rounded-lg" />
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-9 w-1/3" />
        <Skeleton className="h-24 w-full" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-28 w-full" rounded="rounded-lg" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}
