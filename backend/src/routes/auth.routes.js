import { Router } from "express";
import {
  register,
  verifyOtp,
  resendOtp,
  login,
  logout,
  refresh,
  googleStart,
  googleCallback,
  getMe,
  updateMe,
  completeProfile,
} from "../controllers/auth.controller.js";
import { protect, requireVerified } from "../middleware/auth.middleware.js";
import { validate, coerceFormBody } from "../middleware/validation.middleware.js";
import {
  registerSchema,
  verifyOtpSchema,
  resendOtpSchema,
  loginSchema,
  refreshSchema,
  completeProfileSchema,
  updateProfileSchema,
} from "../validators/auth.schema.js";
import upload from "../middleware/upload.middleware.js";

const router = Router();

// --- Public routes ---
router.post("/register", validate(registerSchema), register);
router.post("/verify-otp", validate(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", validate(resendOtpSchema), resendOtp);
router.post("/login", validate(loginSchema), login);
router.post("/refresh", validate(refreshSchema), refresh);

// Google OAuth
router.get("/google", googleStart);
router.get("/google/callback", googleCallback);

// --- Protected routes ---
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);
router.patch("/me", protect, upload.single("avatar"), validate(updateProfileSchema), updateMe);
router.post(
  "/complete-profile",
  protect,
  requireVerified,
  upload.single("avatar"),
  coerceFormBody(["year"]),
  validate(completeProfileSchema),
  completeProfile
);

export default router;
