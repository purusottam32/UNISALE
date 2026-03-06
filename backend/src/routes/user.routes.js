import express from "express";
import {
  getProfile,
  getUserProducts,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";
import {
  validateEmailField,
  validateObjectIdParam,
  validateRequiredFields,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.post(
  "/register",
  upload.single("avatar"),
  validateRequiredFields(["name", "email", "password"]),
  validateEmailField("email"),
  registerUser
);

router.post(
  "/login",
  validateRequiredFields(["email", "password"]),
  validateEmailField("email"),
  loginUser
);

router.post("/logout", logoutUser);
router.get("/profile", protect, getProfile);
router.get("/:id/products", validateObjectIdParam("id"), getUserProducts);

export default router;
