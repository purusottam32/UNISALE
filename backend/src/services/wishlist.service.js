import mongoose from "mongoose";
import Product from "../models/product.model.js";
import Wishlist from "../models/wishlist.model.js";
import AppError from "../utils/apiError.js";

const populateWishlistProduct = {
  path: "productId",
  select: "title description price category images seller createdAt",
  populate: {
    path: "seller",
    select: "name email avatar createdAt",
  },
};

export const addToWishlistService = async ({ userId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product id.", 400);
  }

  const product = await Product.findById(productId).select("_id");
  if (!product) {
    throw new AppError("Product not found.", 404);
  }

  const wishlistItem = await Wishlist.findOneAndUpdate(
    { userId, productId },
    { $setOnInsert: { userId, productId } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  ).populate(populateWishlistProduct);

  return wishlistItem;
};

export const getWishlistService = async (userId) => {
  const items = await Wishlist.find({ userId })
    .sort({ createdAt: -1 })
    .populate(populateWishlistProduct);

  return items.filter((item) => item.productId);
};

export const removeFromWishlistService = async ({ userId, productId }) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError("Invalid product id.", 400);
  }

  const wishlistItem = await Wishlist.findOneAndDelete({ userId, productId });

  if (!wishlistItem) {
    throw new AppError("Product is not in wishlist.", 404);
  }
};
