/**
 * Domain vocabulary shared across models, validators and controllers.
 * The frontend mirrors these values in `src/config/catalog.js` — keep both in sync.
 */

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

export const NOTIFICATION_TYPES = [
  "message",
  "listing_sold",
  "review_received",
  "wishlist_price_drop",
  "listing_removed",
  "welcome",
];

/**
 * Trust score weights (PRD §10.2). Total possible = 100.
 */
export const TRUST_SIGNALS = {
  emailVerified: 20,
  idVerified: 20,
  profileComplete: 15,
  goodRating: 20,
  accountAge: 10,
  cleanRecord: 15,
};

export const TRUST_TIERS = [
  { min: 75, key: "trusted", label: "Trusted Seller" },
  { min: 45, key: "verified", label: "Verified Student" },
  { min: 0, key: "new", label: "New Member" },
];
