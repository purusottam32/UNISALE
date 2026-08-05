import { Router } from "express";
import {
  createListing,
  deleteListing,
  getCampusFeed,
  getListingById,
  getListings,
  getSimilar,
  getTrending,
  reportListing,
  searchListings,
  updateListing,
  updateListingStatus,
} from "../controllers/listing.controller.js";
import {
  optionalAuth,
  protect,
  requireProfile,
  requireVerified,
} from "../middleware/auth.middleware.js";
import {
  coerceFormBody,
  validate,
  validateObjectId,
  validateQuery,
} from "../middleware/validation.middleware.js";
import {
  createListingSchema,
  listingQuerySchema,
  updateListingSchema,
  updateListingStatusSchema,
} from "../validators/listing.schema.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

const numericFormFields = ["price", "originalPrice"];
const booleanFormFields = ["isNegotiable"];

// ── Discovery (public; personalised when a token is present) ────────────
router.get("/", optionalAuth, validateQuery(listingQuerySchema), getListings);
router.get("/feed", protect, validateQuery(listingQuerySchema), getCampusFeed);
router.get("/trending", optionalAuth, getTrending);
router.get("/search", optionalAuth, validateQuery(listingQuerySchema), searchListings);

// ── Single listing ──────────────────────────────────────────────────────
router.get("/:id", optionalAuth, validateObjectId("id"), getListingById);
router.get("/:id/similar", validateObjectId("id"), getSimilar);

// ── Seller actions ──────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  requireVerified,
  requireProfile,
  upload.array("images", 5),
  coerceFormBody(numericFormFields, booleanFormFields),
  validate(createListingSchema),
  createListing
);

router.patch(
  "/:id",
  protect,
  validateObjectId("id"),
  upload.array("images", 5),
  coerceFormBody(numericFormFields, booleanFormFields),
  validate(updateListingSchema),
  updateListing
);

router.patch(
  "/:id/status",
  protect,
  validateObjectId("id"),
  validate(updateListingStatusSchema),
  updateListingStatus
);

router.delete("/:id", protect, validateObjectId("id"), deleteListing);

// ── Safety ──────────────────────────────────────────────────────────────
router.post("/:id/report", protect, validateObjectId("id"), reportListing);

export default router;
