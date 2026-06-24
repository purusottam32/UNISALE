"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiMessageCircle, FiEye, FiMapPin } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import useProductDetails from "../hooks/useProductDetails";
import {
  useDeleteListingMutation,
  useUpdateListingStatusMutation,
} from "../hooks/useListingMutations";
import useWishlist from "../hooks/useWishlist";
import { useStartConversationMutation } from "../hooks/useChat";
import { getErrorMessage } from "../utils/getErrorMessage";
import { formatCondition, formatType } from "../constants";

export default function ListingDetail({ initialData }) {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [activeImage, setActiveImage] = useState(0);

  const listingQuery = useProductDetails(id, { initialData });
  const deleteMutation = useDeleteListingMutation();
  const statusMutation = useUpdateListingStatusMutation();
  const startChatMutation = useStartConversationMutation();
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (listingQuery.error) {
      toast.error(getErrorMessage(listingQuery.error, "Failed to load listing."));
    }
  }, [listingQuery.error]);

  const listing = listingQuery.data;
  const isOwner = useMemo(() => {
    if (!listing || !user) return false;
    const sellerId = listing?.seller?._id || listing?.seller;
    return sellerId?.toString() === user.id?.toString();
  }, [listing, user]);

  const isWishlisted = wishlistProductIds.includes(listing?._id?.toString());
  const images = listing?.images?.length ? listing.images : [{ url: "/fallback.svg" }];

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Listing deleted.");
      router.replace("/profile");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete."));
    }
  };

  const handleStatus = async (status) => {
    try {
      await statusMutation.mutateAsync({ id, status });
      toast.success(`Marked as ${status}.`);
      listingQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update status."));
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login first.");
      router.push("/login");
      return;
    }
    try {
      await toggleWishlist(listing._id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Saved!");
    } catch (err) {
      toast.error(getErrorMessage(err, "Wishlist update failed."));
    }
  };

  const handleChat = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      const conversation = await startChatMutation.mutateAsync({
        sellerId: listing?.seller?._id,
        productId: listing?._id,
      });
      router.push(`/chat/${conversation._id}`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not start chat."));
    }
  };

  if (listingQuery.isLoading) {
    return <div className="py-16 text-center text-text-muted"><div className="spinner mx-auto" style={{ width: 32, height: 32 }} /></div>;
  }

  if (!listing) {
    return <div className="py-16 text-center text-error">Listing not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative aspect-square rounded-xl overflow-hidden bg-surface-2 mb-3">
            <Image
              src={images[activeImage]?.url || "/fallback.svg"}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.url || i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${activeImage === i ? "border-primary" : "border-transparent"}`}
                >
                  <Image src={img.url} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="badge badge-primary">{formatCondition(listing.condition)}</span>
            <span className="badge badge-muted">{formatType(listing.type)}</span>
            {listing.status !== "active" && <span className="badge badge-warning">{listing.status}</span>}
          </div>

          <h1 className="font-display text-2xl font-bold">{listing.title}</h1>
          <p className="text-3xl font-bold text-primary">Rs. {Number(listing.price).toLocaleString()}</p>

          <div className="flex items-center gap-4 text-sm text-text-muted">
            <span className="flex items-center gap-1"><FiEye /> {listing.views || 0} views</span>
            <span>{listing.category}</span>
            {listing.college && <span className="flex items-center gap-1"><FiMapPin /> {listing.college}</span>}
          </div>

          <p className="text-text-secondary leading-relaxed">{listing.description}</p>

          <div className="card p-4">
            <p className="text-sm text-text-muted mb-1">Seller</p>
            <p className="font-semibold">{listing.seller?.name || "Student"}</p>
            {listing.seller?.college && (
              <p className="text-sm text-text-secondary">{listing.seller.college}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {!isOwner && listing.status === "active" && (
              <>
                <button type="button" className="btn btn-primary" onClick={handleChat} disabled={startChatMutation.isPending}>
                  <FiMessageCircle />
                  {startChatMutation.isPending ? "Starting..." : "Message Seller"}
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleWishlist} disabled={isToggling}>
                  {isWishlisted ? "Saved" : "Save to Wishlist"}
                </button>
              </>
            )}

            {isOwner && (
              <>
                <Link href={`/listings/${id}/edit`} className="btn btn-secondary">Edit Listing</Link>
                {listing.status === "active" && (
                  <>
                    <button type="button" className="btn btn-ghost" onClick={() => handleStatus("sold")}>Mark Sold</button>
                    <button type="button" className="btn btn-ghost" onClick={() => handleStatus("paused")}>Pause</button>
                  </>
                )}
                <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleteMutation.isPending}>
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
