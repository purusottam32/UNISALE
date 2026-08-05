import asyncHandler from "../utils/asyncHandler.js";
import Report from "../models/report.model.js";
import AppError from "../utils/apiError.js";
import {
  createListingService,
  deleteListingService,
  getCampusFeedService,
  getListingByIdService,
  getListingsService,
  getSimilarListingsService,
  getTrendingListingsService,
  searchListingsService,
  updateListingService,
  updateListingStatusService,
} from "../services/listing.service.js";

export const createListing = asyncHandler(async (req, res) => {
  const listing = await createListingService({
    body: req.body,
    files: req.files,
    sellerId: req.user._id,
  });
  res.status(201).json({ success: true, message: "Your listing is live.", data: listing });
});

export const getListings = asyncHandler(async (req, res) => {
  const result = await getListingsService(req.query, { user: req.user || null });
  res.status(200).json({ success: true, data: result });
});

export const getCampusFeed = asyncHandler(async (req, res) => {
  const result = await getCampusFeedService({ user: req.user, query: req.query });
  res.status(200).json({ success: true, data: result });
});

export const getTrending = asyncHandler(async (req, res) => {
  const listings = await getTrendingListingsService({
    college: req.query.college || req.user?.college,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, data: { listings } });
});

export const getSimilar = asyncHandler(async (req, res) => {
  const listings = await getSimilarListingsService({
    listingId: req.params.id,
    limit: req.query.limit,
  });
  res.status(200).json({ success: true, data: { listings } });
});

export const searchListings = asyncHandler(async (req, res) => {
  const result = await searchListingsService(req.query, { user: req.user || null });
  res.status(200).json({ success: true, data: result });
});

export const getListingById = asyncHandler(async (req, res) => {
  const listing = await getListingByIdService(req.params.id, {
    incrementViews: true,
    userId: req.user?._id,
  });
  res.status(200).json({ success: true, data: listing });
});

export const updateListing = asyncHandler(async (req, res) => {
  const listing = await updateListingService({
    listingId: req.params.id,
    sellerId: req.user._id,
    body: req.body,
    files: req.files,
  });
  res.status(200).json({ success: true, message: "Listing updated.", data: listing });
});

export const updateListingStatus = asyncHandler(async (req, res) => {
  const listing = await updateListingStatusService({
    listingId: req.params.id,
    sellerId: req.user._id,
    status: req.body.status,
    buyerId: req.body.buyerId,
  });
  res.status(200).json({ success: true, message: "Listing status updated.", data: listing });
});

export const deleteListing = asyncHandler(async (req, res) => {
  const result = await deleteListingService({
    listingId: req.params.id,
    sellerId: req.user._id,
  });
  res.status(200).json({ success: true, ...result });
});

export const reportListing = asyncHandler(async (req, res) => {
  const reason = String(req.body.reason || "").trim();
  if (reason.length < 5) {
    throw new AppError("Please describe the issue in at least 5 characters.", 400);
  }

  await Report.create({
    reporter: req.user._id,
    targetType: "listing",
    targetId: req.params.id,
    reason,
  });

  res.status(201).json({ success: true, message: "Report submitted. Our team will review it." });
});
