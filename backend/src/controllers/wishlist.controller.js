import asyncHandler from "../utils/asyncHandler.js";
import {
  addToWishlistService,
  getWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const item = await addToWishlistService({
    userId: req.user._id,
    productId: req.body.productId,
  });

  res.status(201).json({
    success: true,
    message: "Product added to wishlist.",
    data: item,
  });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await getWishlistService(req.user._id);

  res.status(200).json({
    success: true,
    data: items,
  });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  await removeFromWishlistService({
    userId: req.user._id,
    productId: req.params.productId,
  });

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist.",
  });
});
