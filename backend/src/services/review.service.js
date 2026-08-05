import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";

/**
 * Determines whether `authorId` is entitled to review `listing`, and who the
 * subject of that review would be.
 *
 * Eligibility rule: the listing must be sold, and the author must be either the
 * seller or the recorded buyer. This is what stops drive-by rating attacks.
 */
const resolveCounterparty = (listing, authorId) => {
  const author = String(authorId);
  const seller = String(listing.seller?._id || listing.seller);
  const buyer = listing.soldTo ? String(listing.soldTo._id || listing.soldTo) : null;

  if (listing.status !== "sold" || !buyer) {
    throw new AppError("You can only review a deal after it has been marked sold.", 400);
  }
  if (author === seller) return { subject: buyer, role: "buyer" };
  if (author === buyer) return { subject: seller, role: "seller" };

  throw new AppError("Only the buyer and seller of this deal can leave a review.", 403);
};

export const createReviewService = async ({ authorId, listingId, rating, comment = "" }) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new AppError("Invalid listing id.", 400);
  }

  const listing = await Listing.findById(listingId).select("seller soldTo status title images");
  if (!listing) throw new AppError("Listing not found.", 404);

  const { subject, role } = resolveCounterparty(listing, authorId);

  const existing = await Review.findOne({ listing: listingId, author: authorId });
  if (existing) throw new AppError("You have already reviewed this deal.", 409);

  const review = await Review.create({
    listing: listingId,
    author: authorId,
    subject,
    role,
    rating: Number(rating),
    comment: String(comment || "").trim(),
  });

  await Review.syncSubjectRating(subject);
  await User.findByIdAndUpdate(subject, { $inc: { completedDeals: 1 } });

  const author = await User.findById(authorId).select("name");
  await createNotification({
    recipient: subject,
    type: "review_received",
    title: `${author?.name || "A student"} rated you ${rating}/5`,
    body: comment ? `"${String(comment).slice(0, 120)}"` : `For "${listing.title}"`,
    href: "/profile?tab=reviews",
    image: listing.images?.[0]?.url || "",
  });

  return review.populate("author", "name avatar college");
};

export const getUserReviewsService = async ({ userId, query = {} }) => {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);

  const filter = { subject: userId };
  if (query.role === "seller" || query.role === "buyer") filter.role = query.role;

  const [reviews, totalItems, breakdown] = await Promise.all([
    Review.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .populate("author", "name avatar college")
      .populate("listing", "title images"),
    Review.countDocuments(filter),
    Review.aggregate([
      { $match: { subject: new mongoose.Types.ObjectId(String(userId)) } },
      { $group: { _id: "$rating", count: { $sum: 1 } } },
    ]),
  ]);

  // Always return all five buckets so the UI can render a stable histogram.
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  breakdown.forEach((bucket) => {
    distribution[bucket._id] = bucket.count;
  });

  return {
    reviews,
    distribution,
    totalItems,
    currentPage,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};

/**
 * Deals the user has completed but not yet rated — powers the "Rate your recent
 * deals" prompt, which is the single biggest driver of review volume.
 */
export const getPendingReviewsService = async (userId) => {
  const soldListings = await Listing.find({
    status: "sold",
    soldTo: { $ne: null },
    $or: [{ seller: userId }, { soldTo: userId }],
  })
    .sort({ soldAt: -1 })
    .limit(20)
    .populate("seller", "name avatar")
    .populate("soldTo", "name avatar");

  const reviewed = await Review.find({
    author: userId,
    listing: { $in: soldListings.map((listing) => listing._id) },
  }).select("listing");

  const reviewedIds = new Set(reviewed.map((review) => String(review.listing)));

  return soldListings
    .filter((listing) => !reviewedIds.has(String(listing._id)))
    .map((listing) => {
      const isSeller = String(listing.seller._id) === String(userId);
      return {
        listingId: listing._id,
        title: listing.title,
        image: listing.images?.[0]?.url || "",
        soldAt: listing.soldAt,
        counterparty: isSeller ? listing.soldTo : listing.seller,
        yourRole: isSeller ? "seller" : "buyer",
      };
    });
};
