import asyncHandler from "../utils/asyncHandler.js";
import { getListingsBySellerIdService } from "../services/listing.service.js";
import { getUserReviewsService } from "../services/review.service.js";
import {
  deleteAccountService,
  getPublicProfileService,
  getSellerResponsivenessService,
  reportUserService,
  updateInterestsService,
  updateNotificationPrefsService,
} from "../services/user.service.js";

export const getPublicProfile = asyncHandler(async (req, res) => {
  const [profile, responsiveness] = await Promise.all([
    getPublicProfileService(req.params.id),
    getSellerResponsivenessService(req.params.id),
  ]);

  res.status(200).json({ success: true, data: { ...profile, responsiveness } });
});

export const getUserListings = asyncHandler(async (req, res) => {
  const isOwnProfile = String(req.user?._id || "") === String(req.params.id);

  const result = await getListingsBySellerIdService({
    sellerId: req.params.id,
    query: req.query,
    includeAllStatuses: isOwnProfile,
  });

  res.status(200).json({ success: true, data: result });
});

export const getUserReviews = asyncHandler(async (req, res) => {
  const result = await getUserReviewsService({ userId: req.params.id, query: req.query });
  res.status(200).json({ success: true, data: result });
});

export const updateNotificationPrefs = asyncHandler(async (req, res) => {
  const prefs = await updateNotificationPrefsService({ userId: req.user._id, prefs: req.body });
  res.status(200).json({ success: true, message: "Notification settings saved.", data: prefs });
});

export const updateInterests = asyncHandler(async (req, res) => {
  const interests = await updateInterestsService({
    userId: req.user._id,
    interests: req.body.interests,
  });
  res.status(200).json({ success: true, message: "Interests updated.", data: interests });
});

export const reportUser = asyncHandler(async (req, res) => {
  await reportUserService({
    reporterId: req.user._id,
    targetUserId: req.params.id,
    reason: req.body.reason,
  });
  res.status(201).json({ success: true, message: "Report submitted. Our team will review it." });
});

export const deleteAccount = asyncHandler(async (req, res) => {
  const result = await deleteAccountService(req.user._id);
  res.clearCookie("accessToken", { path: "/" });
  res.clearCookie("refreshToken", { path: "/" });
  res.status(200).json({ success: true, ...result });
});
