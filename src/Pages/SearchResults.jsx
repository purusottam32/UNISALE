import { useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ListingCard from "../components/listing/ListingCard";
import ListingFilters from "../components/listing/ListingFilters";
import useListings from "../hooks/useListings";
import useWishlist from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 12;

export default function SearchResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const searchParams = new URLSearchParams(location.search);

  const filters = useMemo(() => ({
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || searchParams.get("cat") || undefined,
    type: searchParams.get("type") || undefined,
    condition: searchParams.get("condition") || undefined,
    minPrice: searchParams.get("minPrice") || undefined,
    maxPrice: searchParams.get("maxPrice") || undefined,
    sortBy: searchParams.get("sortBy") || "createdAt",
    sortOrder: searchParams.get("sortOrder") || "desc",
    page: Math.max(Number(searchParams.get("page")) || 1, 1),
    limit: PAGE_SIZE,
    allColleges: searchParams.get("allColleges") === "true",
  }), [location.search]);

  const { listings, totalPages, currentPage, totalItems, loading, error } = useListings(filters);
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const updateFilters = (next) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...next }).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "" && k !== "sort") {
        params.set(k, String(v));
      }
    });
    navigate(`/results?${params.toString()}`);
  };

  const searchLabel = filters.q || filters.category || "all listings";

  return (
    <div className="max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Search Results</h1>
        <p className="text-text-secondary text-sm mt-1">
          {totalItems} result{totalItems !== 1 ? "s" : ""} for <span className="text-text-primary font-medium">{searchLabel}</span>
          {isAuthenticated && user?.college && !filters.allColleges && (
            <span> · scoped to {user.college}</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <ListingFilters
          filters={filters}
          onChange={updateFilters}
          showCampusToggle
          isAuthenticated={isAuthenticated}
        />

        <section>
          {loading ? (
            <div className="py-20 text-center text-text-muted">Searching...</div>
          ) : listings.length === 0 ? (
            <div className="py-20 text-center text-text-muted">No listings found. Try different filters.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing._id}
                    listing={listing}
                    isWishlisted={isAuthenticated && wishlistProductIds.includes(listing._id?.toString())}
                    onToggleWishlist={toggleWishlist}
                    isWishlistLoading={isToggling}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-3">
                  <button type="button" className="btn btn-secondary btn-sm" disabled={currentPage <= 1} onClick={() => updateFilters({ page: currentPage - 1 })}>Prev</button>
                  <span className="text-sm text-text-muted self-center">Page {currentPage} of {totalPages}</span>
                  <button type="button" className="btn btn-secondary btn-sm" disabled={currentPage >= totalPages} onClick={() => updateFilters({ page: currentPage + 1 })}>Next</button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
