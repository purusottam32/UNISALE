import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiPlus } from "react-icons/fi";
import ListingCard from "../components/listing/ListingCard";
import useListings from "../hooks/useListings";
import useWishlist from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";

export default function Feed() {
  const { user, isAuthenticated } = useAuth();
  const params = useMemo(
    () => ({ limit: 12, sortBy: "createdAt", sortOrder: "desc", allColleges: false }),
    []
  );

  const { listings, loading, error } = useListings(params, { enabled: isAuthenticated });
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold">Campus Feed</h1>
          <p className="text-text-secondary text-sm mt-1">
            {user?.college
              ? `Listings from ${user.college} and nearby students`
              : "Complete your profile to see your campus feed"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/explore" className="btn btn-secondary btn-sm">Explore all</Link>
          <Link to="/create-listing" className="btn btn-primary btn-sm">
            <FiPlus /> Sell
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-text-muted">Loading your campus feed...</div>
      ) : listings.length === 0 ? (
        <div className="card p-10 text-center">
          <p className="text-text-secondary mb-4">No listings on your campus yet. Be the first to sell!</p>
          <Link to="/create-listing" className="btn btn-primary">Create a listing</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {listings.map((listing) => (
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
    </div>
  );
}
