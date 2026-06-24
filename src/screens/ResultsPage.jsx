"use client";

import React, { useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProductCard from "../components/ProductCard";
import useProducts from "../hooks/useProducts";
import useWishlist from "../hooks/useWishlist";
import { useAuth } from "../context/AuthContext";
import { MARKETPLACE_CATEGORIES } from "../constants";

const PAGE_SIZE = 9;

const ResultsPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = (searchParams.get("q") || "").trim();
  const category = (searchParams.get("cat") || "").trim();
  const page = Math.max(Number(searchParams.get("page")) || 1, 1);

  const productParams = useMemo(
    () => ({
      q: search || undefined,
      category: category || undefined,
      page,
      limit: PAGE_SIZE,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [category, page, search]
  );

  const { products, totalPages, currentPage, loading, error } = useProducts(productParams);
  const { isAuthenticated } = useAuth();
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const updateQuery = (nextValues) => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    Object.entries(nextValues).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        nextSearchParams.delete(key);
      } else {
        nextSearchParams.set(key, String(value));
      }
    });

    if (!nextValues.page) {
      nextSearchParams.set("page", "1");
    }

    router.push(`/results?${nextSearchParams.toString()}`);
  };

  const handleCategoryClick = (nextCategory) => {
    updateQuery({ cat: nextCategory || undefined, page: 1 });
  };

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) {
      return;
    }

    updateQuery({ page: nextPage });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-4">
        <h2 className="text-2xl font-bold">Marketplace Results</h2>
        <div className="text-sm text-gray-600">
          Showing results for <span className="font-medium">{search || category || "all items"}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        <aside className="rounded-xl border border-[#eef2ee] p-4 h-fit">
          <h3 className="text-lg font-semibold text-[#131712] mb-3">Categories</h3>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleCategoryClick("")}
              className={`text-left px-3 py-2 rounded-lg text-sm ${
                !category ? "bg-[#50d22c] text-[#131712]" : "bg-[#f1f4f1] text-[#131712]"
              }`}
            >
              All Categories
            </button>

            {MARKETPLACE_CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCategoryClick(item)}
                className={`text-left px-3 py-2 rounded-lg text-sm ${
                  category.toLowerCase() === item.toLowerCase()
                    ? "bg-[#50d22c] text-[#131712]"
                    : "bg-[#f1f4f1] text-[#131712]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </aside>

        <section>
          {loading ? (
            <div className="py-20 text-center text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No products found for this filter.</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="px-3 py-2 rounded-lg bg-[#f1f4f1] disabled:opacity-50"
                >
                  Prev
                </button>

                <span className="text-sm text-[#6d8566]">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-2 rounded-lg bg-[#f1f4f1] disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default ResultsPage;
