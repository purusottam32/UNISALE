import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * Protects routes — requires a valid access token.
 * Token accepted from: HttpOnly cookie OR Authorization: Bearer <token>
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Authentication required. Please login.", 401);
  }

  const decoded = verifyAccessToken(token);

  const user = await User.findById(decoded.id).select("-__v");
  if (!user) {
    throw new AppError("User for this token no longer exists.", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account has been suspended. Contact support.", 403);
  }

  req.user = user;
  next();
});

/**
 * Requires user to have a verified email.
 */
export const requireVerified = asyncHandler(async (req, res, next) => {
  if (!req.user.isEmailVerified) {
    throw new AppError("Please verify your email address to access this feature.", 403);
  }
  next();
});

/**
 * Requires user to have a complete profile (college, department, year).
 */
export const requireProfile = asyncHandler(async (req, res, next) => {
  if (!req.user.isProfileComplete) {
    throw new AppError("Please complete your profile before creating listings.", 403);
  }
  next();
});

/** Alias for Sprint spec naming */
export const requireCompleteProfile = requireProfile;

/**
 * Optional auth — attaches user when token present, continues as guest otherwise.
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token = null;

  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    next();
    return;
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.id).select("-__v");
    if (user && !user.isBanned) req.user = user;
  } catch {
    // Invalid token — treat as guest
  }

  next();
});

/**
 * Restricts route to admin role only.
 */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new AppError("Access denied. Admin privileges required.", 403);
  }
  next();
});
