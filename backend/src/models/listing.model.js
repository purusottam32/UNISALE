import mongoose from "mongoose";

export const LISTING_CATEGORIES = [
  "Electronics",
  "Books & Notes",
  "Furniture",
  "Hostel Essentials",
  "Fashion",
  "Sports & Fitness",
  "Stationery & Supplies",
  "Gadgets & Accessories",
  "Services",
  "Other",
];

export const LISTING_TYPES = ["sale", "rent", "exchange", "giveaway"];
export const LISTING_CONDITIONS = ["new", "like-new", "good", "fair", "for-parts"];
export const LISTING_STATUSES = ["active", "sold", "paused", "deleted"];
export const LOCATION_SCOPES = ["on-campus", "near-campus", "city"];

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    key: { type: String, default: "" },
  },
  { _id: false }
);

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: LISTING_TYPES,
      default: "sale",
    },
    condition: {
      type: String,
      enum: LISTING_CONDITIONS,
      required: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      enum: LISTING_CATEGORIES,
      default: "Other",
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    locationScope: {
      type: String,
      enum: LOCATION_SCOPES,
      default: "on-campus",
    },
    status: {
      type: String,
      enum: LISTING_STATUSES,
      default: "active",
    },
    college: {
      type: String,
      trim: true,
      default: "",
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

listingSchema.index({ college: 1, status: 1, createdAt: -1 });
listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, status: 1, price: 1 });
listingSchema.index({ views: -1 });

const Listing = mongoose.model("Listing", listingSchema, "products");

export default Listing;
