import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import AuthButton from "../components/AuthButton";
import { useAuth } from "../context/AuthContext";
import useProductDetails from "../hooks/useProductDetails";
import { useDeleteProductMutation } from "../hooks/useProductMutations";
import useWishlist from "../hooks/useWishlist";
import { useStartConversationMutation } from "../hooks/useChat";
import { getErrorMessage } from "../utils/getErrorMessage";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const productQuery = useProductDetails(id);
  const deleteMutation = useDeleteProductMutation();
  const startConversationMutation = useStartConversationMutation();
  const { wishlistProductIds, toggleWishlist, isToggling } = useWishlist();

  useEffect(() => {
    if (productQuery.error) {
      toast.error(getErrorMessage(productQuery.error, "Failed to fetch product."));
    }
  }, [productQuery.error]);

  const product = productQuery.data;

  const isOwner = useMemo(() => {
    if (!product || !user) {
      return false;
    }

    const sellerId = product?.seller?._id || product?.seller;
    return sellerId?.toString() === user.id?.toString();
  }, [product, user]);

  const isWishlisted = wishlistProductIds.includes(product?._id?.toString());

  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Product deleted successfully.");
      navigate("/", { replace: true });
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, "Failed to delete product."));
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to use wishlist.");
      navigate("/login");
      return;
    }

    try {
      await toggleWishlist(product._id);
      toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update wishlist."));
    }
  };

  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to start chat.");
      navigate("/login");
      return;
    }

    try {
      const conversation = await startConversationMutation.mutateAsync({
        sellerId: product?.seller?._id,
        productId: product?._id,
      });

      navigate(`/chat/${conversation._id}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to start chat."));
    }
  };

  if (productQuery.isLoading) {
    return <div className="py-16 text-center text-[#6d8566]">Loading product...</div>;
  }

  if (!product) {
    return <div className="py-16 text-center text-red-500">Product not found.</div>;
  }

  const imageUrl = product.images?.[0]?.url || product.images?.[0] || "/fallback.svg";

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#f1f4f1] rounded-xl overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(event) => {
              event.currentTarget.src = "/fallback.svg";
            }}
          />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-[#131712]">{product.title}</h1>
          <p className="text-[#6d8566]">{product.description}</p>
          <p className="text-xl font-bold text-[#131712]">Rs. {Number(product.price).toLocaleString()}</p>
          <p className="text-sm text-[#6d8566]">Category: {product.category}</p>
          <p className="text-sm text-[#6d8566]">Seller: {product?.seller?.name || "Unknown Seller"}</p>

          <div className="mt-2 flex flex-wrap gap-2">
            <AuthButton
              label={isWishlisted ? "Remove Wishlist" : "Save to Wishlist"}
              onClick={handleWishlist}
              variant="ghost"
              disabled={isToggling}
              className="max-w-[220px]"
            />

            {!isOwner && (
              <AuthButton
                label={startConversationMutation.isPending ? "Starting chat..." : "Chat with Seller"}
                onClick={handleStartChat}
                variant="secondary"
                disabled={startConversationMutation.isPending}
                className="max-w-[220px]"
              />
            )}

            {isOwner && (
              <AuthButton
                label={deleteMutation.isPending ? "Deleting..." : "Delete Product"}
                onClick={handleDelete}
                variant="ghost"
                disabled={deleteMutation.isPending}
                className="max-w-[220px]"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
