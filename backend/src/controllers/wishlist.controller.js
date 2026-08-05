import asyncHandler from "../utils/asyncHandler.js";
import {
  addToWishlistService,
  getWishlistIdsService,
  getWishlistService,
  removeFromWishlistService,
} from "../services/wishlist.service.js";

export const addToWishlist = asyncHandler(async (req, res) => {
  const item = await addToWishlistService({
    userId: req.user._id,
    productId: req.body.listingId || req.body.productId,
  });

  res.status(201).json({ success: true, message: "Saved.", data: item });
});

export const getWishlist = asyncHandler(async (req, res) => {
  const items = await getWishlistService(req.user._id);
  res.status(200).json({ success: true, data: items });
});

/**
 * Ids only — the grid uses this to render filled/outline heart states without
 * shipping every saved listing's full payload on page load.
 */
export const getWishlistIds = asyncHandler(async (req, res) => {
  const ids = await getWishlistIdsService(req.user._id);
  res.status(200).json({ success: true, data: ids });
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const result = await removeFromWishlistService({
    userId: req.user._id,
    productId: req.params.listingId,
  });

  res.status(200).json({ success: true, ...result });
});
