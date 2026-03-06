import React, { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import HeroSection from "../components/HeroSection";
import PopularCategories from "../components/PopularCategories";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import useWishlist from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";

function Homepage() {
  const queryParams = useMemo(() => ({ limit: 12, sortBy: "createdAt" }), []);
  const { products, loading, error } = useProducts(queryParams);
  const { isAuthenticated } = useAuth();
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <HeroSection />
      <PopularCategories />

      <section>
        <h2 className="text-[#131712] text-[22px] font-bold px-4 pb-3 pt-5">Latest Listings</h2>

        {loading ? (
          <div className="px-4 py-8 text-[#6d8566]">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="px-4 py-8 text-[#6d8566]">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={isAuthenticated && wishlistProductIds.includes(product._id?.toString())}
                onToggleWishlist={toggleWishlist}
                isWishlistLoading={isToggling}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

export default Homepage;
