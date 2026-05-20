import express from "express";
import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/apiError.js";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/users/:id
 * Public profile — returns user info + listing count
 */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid user id.", 400);
    }

    const user = await User.findById(req.params.id).select(
      "name username email avatar college department year bio role isEmailVerified isProfileComplete createdAt"
    );

    if (!user) throw new AppError("User not found.", 404);

    const listingCount = await Listing.countDocuments({
      seller: user._id,
      status: { $ne: "deleted" },
    });

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        username: user.username || "",
        email: user.email,
        avatar: user.avatar?.url || "",
        college: user.college || "",
        department: user.department || "",
        year: user.year || null,
        bio: user.bio || "",
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        isProfileComplete: user.isProfileComplete,
        listingCount,
        createdAt: user.createdAt,
      },
    });
  })
);

/**
 * GET /api/users/:id/products
 * Get listings for a specific user (public)
 */
router.get(
  "/:id/products",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new AppError("Invalid user id.", 400);
    }

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Listing.find({ seller: req.params.id, status: { $ne: "deleted" } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("seller", "name avatar college"),
      Listing.countDocuments({ seller: req.params.id, status: { $ne: "deleted" } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        products,
        totalPages: Math.ceil(total / limit) || 1,
        currentPage: page,
        totalItems: total,
      },
    });
  })
);

export default router;
