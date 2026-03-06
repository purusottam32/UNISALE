import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateObjectIdField,
  validateObjectIdParam,
  validateRequiredFields,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(protect);

router.post(
  "/add",
  validateRequiredFields(["productId"]),
  validateObjectIdField("productId"),
  addToWishlist
);
router.get("/", getWishlist);
router.delete("/:productId", validateObjectIdParam("productId"), removeFromWishlist);

export default router;
