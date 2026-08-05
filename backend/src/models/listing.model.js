import mongoose from "mongoose";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
  LOCATION_SCOPES,
} from "../config/constants.js";

// Re-exported for convenience so consumers can import model + vocabulary together.
export {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
  LOCATION_SCOPES,
};

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    key: { type: String, default: "" },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    description: { type: String, required: true, trim: true, maxlength: 1000 },
    price: { type: Number, required: true, min: 0 },
    /** Optional original/MRP price — renders as a struck-through anchor price. */
    originalPrice: { type: Number, min: 0, default: null },
    isNegotiable: { type: Boolean, default: true },

    type: { type: String, enum: LISTING_TYPES, default: "sale" },
    condition: { type: String, enum: LISTING_CONDITIONS, required: true },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: LISTING_CATEGORIES,
      default: "Other",
    },

    images: { type: [imageSchema], default: [] },
    locationScope: { type: String, enum: LOCATION_SCOPES, default: "on-campus" },
    /** Free-text meeting hint, e.g. "Hostel C gate". Never an exact address. */
    meetupHint: { type: String, trim: true, maxlength: 80, default: "" },

    status: { type: String, enum: LISTING_STATUSES, default: "active" },
    college: { type: String, trim: true, default: "" },

    // ── Engagement counters (drive the trending feed) ─────────────────
    views: { type: Number, default: 0, min: 0 },
    saveCount: { type: Number, default: 0, min: 0 },
    chatCount: { type: Number, default: 0, min: 0 },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    /** Set when the seller marks the listing sold, enabling mutual reviews. */
    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    soldAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

listingSchema.index({ college: 1, status: 1, createdAt: -1 });
listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, status: 1, price: 1 });
listingSchema.index({ status: 1, createdAt: -1 });
listingSchema.index({ seller: 1, status: 1 });
listingSchema.index({ views: -1 });

/**
 * Listing quality score (0-1) — used by the feed ranker and surfaced to sellers
 * as "improve your listing" hints. Rewards multiple photos and real descriptions.
 */
listingSchema.virtual("qualityScore").get(function qualityScore() {
  let score = 0;
  const imageCount = this.images?.length || 0;
  if (imageCount >= 1) score += 0.3;
  if (imageCount >= 3) score += 0.2;
  if ((this.description?.length || 0) > 100) score += 0.3;
  if (this.title?.length > 15) score += 0.1;
  if (this.meetupHint) score += 0.1;
  return Math.round(score * 100) / 100;
});

// Collection is `products` for backwards compatibility with existing documents.
const Listing = mongoose.model("Listing", listingSchema, "products");

export default Listing;
