import express from "express";
import mongoose from "mongoose";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import AppError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
router.use(protect);

const validateIdParam = (paramName) =>
  asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      throw new AppError(`Invalid ${paramName}.`, 400);
    }
    next();
  });

router.post("/add", addToWishlist);
router.get("/", getWishlist);
router.delete("/:productId", validateIdParam("productId"), removeFromWishlist);

export default router;
