import mongoose from "mongoose";
import Listing, { LISTING_CATEGORIES } from "../models/listing.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";
import { deleteImageFromR2, uploadImageToR2 } from "../utils/r2.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeCategory = (value) => {
  const input = String(value || "").trim();
  const match = LISTING_CATEGORIES.find((c) => c.toLowerCase() === input.toLowerCase());
  return match || "Other";
};

const normalizePagination = (query = {}) => {
  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  return { currentPage, limit, skip: (currentPage - 1) * limit };
};

const buildPaginatedPayload = ({ listings, totalItems, currentPage, limit }) => ({
  listings,
  products: listings, // backward compat for frontend
  totalPages: Math.ceil(totalItems / limit) || 1,
  currentPage,
  totalItems,
  limit,
});

const buildListingFilters = (query = {}, { user } = {}) => {
  const clauses = [];

  if (!query.includeMine) {
    clauses.push({ $or: [{ status: "active" }, { status: { $exists: false } }] });
  } else if (user) {
    clauses.push({ $or: [{ status: "active" }, { seller: user._id }] });
  }

  if (query.category) {
    clauses.push({
      category: new RegExp(`^${escapeRegex(String(query.category).trim())}$`, "i"),
    });
  }

  if (query.type) clauses.push({ type: query.type });
  if (query.condition) clauses.push({ condition: query.condition });
  if (query.locationScope) clauses.push({ locationScope: query.locationScope });

  const allColleges = query.allColleges === true || query.allColleges === "true";
  if (!allColleges) {
    const college =
      String(query.college || "").trim() || (user?.college ? String(user.college).trim() : "");
    if (college) {
      clauses.push({ college: new RegExp(`^${escapeRegex(college)}$`, "i") });
    }
  }

  const searchTerm = String(query.q || query.search || "").trim();
  if (searchTerm) {
    clauses.push({ $text: { $search: searchTerm } });
  }

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const price = {};
    if (query.minPrice !== undefined) {
      const minPrice = Number(query.minPrice);
      if (!Number.isNaN(minPrice)) price.$gte = minPrice;
    }
    if (query.maxPrice !== undefined) {
      const maxPrice = Number(query.maxPrice);
      if (!Number.isNaN(maxPrice)) price.$lte = maxPrice;
    }
    if (Object.keys(price).length) clauses.push({ price });
  }

  return clauses.length ? { $and: clauses } : {};
};

const getSortOptions = (query = {}) => {
  const allowed = ["createdAt", "price", "views", "title"];
  const sortBy = allowed.includes(query.sortBy) ? query.sortBy : "createdAt";
  const sortOrder = query.sortOrder === "asc" ? 1 : -1;
  const sort = { [sortBy]: sortOrder };
  if (query.q) sort.score = { $meta: "textScore" };
  return sort;
};

const sellerPopulate = { path: "seller", select: "name avatar college department year bio createdAt" };

export const createListingService = async ({ body, files, sellerId }) => {
  if (!files || files.length === 0) {
    throw new AppError("At least one listing image is required.", 400);
  }
  if (files.length > 5) {
    throw new AppError("Maximum 5 images allowed per listing.", 400);
  }

  const seller = await User.findById(sellerId).select("college isProfileComplete");
  if (!seller) throw new AppError("Seller not found.", 404);
  if (!seller.college) {
    throw new AppError("Complete your profile with college info before creating listings.", 403);
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadImageToR2(file.buffer, "products"))
  );

  const listing = await Listing.create({
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    price: Number(body.price),
    type: body.type || "sale",
    condition: body.condition,
    category: normalizeCategory(body.category),
    locationScope: body.locationScope || "on-campus",
    images: uploadedImages.map((img) => ({ url: img.url, key: img.key })),
    college: seller.college,
    seller: sellerId,
    status: "active",
  });

  return listing.populate(sellerPopulate);
};

export const getListingsService = async (query = {}, options = {}) => {
  const filters = buildListingFilters(query, options);
  const { currentPage, limit, skip } = normalizePagination(query);
  const sort = getSortOptions(query);

  const [listings, totalItems] = await Promise.all([
    Listing.find(filters)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(sellerPopulate),
    Listing.countDocuments(filters),
  ]);

  return buildPaginatedPayload({ listings, totalItems, currentPage, limit });
};

export const searchListingsService = async (query = {}, options = {}) => {
  const searchTerm = String(query.q || "").trim();
  if (!searchTerm) {
    throw new AppError("Search query parameter 'q' is required.", 400);
  }
  return getListingsService({ ...query, q: searchTerm }, options);
};

export const getListingByIdService = async (listingId, { incrementViews = true, userId } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new AppError("Invalid listing id.", 400);
  }

  const listing = await Listing.findById(listingId).populate(sellerPopulate);
  if (!listing) throw new AppError("Listing not found.", 404);

  const isOwner = userId && listing.seller._id.toString() === userId.toString();
  if (!isOwner && listing.status !== "active") {
    throw new AppError("Listing not found.", 404);
  }

  if (incrementViews && listing.status === "active") {
    listing.views += 1;
    await listing.save({ validateBeforeSave: false });
  }

  return listing;
};

export const updateListingService = async ({ listingId, sellerId, body, files }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (listing.seller.toString() !== sellerId.toString()) {
    throw new AppError("You can only edit your own listing.", 403);
  }
  if (listing.status === "deleted") {
    throw new AppError("Cannot edit a deleted listing.", 400);
  }

  const { title, description, price, type, condition, category, locationScope } = body;

  if (title !== undefined) listing.title = String(title).trim();
  if (description !== undefined) listing.description = String(description).trim();
  if (price !== undefined) listing.price = Number(price);
  if (type !== undefined) listing.type = type;
  if (condition !== undefined) listing.condition = condition;
  if (category !== undefined) listing.category = normalizeCategory(category);
  if (locationScope !== undefined) listing.locationScope = locationScope;

  if (files?.length) {
    if (files.length > 5) throw new AppError("Maximum 5 images allowed.", 400);
    const uploaded = await Promise.all(files.map((f) => uploadImageToR2(f.buffer, "products")));
    listing.images = uploaded.map((img) => ({ url: img.url, key: img.key }));
  }

  await listing.save();
  return listing.populate(sellerPopulate);
};

export const updateListingStatusService = async ({ listingId, sellerId, status }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (listing.seller.toString() !== sellerId.toString()) {
    throw new AppError("You can only update your own listing.", 403);
  }

  listing.status = status;
  await listing.save();
  return listing.populate(sellerPopulate);
};

export const deleteListingService = async ({ listingId, sellerId }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (listing.seller.toString() !== sellerId.toString()) {
    throw new AppError("You can only delete your own listing.", 403);
  }

  listing.status = "deleted";
  await listing.save();
  return { message: "Listing deleted successfully." };
};

export const getListingsBySellerIdService = async ({ sellerId, query = {}, includeAllStatuses = false }) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const { currentPage, limit, skip } = normalizePagination(query);
  const filters = { seller: sellerId };
  if (!includeAllStatuses) {
    filters.status = { $ne: "deleted" };
  }

  const [listings, totalItems] = await Promise.all([
    Listing.find(filters)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate(sellerPopulate),
    Listing.countDocuments(filters),
  ]);

  return buildPaginatedPayload({ listings, totalItems, currentPage, limit });
};

// Backward-compatible aliases
export const createProductService = createListingService;
export const getProductsService = getListingsService;
export const searchProductsService = searchListingsService;
export const getProductByIdService = getListingByIdService;
export const deleteProductService = deleteListingService;
export const getProductsBySellerIdService = getListingsBySellerIdService;
