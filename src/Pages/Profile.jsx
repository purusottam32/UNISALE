import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthButton from "../components/AuthButton";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";
import useUserProducts from "../hooks/useUserProducts";
import useWishlist from "../hooks/useWishlist";
import { useDeleteProductMutation } from "../hooks/useProductMutations";
import { getErrorMessage } from "../utils/getErrorMessage";

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const deleteProductMutation = useDeleteProductMutation();
  const [deletingId, setDeletingId] = useState(null);

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
    if (userProductsQuery.error) {
      toast.error(userProductsQuery.error);
    }
  }, [userProductsQuery.error]);

  useEffect(() => {
    if (wishlistError) {
      toast.error(getErrorMessage(wishlistError, "Failed to load wishlist."));
    }
  }, [wishlistError]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully.");
    navigate("/login", { replace: true });
  };

  const handleDelete = async (productId) => {
    try {
      setDeletingId(productId);
      await deleteProductMutation.mutateAsync(productId);
      toast.success("Product deleted.");
      userProductsQuery.refetch();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to delete product."));
    } finally {
      setDeletingId(null);
    }
  };

  if (!user) {
    return <div className="py-16 text-center text-[#6d8566]">Loading profile...</div>;
  }

  const myProducts = userProductsQuery.products;
  const wishlistProducts = wishlistItems
    .map((item) => item.productId)
    .filter(Boolean);

  return (
    <div className="flex flex-col w-full max-w-[1100px] py-5 mx-auto gap-6">
      <div className="rounded-xl border border-[#f1f4f1] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#131712]">Profile</h1>
          <p className="text-[#6d8566] mt-2">Name: {user.name}</p>
          <p className="text-[#6d8566]">Email: {user.email}</p>
        </div>

        <div className="max-w-[220px] w-full">
          <AuthButton label="Logout" onClick={handleLogout} variant="ghost" />
        </div>
      </div>

      <div className="rounded-xl border border-[#f1f4f1] p-5">
        <h2 className="text-xl font-bold text-[#131712] mb-3">My Listings</h2>

        {userProductsQuery.loading ? (
          <p className="text-[#6d8566]">Loading your products...</p>
        ) : myProducts.length === 0 ? (
          <div className="text-[#6d8566]">
            No products listed yet. <Link to="/offer-zone" className="underline">Add one now</Link>.
          </div>
        ) : (
          <div className="space-y-3">
            {myProducts.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border border-[#f1f4f1] rounded-lg p-3"
              >
                <div>
                  <Link to={`/products/${item._id}`} className="font-semibold text-[#131712] underline">
                    {item.title}
                  </Link>
                  <p className="text-sm text-[#6d8566]">Rs. {Number(item.price).toLocaleString()}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item._id)}
                  disabled={deletingId === item._id}
                  className="rounded-full px-4 py-2 bg-[#f2f4f1] text-sm font-bold text-[#131612] disabled:opacity-60"
                >
                  {deletingId === item._id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-[#f1f4f1] p-5">
        <h2 className="text-xl font-bold text-[#131712] mb-3">My Wishlist</h2>

        {wishlistProducts.length === 0 ? (
          <p className="text-[#6d8566]">No wishlist items yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlistProducts.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistProductIds.includes(product._id?.toString())}
                onToggleWishlist={toggleWishlist}
                isWishlistLoading={isToggling}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
