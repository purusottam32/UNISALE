import Link from "next/link";
import { formatCampusLine, formatMemberSince } from "@/lib/format";
import Avatar from "@/components/ui/Avatar";
import TrustBadge from "@/components/ui/TrustBadge";
import { RatingStars } from "@/components/ui/Rating";
import { ChevronRightIcon } from "@/components/ui/icons";

/**
 * Seller identity block.
 *
 * Trust is this product's entire differentiator, so the signals a buyer needs
 * are gathered in one place: who they are, their campus, their rating, their
 * verification tier, and how fast they reply.
 */
export default function SellerCard({ seller, responsiveness, compact = false }) {
  if (!seller) return null;

  const id = seller._id || seller.id;

  return (
    <div className="rounded-lg bg-surface p-4 shadow-e1">
      <Link href={`/u/${id}`} className="flex items-center gap-3 group">
        <Avatar src={seller.avatar?.url || seller.avatar} name={seller.name} size="lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate text-subtitle text-ink transition-colors duration-[--duration-fast] group-hover:text-brand">
            {seller.name}
          </p>
          <p className="truncate text-caption text-muted">{formatCampusLine(seller)}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {seller.ratingCount > 0 ? (
              <RatingStars value={seller.ratingAverage} count={seller.ratingCount} />
            ) : (
              <span className="text-caption text-muted">No ratings yet</span>
            )}
          </div>
        </div>

        <span className="text-muted transition-transform group-hover:translate-x-0.5">
          <ChevronRightIcon />
        </span>
      </Link>

      {/* The rule below separates two groups inside one card, which is what
          `--color-line` is for — unlike the outline this card used to carry,
          which is now `shadow-e1`. */}
      {!compact && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
          <TrustBadge tier={seller.trustTier} isEmailVerified={seller.isEmailVerified} />
          {seller.createdAt && (
            <span className="text-caption text-muted">
              Member since {formatMemberSince(seller.createdAt)}
            </span>
          )}
        </div>
      )}

      {responsiveness?.label && (
        <p className="mt-2 text-caption font-medium text-success">{responsiveness.label}</p>
      )}
    </div>
  );
}
