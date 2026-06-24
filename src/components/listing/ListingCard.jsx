"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { formatCondition, formatType } from "../../constants";

const getRelativeTime = (isoDate) => {
  if (!isoDate) return "Recently";
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diffMs < hour) return `${Math.max(Math.floor(diffMs / minute), 1)}m ago`;
  if (diffMs < day) return `${Math.max(Math.floor(diffMs / hour), 1)}h ago`;
  return `${Math.max(Math.floor(diffMs / day), 1)}d ago`;
};

export default function ListingCard({
  listing,
  product,
  isWishlisted = false,
  onToggleWishlist,
  isWishlistLoading = false,
  showOwnerActions = false,
  onMarkSold,
  onMarkPaused,
  onDelete,
  actionLoading = false,
}) {
  const item = listing || product;
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const listingId = item?._id || item?.id;
  const imageUrl = item?.images?.[0]?.url || "/fallback.svg";
  const imageCount = item?.images?.length || 0;
  const sellerName = item?.seller?.name || "Unknown Seller";

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (!onToggleWishlist || !listingId) return;
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist.");
      router.push("/login");
      return;
    }
    try {
      await onToggleWishlist(listingId);
      toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update wishlist."));
    }
  };

  const statusBadge =
    item?.status && item.status !== "active" ? (
      <span className={`badge ${item.status === "sold" ? "badge-muted" : "badge-warning"}`}>
        {item.status}
      </span>
    ) : null;

  return (
    <div className="card card-interactive overflow-hidden">
      <Link href={`/listings/${listingId}`} className="block">
        <div className="relative w-full aspect-square bg-surface-2 overflow-hidden">
          <Image
            src={imageUrl}
            alt={item?.title || ""}
            fill
            className="object-cover"
          />
          {imageCount > 1 && (
            <span className="absolute bottom-2 left-2 badge badge-muted text-xs">
              +{imageCount - 1} photos
            </span>
          )}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="badge badge-primary text-xs">{formatCondition(item?.condition)}</span>
            {item?.type && item.type !== "sale" && (
              <span className="badge badge-muted text-xs">{formatType(item.type)}</span>
            )}
          </div>
          {!showOwnerActions && (
            <button
              type="button"
              disabled={isWishlistLoading}
              className="absolute top-2 right-2 p-2 bg-surface rounded-full shadow disabled:opacity-60"
              onClick={handleWishlistClick}
            >
              {isWishlisted ? <FaHeart className="text-error" /> : <FaRegHeart className="text-text-secondary" />}
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-text-primary font-semibold text-sm line-clamp-2 flex-1">{item?.title}</h3>
            {statusBadge}
          </div>
          <p className="text-text-muted text-xs mb-2">{item?.category}</p>
          <p className="text-text-primary font-bold text-lg mb-2">
            Rs. {Number(item?.price || 0).toLocaleString()}
            {item?.type === "rent" && <span className="text-xs font-normal text-text-muted"> / negotiable</span>}
          </p>
          {item?.college && (
            <p className="text-xs text-text-secondary mb-2 line-clamp-1 flex items-center gap-1">
              <FiMapPin className="shrink-0" />
              {item.college}
            </p>
          )}
          <div className="text-xs text-text-secondary">
            <p className="font-medium text-text-primary">{sellerName}</p>
            <p>Posted {getRelativeTime(item?.createdAt)}</p>
          </div>
        </div>
      </Link>

      {showOwnerActions && (
        <div className="px-4 pb-4 flex flex-wrap gap-2 border-t border-border pt-3">
          <Link href={`/listings/${listingId}/edit`} className="btn btn-secondary btn-sm">Edit</Link>
          {item?.status === "active" && (
            <>
              <button type="button" className="btn btn-ghost btn-sm" disabled={actionLoading} onClick={() => onMarkSold?.(listingId)}>
                Mark Sold
              </button>
              <button type="button" className="btn btn-ghost btn-sm" disabled={actionLoading} onClick={() => onMarkPaused?.(listingId)}>
                Pause
              </button>
            </>
          )}
          <button type="button" className="btn btn-danger btn-sm" disabled={actionLoading} onClick={() => onDelete?.(listingId)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
