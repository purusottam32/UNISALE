"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../utils/getErrorMessage";

const getRelativeTime = (isoDate) => {
  if (!isoDate) {
    return "Recently";
  }

  const timestamp = new Date(isoDate).getTime();
  const diffMs = Date.now() - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < hour) {
    return `${Math.max(Math.floor(diffMs / minute), 1)}m ago`;
  }

  if (diffMs < day) {
    return `${Math.max(Math.floor(diffMs / hour), 1)}h ago`;
  }

  return `${Math.max(Math.floor(diffMs / day), 1)}d ago`;
};

const ProductCard = ({
  product,
  isWishlisted = false,
  onToggleWishlist,
  isWishlistLoading = false,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const productId = product?._id || product?.id;
  const imageUrl = product?.images?.[0]?.url || product?.images?.[0] || "/fallback.svg";
  const sellerName = product?.seller?.name || "Unknown Seller";

  const handleWishlistClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!onToggleWishlist || !productId) {
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please login to use wishlist.");
      router.push("/login");
      return;
    }

    try {
      await onToggleWishlist(productId);
      toast.success(isWishlisted ? "Removed from wishlist." : "Added to wishlist.");
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to update wishlist."));
    }
  };

  return (
    <Link
      href={`/products/${productId}`}
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-[#eef2ee]"
    >
      <div className="relative w-full aspect-square bg-gray-100 overflow-hidden rounded-lg">
        <Image
          src={imageUrl}
          alt={product?.title || ""}
          fill
          className="object-cover hover:scale-105 transition-transform"
        />
        <button
          type="button"
          disabled={isWishlistLoading}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 disabled:opacity-60"
          onClick={handleWishlistClick}
        >
          {isWishlisted ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-red-500" />}
        </button>
      </div>

      <div className="p-3">
        <h3 className="text-[#131712] font-medium text-sm line-clamp-2 mb-1">{product?.title}</h3>
        <p className="text-[#6d8566] text-xs line-clamp-1 mb-2">{product?.category}</p>
        <p className="text-[#131712] font-bold text-lg mb-2">Rs. {Number(product?.price || 0).toLocaleString()}</p>

        <div className="text-xs">
          <p className="text-[#131712] font-medium">{sellerName}</p>
          <p className="text-[#6d8566]">Posted {getRelativeTime(product?.createdAt)}</p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
