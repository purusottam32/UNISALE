import { Router } from "express";
import {
  createReview,
  getMyPendingReviews,
  getReviewsForUser,
} from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate, validateObjectId } from "../middleware/validation.middleware.js";
import { createReviewSchema } from "../validators/review.schema.js";

const router = Router();

router.get("/pending", protect, getMyPendingReviews);
router.get("/user/:userId", validateObjectId("userId"), getReviewsForUser);
router.post("/", protect, validate(createReviewSchema), createReview);

export default router;
