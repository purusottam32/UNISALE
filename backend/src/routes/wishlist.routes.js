import { Router } from "express";
import {
  addToWishlist,
  getWishlist,
  getWishlistIds,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validation.middleware.js";

const router = Router();
router.use(protect);

router.get("/", getWishlist);
router.get("/ids", getWishlistIds);
router.post("/", addToWishlist);
router.delete("/:listingId", validateObjectId("listingId"), removeFromWishlist);

export default router;
