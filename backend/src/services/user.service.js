import mongoose from "mongoose";
import User from "../models/user.model.js";
import Listing from "../models/listing.model.js";
import Report from "../models/report.model.js";
import AppError from "../utils/apiError.js";

/**
 * The public shape of a user. Everything a buyer needs to decide whether to
 * trust a seller, and nothing that identifies them off-platform (no email,
 * no phone) — that privacy guarantee is why in-app chat exists.
 */
export const toPublicProfile = (user, extra = {}) => ({
  id: user._id,
  name: user.name,
  username: user.username || "",
  avatar: user.avatar?.url || "",
  college: user.college || "",
  department: user.department || "",
  year: user.year || null,
  bio: user.bio || "",
  interests: user.interests || [],
  ratingAverage: user.ratingAverage || 0,
  ratingCount: user.ratingCount || 0,
  completedDeals: user.completedDeals || 0,
  isEmailVerified: user.isEmailVerified,
  isIdVerified: user.isIdVerified,
  trustScore: user.trustScore,
  trustTier: user.trustTier,
  memberSince: user.createdAt,
  lastActiveAt: user.lastActiveAt,
  ...extra,
});

export const getPublicProfileService = async (userId) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const user = await User.findById(userId);
  if (!user || user.isBanned) throw new AppError("User not found.", 404);

  const [activeListings, soldListings] = await Promise.all([
    Listing.countDocuments({ seller: userId, status: "active" }),
    Listing.countDocuments({ seller: userId, status: "sold" }),
  ]);

  return toPublicProfile(user, { activeListings, soldListings });
};

/**
 * Median first-reply time over the seller's recent threads, bucketed into a
 * human label. Buyers care far more about "replies fast" than an exact number.
 */
export const getSellerResponsivenessService = async (userId) => {
  const Conversation = mongoose.model("Conversation");
  const Message = mongoose.model("Message");

  const conversations = await Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1 })
    .limit(20)
    .select("_id");

  if (conversations.length === 0) return { label: "New to chat", medianMinutes: null };

  const ids = conversations.map((conversation) => conversation._id);
  const messages = await Message.find({ conversationId: { $in: ids } })
    .sort({ createdAt: 1 })
    .select("conversationId sender createdAt");

  const deltas = [];
  const byConversation = new Map();
  messages.forEach((message) => {
    const key = String(message.conversationId);
    const previous = byConversation.get(key);
    if (previous && String(previous.sender) !== String(message.sender)) {
      if (String(message.sender) === String(userId)) {
        deltas.push((message.createdAt - previous.createdAt) / 60000);
      }
    }
    byConversation.set(key, message);
  });

  if (deltas.length === 0) return { label: "New to chat", medianMinutes: null };

  deltas.sort((a, b) => a - b);
  const median = deltas[Math.floor(deltas.length / 2)];

  let label = "Replies within a few days";
  if (median < 30) label = "Usually replies within minutes";
  else if (median < 180) label = "Usually replies within an hour";
  else if (median < 1440) label = "Usually replies within a day";

  return { label, medianMinutes: Math.round(median) };
};

export const updateNotificationPrefsService = async ({ userId, prefs }) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const allowed = [
    "messageEmail",
    "messagePush",
    "priceDropEmail",
    "reviewEmail",
    "campusDigest",
  ];
  allowed.forEach((key) => {
    if (prefs[key] !== undefined) {
      user.notificationPrefs[key] = prefs[key] === true || prefs[key] === "true";
    }
  });

  await user.save();
  return user.notificationPrefs;
};

export const updateInterestsService = async ({ userId, interests }) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { interests: Array.isArray(interests) ? interests.slice(0, 6) : [] },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError("User not found.", 404);
  return user.interests;
};

export const reportUserService = async ({ reporterId, targetUserId, reason }) => {
  if (!mongoose.Types.ObjectId.isValid(targetUserId)) {
    throw new AppError("Invalid user id.", 400);
  }
  if (String(reporterId) === String(targetUserId)) {
    throw new AppError("You cannot report yourself.", 400);
  }

  const trimmed = String(reason || "").trim();
  if (trimmed.length < 5) {
    throw new AppError("Please describe the issue in at least 5 characters.", 400);
  }

  const target = await User.findById(targetUserId).select("_id");
  if (!target) throw new AppError("User not found.", 404);

  return Report.create({
    reporter: reporterId,
    targetType: "user",
    targetId: targetUserId,
    reason: trimmed,
  });
};

/**
 * Soft account deletion (GDPR, PRD §8.1). We anonymise rather than hard-delete
 * so that the other side of every past conversation and review stays coherent.
 */
export const deleteAccountService = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  await Listing.updateMany({ seller: userId }, { status: "deleted" });

  user.name = "Deleted user";
  user.email = `deleted-${user._id}@unisale.invalid`;
  user.username = undefined;
  user.avatar = { url: "", key: "" };
  user.bio = "";
  user.college = "";
  user.department = "";
  user.googleId = undefined;
  user.password = undefined;
  user.refreshToken = undefined;
  user.isBanned = true;
  await user.save();

  return { message: "Account deleted." };
};
