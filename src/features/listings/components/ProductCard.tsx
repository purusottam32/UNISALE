"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ImageOff, MapPin, ShieldCheck, Star } from "lucide-react";
import { formatCondition } from "@/config/catalog";
import { useAuth } from "@/features/auth/auth-context";
import { formatPrice, formatRelativeTime, getDiscountPercent } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ICON_STROKE, aspect, iconSize } from "@/lib/design-tokens";
import { notify } from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import type { Listing } from "../types";

/**
 * ProductCard — the visual signature of UniSale.
 *
 * ── The card is the photograph ──────────────────────────────────────────
 * There is no surface, border or resting shadow. The listing photo sits
 * directly on the canvas with its text beneath, flush to the image edge. Every
 * marketplace whose content is user-shot photography converges on this, and
 * for the same reason: a frame around a photo is chrome competing with the
 * only thing the buyer came to look at.
 *
 * It also decides what "hover" means. Nothing lifts, because nothing is
 * resting on anything — instead the *photograph* lifts: it scales fractionally
 * and gains a shadow, while the frame stays put. The object moves; its
 * container does not.
 *
 * ── Three rows, never four ──────────────────────────────────────────────
 * price → title → place + trust. At 168px on a 2-column phone grid a fourth
 * row tips the card from "a photo with a label" into "a form". Seller *name*
 * lost that fight: it is not decision-relevant in a grid, and you meet it on
 * the detail page anyway.
 *
 * ── One trust token, never two ──────────────────────────────────────────
 * A verified shield OR an earned rating, never both. A rating from two reviews
 * is noise, so it only appears once it means something (3+ reviews, 4.5+); the
 * shield carries trust until then. Two competing signals at 13px is clutter.
 *
 * ── Accessibility ───────────────────────────────────────────────────────
 * The title holds the only link and its `::after` stretches the hit area over
 * the whole card, so the card is fully clickable while the accessible name
 * stays exactly one item. Save sits above that layer. Nesting a <button>
 * inside an <a> — which the card this replaces did — is invalid HTML and
 * breaks keyboard order and screen-reader output.
 */

const STATUS_LABEL: Record<string, string> = {
  sold: "Sold",
  paused: "Paused",
  reserved: "Reserved",
};

/** A rating only earns its place on the card once it is statistically real. */
const MIN_RATINGS_TO_SHOW = 3;
const MIN_AVERAGE_TO_SHOW = 4.5;

export interface ProductCardProps {
  /**
   * Partial because trending and "similar" endpoints project a lighter
   * document than the full listing — the card must render from either.
   */
  listing: Pick<Listing, "_id" | "title" | "price"> & Partial<Listing>;
  isSaved?: boolean;
  onToggleSave?: (id: string) => Promise<void> | void;
  savePending?: boolean;
  /** Set on the first row so the LCP image is not lazy-loaded. */
  priority?: boolean;
}

export default function ProductCard({
  listing,
  isSaved = false,
  onToggleSave,
  savePending = false,
  priority = false,
}: ProductCardProps) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [loaded, setLoaded] = useState(false);

  const image = listing.images?.[0]?.url;
  const discount = getDiscountPercent(listing.price, listing.originalPrice ?? undefined);
  const isOwn = Boolean(user?.id) && String(listing.seller?._id) === String(user?.id);
  const status = listing.status && listing.status !== "active" ? listing.status : null;
  const isFree = listing.type === "giveaway";

  const rating = listing.seller?.ratingAverage ?? 0;
  const ratingCount = listing.seller?.ratingCount ?? 0;
  const showsRating = ratingCount >= MIN_RATINGS_TO_SHOW && rating >= MIN_AVERAGE_TO_SHOW;
  const showsShield = !showsRating && listing.seller?.isEmailVerified;

  const handleSave = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!isAuthenticated) {
      notify.info("Sign in to save items", {
        description: "Saved items follow you across devices.",
      });
      router.push(`/login?next=${encodeURIComponent(`/listings/${listing._id}`)}`);
      return;
    }
    await onToggleSave?.(listing._id);
  };

  return (
    <article
      className={cn(
        "group relative",
        /* Focus lives on the container, not a pseudo-element, so the ring
           traces the card however the internals are rearranged later. */
        "rounded-lg has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4",
        "has-[a:focus-visible]:outline-brand"
      )}
    >
      {/* ── Photograph ─────────────────────────────────────────────────── */}
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-surface-2",
          "transition-shadow duration-[--duration-base] ease-[--ease-out]",
          "group-hover:shadow-e2"
        )}
        style={{ aspectRatio: aspect.card }}
      >
        {image ? (
          <Image
            src={image}
            /* Decorative: the title immediately below is the accessible name,
               and repeating it here would double every announcement in a grid. */
            alt=""
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 300px"
            priority={priority}
            onLoad={() => setLoaded(true)}
            className={cn(
              "object-cover",
              "transition-[transform,opacity] duration-[--duration-slow] ease-[--ease-out]",
              "group-hover:scale-[1.045]",
              /* Fades up from the surface-2 backdrop rather than from white,
                 so there is no flash between placeholder and photo. */
              loaded ? "opacity-100" : "opacity-0",
              status && "scale-100 opacity-45 grayscale group-hover:scale-100"
            )}
          />
        ) : (
          <div className="grid h-full place-items-center text-faint" aria-hidden>
            <ImageOff size={iconSize["2xl"]} strokeWidth={ICON_STROKE} />
          </div>
        )}

        {listing.condition && !status && (
          <span className="absolute left-2 top-2">
            <Badge tone="overlay">{formatCondition(listing.condition)}</Badge>
          </span>
        )}

        {status && (
          <div className="absolute inset-0 grid place-items-center bg-[var(--scrim)]">
            <span className="rounded-full bg-surface px-3.5 py-1.5 text-micro uppercase text-ink">
              {STATUS_LABEL[status] ?? status}
            </span>
          </div>
        )}

        {!isOwn && onToggleSave && !status && (
          <button
            type="button"
            onClick={handleSave}
            disabled={savePending}
            aria-pressed={isSaved}
            aria-label={isSaved ? `Remove ${listing.title} from saved` : `Save ${listing.title}`}
            className={cn(
              /* The button is a 44px touch target; the visible circle inside
                 it is 32px. Shrinking the target down to the glyph is the
                 single most common mobile accessibility failure on cards like
                 this — so the hit area is real markup, not a pseudo-element
                 that a future refactor can silently drop. */
              "absolute right-0.5 top-0.5 z-20 grid h-11 w-11 place-items-center",
              "transition-transform duration-[--duration-fast] active:scale-90",
              "disabled:opacity-60"
            )}
          >
            <span
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full",
                /* Dark scrim, not the light `glass-chrome` token: this sits on
                   a user-supplied photograph that may be any brightness. */
                "glass-on-photo transition-colors duration-[--duration-fast]",
                isSaved ? "text-danger-fill" : "text-white"
              )}
            >
              <Heart
                size={iconSize.sm}
                strokeWidth={2}
                fill={isSaved ? "currentColor" : "none"}
              />
            </span>
          </button>
        )}
      </div>

      {/* ── Detail — flush to the photo's edge ─────────────────────────── */}
      <div className="space-y-1 pt-2.5">
        <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
          <span className="text-price-md tabular text-ink">
            {isFree ? "Free" : formatPrice(listing.price)}
          </span>
          {discount && (
            <>
              <span className="text-caption tabular text-muted line-through">
                {formatPrice(listing.originalPrice!)}
              </span>
              {/* Not `text-accent`. Emerald is the loudest colour available on
                  a near-black canvas and it means one thing — verified. A
                  discount is not a trust signal, and putting it in green made
                  it shout over the price directly above it. */}
              <span className="text-caption font-medium text-ink-2">−{discount}%</span>
            </>
          )}
        </div>

        <h3 className="clamp-2 text-body-sm leading-snug text-ink-2">
          <Link
            href={`/listings/${listing._id}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
          >
            {listing.title}
          </Link>
        </h3>

        <p className="flex items-center gap-1 text-caption text-muted">
          <MapPin size={12} strokeWidth={ICON_STROKE} className="shrink-0" />
          <span className="truncate">{listing.college || "Campus"}</span>
          <span aria-hidden>·</span>
          <span className="shrink-0">{formatRelativeTime(listing.createdAt)}</span>

          {showsRating && (
            <span className="ml-auto flex shrink-0 items-center gap-0.5 text-ink-2">
              <Star size={11} strokeWidth={0} fill="var(--color-warn)" />
              <span className="tabular">{rating.toFixed(1)}</span>
              <span className="sr">out of 5, from {ratingCount} reviews</span>
            </span>
          )}
          {showsShield && (
            <ShieldCheck
              size={13}
              strokeWidth={ICON_STROKE}
              className="ml-auto shrink-0 text-accent"
              aria-label="Verified student"
            />
          )}
        </p>
      </div>
    </article>
  );
}
