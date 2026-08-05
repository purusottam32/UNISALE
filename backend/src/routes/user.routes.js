import { Router } from "express";
import {
  deleteAccount,
  getPublicProfile,
  getUserListings,
  getUserReviews,
  reportUser,
  updateInterests,
  updateNotificationPrefs,
} from "../controllers/user.controller.js";
import { optionalAuth, protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validation.middleware.js";

const router = Router();

// ── Current user (self-service) ────────────────────────────────────────
router.patch("/me/notifications", protect, updateNotificationPrefs);
router.patch("/me/interests", protect, updateInterests);
router.delete("/me", protect, deleteAccount);

// ── Public profiles ────────────────────────────────────────────────────
router.get("/:id", validateObjectId("id"), getPublicProfile);
router.get("/:id/listings", optionalAuth, validateObjectId("id"), getUserListings);
router.get("/:id/reviews", validateObjectId("id"), getUserReviews);
router.post("/:id/report", protect, validateObjectId("id"), reportUser);

export default router;
