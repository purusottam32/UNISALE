import asyncHandler from "../utils/asyncHandler.js";
import {
  registerService,
  verifyOtpService,
  resendOtpService,
  loginService,
  logoutService,
  refreshTokenService,
  googleAuthService,
  completeProfileService,
  getMeService,
  updateMeService,
} from "../services/auth.service.js";
import { getGoogleAuthUrl, exchangeCodeForGoogleUser } from "../utils/googleOAuth.js";
import AppError from "../utils/apiError.js";
import config from "../config/index.js";

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const result = await registerService(req.body);
  res.status(201).json({ success: true, ...result });
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const result = await verifyOtpService(req.body, res);
  res.status(200).json({ success: true, ...result });
});

// POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const result = await resendOtpService(req.body);
  res.status(200).json({ success: true, ...result });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const result = await loginService(req.body, res);
  res.status(200).json({ success: true, ...result });
});

// POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  const result = await logoutService(req.user._id, res);
  res.status(200).json({ success: true, ...result });
});

// POST /api/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
  const result = await refreshTokenService(req, res);
  res.status(200).json({ success: true, ...result });
});

// GET /api/auth/google
export const googleStart = asyncHandler(async (req, res) => {
  res.redirect(getGoogleAuthUrl());
});

// GET /api/auth/google/callback
export const googleCallback = asyncHandler(async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    throw new AppError("Google sign-in was cancelled or failed.", 401);
  }

  if (!code) {
    throw new AppError("Authorization code missing from Google callback.", 400);
  }

  const googleUser = await exchangeCodeForGoogleUser(code);
  const result = await googleAuthService(googleUser, res);

  // CLIENT_URL may hold several origins; the first is the canonical web app.
  const destination = result.isNewUser ? "/onboarding" : "/feed";
  res.redirect(`${config.primaryClientOrigin}${destination}?token=${result.accessToken}`);
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await getMeService(req.user._id);
  res.status(200).json({ success: true, data: user });
});

// PATCH /api/auth/me
export const updateMe = asyncHandler(async (req, res) => {
  const user = await updateMeService(req.user._id, req.body, req.file);
  res.status(200).json({ success: true, data: user });
});

// POST /api/auth/complete-profile
export const completeProfile = asyncHandler(async (req, res) => {
  // The service takes a single options object — the avatar must be folded in.
  const user = await completeProfileService(req.user._id, { ...req.body, avatarFile: req.file });
  res.status(200).json({ success: true, data: user });
});
