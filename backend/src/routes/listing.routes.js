import express from "express";
import mongoose from "mongoose";
import {
  createListing,
  deleteListing,
  getListingById,
  getListings,
  searchListings,
  updateListing,
  updateListingStatus,
} from "../controllers/listing.controller.js";
import { protect, requireVerified, requireProfile, optionalAuth } from "../middleware/auth.middleware.js";
import { validate, validateQuery } from "../middleware/validation.middleware.js";
import {
  createListingSchema,
  updateListingSchema,
  updateListingStatusSchema,
  listingQuerySchema,
} from "../validators/listing.schema.js";
import upload from "../middleware/upload.middleware.js";
import AppError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();

const validateId = (paramName = "id") =>
  asyncHandler(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
      throw new AppError(`Invalid ${paramName}.`, 400);
    }
    next();
  });

router.post(
  "/",
  protect,
  requireVerified,
  requireProfile,
  upload.array("images", 5),
  validate(createListingSchema),
  createListing
);

router.get("/", optionalAuth, validateQuery(listingQuerySchema), getListings);
router.get("/search", optionalAuth, validateQuery(listingQuerySchema), searchListings);

router.get("/:id", optionalAuth, validateId("id"), getListingById);

router.patch(
  "/:id",
  protect,
  validateId("id"),
  upload.array("images", 5),
  validate(updateListingSchema),
  updateListing
);

router.patch(
  "/:id/status",
  protect,
  validateId("id"),
  validate(updateListingStatusSchema),
  updateListingStatus
);

router.delete("/:id", protect, validateId("id"), deleteListing);

router.post("/:id/report", protect, validateId("id"), asyncHandler(async (req, res) => {
  const { reason } = req.body;
  if (!reason || String(reason).trim().length < 5) {
    throw new AppError("A reason of at least 5 characters is required to file a report.", 400);
  }

  const Report = (await import("../models/report.model.js")).default;
  await Report.create({
    reporter: req.user._id,
    targetType: "listing",
    targetId: req.params.id,
    reason: String(reason).trim(),
  });

  res.status(201).json({ success: true, message: "Report submitted. Our team will review it." });
}));

export default router;

