import asyncHandler from "../utils/asyncHandler.js";
import {
  createReviewService,
  getPendingReviewsService,
  getUserReviewsService,
} from "../services/review.service.js";

export const createReview = asyncHandler(async (req, res) => {
  const review = await createReviewService({
    authorId: req.user._id,
    listingId: req.body.listingId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  res.status(201).json({ success: true, message: "Thanks for rating this deal.", data: review });
});

export const getMyPendingReviews = asyncHandler(async (req, res) => {
  const pending = await getPendingReviewsService(req.user._id);
  res.status(200).json({ success: true, data: pending });
});

export const getReviewsForUser = asyncHandler(async (req, res) => {
  const result = await getUserReviewsService({ userId: req.params.userId, query: req.query });
  res.status(200).json({ success: true, data: result });
});
