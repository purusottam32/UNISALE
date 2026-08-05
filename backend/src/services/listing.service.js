import mongoose from "mongoose";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import Wishlist from "../models/wishlist.model.js";
import { LISTING_CATEGORIES } from "../config/constants.js";
import config from "../config/index.js";
import AppError from "../utils/apiError.js";
import { uploadImageToR2 } from "../utils/r2.js";
import { createNotification } from "./notification.service.js";

const SELLER_FIELDS =
  "name avatar college department year bio ratingAverage ratingCount completedDeals isEmailVerified isIdVerified createdAt";
const sellerPopulate = { path: "seller", select: SELLER_FIELDS };

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const normalizeCategory = (value) => {
  const input = String(value || "").trim();
  return LISTING_CATEGORIES.find((c) => c.toLowerCase() === input.toLowerCase()) || "Other";
};

const normalizePagination = (query = {}) => {
  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 12, 1), 50);
  return { currentPage, limit, skip: (currentPage - 1) * limit };
};

const buildPaginatedPayload = ({ listings, totalItems, currentPage, limit }) => ({
  listings,
  totalPages: Math.ceil(totalItems / limit) || 1,
  currentPage,
  totalItems,
  limit,
  hasMore: currentPage * limit < totalItems,
});

const buildListingFilters = (query = {}, { user } = {}) => {
  const clauses = [];

  if (!query.includeMine) {
    clauses.push({ status: "active" });
  } else if (user) {
    clauses.push({ $or: [{ status: "active" }, { seller: user._id }] });
  }

  if (query.category) {
    clauses.push({ category: new RegExp(`^${escapeRegex(String(query.category).trim())}$`, "i") });
  }
  if (query.type) clauses.push({ type: query.type });
  if (query.condition) clauses.push({ condition: query.condition });
  if (query.locationScope) clauses.push({ locationScope: query.locationScope });

  const allColleges = query.allColleges === true || query.allColleges === "true";
  if (!allColleges) {
    const college =
      String(query.college || "").trim() || (user?.college ? String(user.college).trim() : "");
    if (college) clauses.push({ college: new RegExp(`^${escapeRegex(college)}$`, "i") });
  }

  const searchTerm = String(query.q || query.search || "").trim();
  if (searchTerm) clauses.push({ $text: { $search: searchTerm } });

  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const price = {};
    const minPrice = Number(query.minPrice);
    const maxPrice = Number(query.maxPrice);
    if (query.minPrice !== undefined && !Number.isNaN(minPrice)) price.$gte = minPrice;
    if (query.maxPrice !== undefined && !Number.isNaN(maxPrice)) price.$lte = maxPrice;
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

// ── Reads ──────────────────────────────────────────────────────────────

export const getListingsService = async (query = {}, options = {}) => {
  const filters = buildListingFilters(query, options);
  const { currentPage, limit, skip } = normalizePagination(query);

  const [listings, totalItems] = await Promise.all([
    Listing.find(filters).sort(getSortOptions(query)).skip(skip).limit(limit).populate(sellerPopulate),
    Listing.countDocuments(filters),
  ]);

  return buildPaginatedPayload({ listings, totalItems, currentPage, limit });
};

export const searchListingsService = async (query = {}, options = {}) => {
  const searchTerm = String(query.q || "").trim();
  if (!searchTerm) throw new AppError("Search query parameter 'q' is required.", 400);
  return getListingsService({ ...query, q: searchTerm }, options);
};

/**
 * Personalised campus feed (PRD §10.1).
 *
 * Ranking is computed in Mongo so pagination stays correct — sorting a single
 * page in JS would produce a globally wrong order. Signals:
 *   recency   — decays over 72h, the window in which campus listings move
 *   demand    — views + weighted saves and chat starts
 *   affinity  — listing category is one of the user's onboarding interests
 *   quality   — multiple photos and a real description
 */
export const getCampusFeedService = async ({ user, query = {} }) => {
  const { currentPage, limit, skip } = normalizePagination(query);
  const match = buildListingFilters({ ...query, includeMine: false }, { user });
  const interests = user?.interests?.length ? user.interests : [];

  const pipeline = [
    { $match: match },
    {
      $addFields: {
        hoursLive: {
          $divide: [{ $subtract: ["$$NOW", "$createdAt"] }, 1000 * 60 * 60],
        },
        imageCount: { $size: { $ifNull: ["$images", []] } },
      },
    },
    {
      $addFields: {
        recencyScore: {
          $max: [0, { $subtract: [1, { $divide: ["$hoursLive", 72] }] }],
        },
        demandScore: {
          $add: [
            { $ifNull: ["$views", 0] },
            { $multiply: [{ $ifNull: ["$saveCount", 0] }, 3] },
            { $multiply: [{ $ifNull: ["$chatCount", 0] }, 5] },
          ],
        },
        affinityScore: { $cond: [{ $in: ["$category", interests] }, 1, 0] },
        qualityScore: {
          $add: [
            { $cond: [{ $gte: ["$imageCount", 3] }, 0.5, 0] },
            { $cond: [{ $gt: [{ $strLenCP: { $ifNull: ["$description", ""] } }, 100] }, 0.5, 0] },
          ],
        },
      },
    },
    {
      $addFields: {
        feedScore: {
          $add: [
            { $multiply: ["$recencyScore", 40] },
            { $multiply: [{ $ln: { $add: ["$demandScore", 1] } }, 12] },
            { $multiply: ["$affinityScore", 20] },
            { $multiply: ["$qualityScore", 10] },
          ],
        },
      },
    },
    { $sort: { feedScore: -1, createdAt: -1 } },
    {
      $facet: {
        listings: [
          { $skip: skip },
          { $limit: limit },
          {
            $lookup: {
              from: "users",
              localField: "seller",
              foreignField: "_id",
              as: "seller",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    avatar: 1,
                    college: 1,
                    department: 1,
                    year: 1,
                    ratingAverage: 1,
                    ratingCount: 1,
                    isEmailVerified: 1,
                  },
                },
              ],
            },
          },
          { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
        ],
        meta: [{ $count: "totalItems" }],
      },
    },
  ];

  const [result] = await Listing.aggregate(pipeline);
  const listings = result?.listings || [];
  const totalItems = result?.meta?.[0]?.totalItems || 0;

  return buildPaginatedPayload({ listings, totalItems, currentPage, limit });
};

/**
 * Trending = highest interaction rate over the last 48 hours (PRD DISC-04).
 * Dividing by hours-live stops a week-old listing with many views from
 * permanently occupying the trending rail.
 */
export const getTrendingListingsService = async ({ college, limit = 12 } = {}) => {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const match = { status: "active", createdAt: { $gte: since } };
  if (college) match.college = new RegExp(`^${escapeRegex(college)}$`, "i");

  return Listing.aggregate([
    { $match: match },
    {
      $addFields: {
        hoursLive: {
          $max: [1, { $divide: [{ $subtract: ["$$NOW", "$createdAt"] }, 1000 * 60 * 60] }],
        },
      },
    },
    {
      $addFields: {
        velocity: {
          $divide: [
            {
              $add: [
                { $ifNull: ["$views", 0] },
                { $multiply: [{ $ifNull: ["$saveCount", 0] }, 3] },
                { $multiply: [{ $ifNull: ["$chatCount", 0] }, 5] },
              ],
            },
            "$hoursLive",
          ],
        },
      },
    },
    { $sort: { velocity: -1 } },
    { $limit: Math.min(Number(limit) || 12, 30) },
    {
      $lookup: {
        from: "users",
        localField: "seller",
        foreignField: "_id",
        as: "seller",
        pipeline: [{ $project: { name: 1, avatar: 1, college: 1, ratingAverage: 1, ratingCount: 1 } }],
      },
    },
    { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
  ]);
};

/**
 * "More like this" — same category first, then a ±40% price band, always from
 * the same campus so the recommendation stays actionable.
 */
export const getSimilarListingsService = async ({ listingId, limit = 8 }) => {
  const listing = await Listing.findById(listingId).select("category price college seller");
  if (!listing) throw new AppError("Listing not found.", 404);

  return Listing.find({
    _id: { $ne: listing._id },
    status: "active",
    college: listing.college,
    $or: [
      { category: listing.category },
      { price: { $gte: listing.price * 0.6, $lte: listing.price * 1.4 } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(Math.min(Number(limit) || 8, 20))
    .populate(sellerPopulate);
};

export const getListingByIdService = async (listingId, { incrementViews = true, userId } = {}) => {
  if (!mongoose.Types.ObjectId.isValid(listingId)) {
    throw new AppError("Invalid listing id.", 400);
  }

  const listing = await Listing.findById(listingId).populate(sellerPopulate);
  if (!listing) throw new AppError("Listing not found.", 404);

  const isOwner = userId && String(listing.seller._id) === String(userId);
  if (!isOwner && listing.status === "deleted") throw new AppError("Listing not found.", 404);

  // Owners viewing their own listing must not inflate their view count.
  if (incrementViews && !isOwner && listing.status === "active") {
    await Listing.updateOne({ _id: listing._id }, { $inc: { views: 1 } });
    listing.views += 1;
  }

  return listing;
};

export const getListingsBySellerIdService = async ({
  sellerId,
  query = {},
  includeAllStatuses = false,
}) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new AppError("Invalid user id.", 400);
  }

  const { currentPage, limit, skip } = normalizePagination(query);
  const filters = { seller: sellerId };
  if (!includeAllStatuses) filters.status = { $ne: "deleted" };
  if (query.status) filters.status = query.status;

  const [listings, totalItems] = await Promise.all([
    Listing.find(filters).sort({ createdAt: -1 }).skip(skip).limit(limit).populate(sellerPopulate),
    Listing.countDocuments(filters),
  ]);

  return buildPaginatedPayload({ listings, totalItems, currentPage, limit });
};

// ── Writes ─────────────────────────────────────────────────────────────

export const createListingService = async ({ body, files, sellerId }) => {
  if (!files || files.length === 0) {
    throw new AppError("At least one listing photo is required.", 400);
  }
  if (files.length > config.limits.maxListingImages) {
    throw new AppError(`Maximum ${config.limits.maxListingImages} photos allowed per listing.`, 400);
  }

  const seller = await User.findById(sellerId).select("college isProfileComplete");
  if (!seller) throw new AppError("Seller not found.", 404);
  if (!seller.college) {
    throw new AppError("Add your college to your profile before creating listings.", 403);
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadImageToR2(file.buffer, "listings"))
  );

  const listing = await Listing.create({
    title: String(body.title).trim(),
    description: String(body.description).trim(),
    price: Number(body.price),
    originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
    isNegotiable: body.isNegotiable === undefined ? true : Boolean(body.isNegotiable),
    type: body.type || "sale",
    condition: body.condition,
    category: normalizeCategory(body.category),
    locationScope: body.locationScope || "on-campus",
    meetupHint: String(body.meetupHint || "").trim(),
    images: uploadedImages.map((image) => ({ url: image.url, key: image.key })),
    college: seller.college,
    seller: sellerId,
    status: "active",
  });

  return listing.populate(sellerPopulate);
};

export const updateListingService = async ({ listingId, sellerId, body, files }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (String(listing.seller) !== String(sellerId)) {
    throw new AppError("You can only edit your own listing.", 403);
  }
  if (listing.status === "deleted") throw new AppError("Cannot edit a deleted listing.", 400);

  const editable = [
    "title",
    "description",
    "type",
    "condition",
    "locationScope",
    "meetupHint",
  ];
  editable.forEach((field) => {
    if (body[field] !== undefined) listing[field] = String(body[field]).trim();
  });

  if (body.price !== undefined) {
    const nextPrice = Number(body.price);
    // A price cut is the strongest re-engagement signal we have — tell savers.
    if (nextPrice < listing.price) {
      notifyWishlistPriceDrop({ listing, oldPrice: listing.price, newPrice: nextPrice }).catch(
        () => {}
      );
    }
    listing.price = nextPrice;
  }
  if (body.originalPrice !== undefined) {
    listing.originalPrice = body.originalPrice ? Number(body.originalPrice) : null;
  }
  if (body.isNegotiable !== undefined) {
    listing.isNegotiable = body.isNegotiable === true || body.isNegotiable === "true";
  }
  if (body.category !== undefined) listing.category = normalizeCategory(body.category);

  if (files?.length) {
    if (files.length > config.limits.maxListingImages) {
      throw new AppError(`Maximum ${config.limits.maxListingImages} photos allowed.`, 400);
    }
    const uploaded = await Promise.all(files.map((file) => uploadImageToR2(file.buffer, "listings")));
    listing.images = uploaded.map((image) => ({ url: image.url, key: image.key }));
  }

  await listing.save();
  return listing.populate(sellerPopulate);
};

/**
 * Status transitions. Marking a listing `sold` optionally records the buyer,
 * which is what unlocks the mutual review flow for that deal.
 */
export const updateListingStatusService = async ({ listingId, sellerId, status, buyerId }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (String(listing.seller) !== String(sellerId)) {
    throw new AppError("You can only update your own listing.", 403);
  }

  if (status === "sold") {
    if (buyerId) {
      if (!mongoose.Types.ObjectId.isValid(buyerId)) throw new AppError("Invalid buyer id.", 400);
      if (String(buyerId) === String(sellerId)) {
        throw new AppError("The buyer cannot be the seller.", 400);
      }
      listing.soldTo = buyerId;
      await createNotification({
        recipient: buyerId,
        type: "listing_sold",
        title: `Deal closed: ${listing.title}`,
        body: "Rate the seller to help other students buy with confidence.",
        href: `/listings/${listing._id}?review=1`,
        image: listing.images?.[0]?.url || "",
      });
    }
    listing.soldAt = new Date();
  } else if (listing.status === "sold") {
    // Re-listing an item clears the deal so stale reviews cannot be filed.
    listing.soldTo = null;
    listing.soldAt = null;
  }

  listing.status = status;
  await listing.save();
  return listing.populate(sellerPopulate);
};

export const deleteListingService = async ({ listingId, sellerId }) => {
  const listing = await Listing.findById(listingId);
  if (!listing) throw new AppError("Listing not found.", 404);
  if (String(listing.seller) !== String(sellerId)) {
    throw new AppError("You can only delete your own listing.", 403);
  }

  listing.status = "deleted";
  await listing.save();
  return { message: "Listing deleted." };
};

// ── Internal helpers ───────────────────────────────────────────────────

async function notifyWishlistPriceDrop({ listing, oldPrice, newPrice }) {
  const savers = await Wishlist.find({ productId: listing._id })
    .select("userId")
    .populate("userId", "notificationPrefs");

  const drop = Math.round(((oldPrice - newPrice) / oldPrice) * 100);

  await Promise.all(
    savers
      .filter((entry) => entry.userId && String(entry.userId._id) !== String(listing.seller))
      .map((entry) =>
        createNotification({
          recipient: entry.userId._id,
          type: "wishlist_price_drop",
          title: `Price dropped ${drop}% on a saved item`,
          body: `${listing.title} is now Rs. ${newPrice.toLocaleString("en-IN")}`,
          href: `/listings/${listing._id}`,
          image: listing.images?.[0]?.url || "",
        })
      )
  );
}
