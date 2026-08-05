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
    <div className="rounded-lg border border-line bg-surface p-4">
      <Link href={`/u/${id}`} className="flex items-center gap-3 group">
        <Avatar src={seller.avatar?.url || seller.avatar} name={seller.name} size="lg" />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-ink group-hover:text-brand">{seller.name}</p>
          <p className="truncate text-xs text-muted">{formatCampusLine(seller)}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {seller.ratingCount > 0 ? (
              <RatingStars value={seller.ratingAverage} count={seller.ratingCount} />
            ) : (
              <span className="text-xs text-muted">No ratings yet</span>
            )}
          </div>
        </div>

        <span className="text-muted transition-transform group-hover:translate-x-0.5">
          <ChevronRightIcon />
        </span>
      </Link>

      {!compact && (
        <div className="mt-3.5 flex flex-wrap items-center gap-2 border-t border-line pt-3.5">
          <TrustBadge tier={seller.trustTier} isEmailVerified={seller.isEmailVerified} />
          {seller.createdAt && (
            <span className="text-xs text-muted">
              Member since {formatMemberSince(seller.createdAt)}
            </span>
          )}
        </div>
      )}

      {responsiveness?.label && (
        <p className="mt-2 text-xs font-medium text-success">{responsiveness.label}</p>
      )}
    </div>
  );
}
