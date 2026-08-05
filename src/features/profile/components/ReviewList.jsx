import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/States";
import { RatingStars } from "@/components/ui/Rating";

export default function ReviewList({ reviews = [], emptyMessage }) {
  if (reviews.length === 0) {
    return (
      <EmptyState
        glyph="⭐"
        title="No reviews yet"
        description={emptyMessage || "Ratings appear here once a deal is completed and rated."}
      />
    );
  }

  return (
    <ul className="space-y-3">
      {reviews.map((review) => (
        <li key={review._id} className="rounded-lg border border-line bg-surface p-4">
          <div className="flex items-start gap-3">
            <Avatar
              src={review.author?.avatar?.url || review.author?.avatar}
              name={review.author?.name}
              size="sm"
            />

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/u/${review.author?._id}`}
                  className="text-sm font-semibold text-ink hover:text-brand"
                >
                  {review.author?.name || "A student"}
                </Link>
                <Badge tone="neutral">as {review.role === "seller" ? "buyer" : "seller"}</Badge>
                <span className="text-xs text-muted">{formatRelativeTime(review.createdAt)}</span>
              </div>

              <div className="mt-1">
                <RatingStars value={review.rating} showValue={false} />
              </div>

              {review.comment && (
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{review.comment}</p>
              )}

              {review.listing?.title && (
                <p className="mt-2 truncate text-xs text-muted">On “{review.listing.title}”</p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
