import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  searchProducts,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  validateObjectIdParam,
  validatePriceField,
  validateRequiredFields,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/",
  protect,
  upload.array("images", 6),
  validateRequiredFields(["title", "description", "price", "category"]),
  validatePriceField("price"),
  createProduct
);

router.get("/", getProducts);
router.get("/search", searchProducts);
router.get("/:id", validateObjectIdParam("id"), getProductById);
router.delete("/:id", protect, validateObjectIdParam("id"), deleteProduct);

export default router;
