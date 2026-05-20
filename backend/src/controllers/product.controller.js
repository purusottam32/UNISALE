import asyncHandler from "../utils/asyncHandler.js";
import {
  createListingService,
  deleteListingService,
  getListingByIdService,
  getListingsService,
  searchListingsService,
  updateListingService,
  updateListingStatusService,
} from "../services/listing.service.js";

export const createProduct = asyncHandler(async (req, res) => {
  const listing = await createListingService({
    body: req.body,
    files: req.files,
    sellerId: req.user._id,
  });
  res.status(201).json({ success: true, message: "Product created successfully.", data: listing });
});

export const getProducts = asyncHandler(async (req, res) => {
  const result = await getListingsService(req.query, { user: req.user || null });
  res.status(200).json({ success: true, data: result });
});

export const searchProducts = asyncHandler(async (req, res) => {
  const result = await searchListingsService(req.query, { user: req.user || null });
  res.status(200).json({ success: true, data: result });
});

export const getProductById = asyncHandler(async (req, res) => {
  const listing = await getListingByIdService(req.params.id, {
    incrementViews: true,
    userId: req.user?._id,
  });
  res.status(200).json({ success: true, data: listing });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const result = await deleteListingService({
    listingId: req.params.id,
    sellerId: req.user._id,
  });
  res.status(200).json({ success: true, message: "Product deleted successfully.", ...result });
});

export const updateProduct = asyncHandler(async (req, res) => {
  const listing = await updateListingService({
    listingId: req.params.id,
    sellerId: req.user._id,
    body: req.body,
    files: req.files,
  });
  res.status(200).json({ success: true, message: "Listing updated successfully.", data: listing });
});

export const updateProductStatus = asyncHandler(async (req, res) => {
  const listing = await updateListingStatusService({
    listingId: req.params.id,
    sellerId: req.user._id,
    status: req.body.status,
  });
  res.status(200).json({ success: true, message: "Listing status updated.", data: listing });
});
