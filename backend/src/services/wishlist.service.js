import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import Wishlist from "../models/wishlist.model.js";
import AppError from "../utils/apiError.js";

const populateListing = {
  path: "productId",
  select:
    "title description price originalPrice category images type condition status college views saveCount seller createdAt",
  populate: {
    path: "seller",
    select: "name avatar college ratingAverage ratingCount",
  },
};

export const addToWishlistService = async ({ userId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid listing id.", 400);
  }

  const listing = await Listing.findById(productId).select("_id status seller");
  if (!listing || listing.status === "deleted") throw new AppError("Listing not found.", 404);
  if (String(listing.seller) === String(userId)) {
    throw new AppError("You cannot save your own listing.", 400);
  }

  const existing = await Wishlist.findOne({ userId, productId });
  if (existing) return existing.populate(populateListing);

  const item = await Wishlist.create({ userId, productId });
  // saveCount is a ranking signal for the feed and trending rails.
  await Listing.updateOne({ _id: productId }, { $inc: { saveCount: 1 } });

  return item.populate(populateListing);
};

export const getWishlistService = async (userId) => {
  const items = await Wishlist.find({ userId }).sort({ createdAt: -1 }).populate(populateListing);
  // Drop entries whose listing was hard-deleted so the UI never renders a hole.
  return items.filter((item) => item.productId);
};

export const removeFromWishlistService = async ({ userId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid listing id.", 400);
  }

  const removed = await Wishlist.findOneAndDelete({ userId, productId });
  if (!removed) throw new AppError("This listing is not in your saved items.", 404);

  await Listing.updateOne({ _id: productId, saveCount: { $gt: 0 } }, { $inc: { saveCount: -1 } });
  return { message: "Removed from saved items." };
};

export const getWishlistIdsService = async (userId) => {
  const items = await Wishlist.find({ userId }).select("productId");
  return items.map((item) => String(item.productId));
};
