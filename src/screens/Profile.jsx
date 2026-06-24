"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiMapPin } from "react-icons/fi";
import ListingCard from "../components/listing/ListingCard";
import { useAuth } from "../context/AuthContext";
import useUserProducts from "../hooks/useUserProducts";
import useWishlist from "../hooks/useWishlist";
import {
  useDeleteListingMutation,
  useUpdateListingStatusMutation,
} from "../hooks/useListingMutations";
import { getErrorMessage } from "../utils/getErrorMessage";

function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const deleteMutation = useDeleteListingMutation();
  const statusMutation = useUpdateListingStatusMutation();
  const [actionLoading, setActionLoading] = useState(false);

  const productQueryParams = useMemo(() => ({ page: 1, limit: 20 }), []);
  const userProductsQuery = useUserProducts(user?.id, productQueryParams, {
    enabled: Boolean(user?.id),
  });

  const {
    wishlistItems,
    wishlistProductIds,
    toggleWishlist,
    isToggling,
    error: wishlistError,
  } = useWishlist();

  useEffect(() => {
    if (userProductsQuery.error) toast.error(userProductsQuery.error);
  }, [userProductsQuery.error]);

  useEffect(() => {
    if (wishlistError) toast.error(getErrorMessage(wishlistError, "Failed to load wishlist."));
  }, [wishlistError]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out.");
    router.replace("/login");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this listing?")) return;
    setActionLoading(true);
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Listing deleted.");
      userProductsQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Delete failed."));
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await statusMutation.mutateAsync({ id, status });
      toast.success(`Marked as ${status}.`);
      userProductsQuery.refetch();
    } catch (err) {
      toast.error(getErrorMessage(err, "Update failed."));
    } finally {
      setActionLoading(false);
    }
  };

  if (!user) {
    return <div className="py-16 text-center text-text-muted">Loading profile...</div>;
  }

  const myListings = userProductsQuery.products;
  const wishlistProducts = wishlistItems.map((item) => item.productId).filter(Boolean);

  return (
    <div className="flex flex-col w-full max-w-6xl py-5 mx-auto gap-8">
      <div className="card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Profile</h1>
          <p className="text-text-secondary mt-1">{user.name}</p>
          <p className="text-text-muted text-sm">{user.email}</p>
          {user.college && (
            <p className="text-sm text-text-secondary mt-1 flex items-center gap-1">
              <FiMapPin />
              {user.college}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/create-listing" className="btn btn-primary btn-sm">Sell item</Link>
          <button type="button" onClick={handleLogout} className="btn btn-secondary btn-sm">Logout</button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">My Listings</h2>
          <Link href="/create-listing" className="text-sm text-primary font-medium">+ New listing</Link>
        </div>

        {userProductsQuery.loading ? (
          <p className="text-text-muted">Loading...</p>
        ) : myListings.length === 0 ? (
          <div className="card p-8 text-center text-text-secondary">
            No listings yet.{" "}
            <Link href="/create-listing" className="text-primary underline">Create your first</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {myListings.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                showOwnerActions
                actionLoading={actionLoading}
                onMarkSold={(id) => handleStatus(id, "sold")}
                onMarkPaused={(id) => handleStatus(id, "paused")}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Wishlist</h2>
        {wishlistProducts.length === 0 ? (
          <p className="text-text-muted">No saved items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {wishlistProducts.map((listing) => (
              <ListingCard
                key={listing._id}
                listing={listing}
                isWishlisted={wishlistProductIds.includes(listing._id?.toString())}
                onToggleWishlist={toggleWishlist}
                isWishlistLoading={isToggling}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Profile;
