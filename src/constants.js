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

/** @deprecated use LISTING_CATEGORIES */
export const MARKETPLACE_CATEGORIES = LISTING_CATEGORIES;

export const LISTING_TYPES = [
  { value: "sale", label: "For Sale" },
  { value: "rent", label: "For Rent" },
  { value: "exchange", label: "Exchange" },
  { value: "giveaway", label: "Giveaway" },
];

export const LISTING_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
  { value: "for-parts", label: "For Parts" },
];

export const LISTING_STATUSES = [
  { value: "active", label: "Active" },
  { value: "sold", label: "Sold" },
  { value: "paused", label: "Paused" },
];

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "createdAt:asc", label: "Oldest first" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "views:desc", label: "Most viewed" },
];

export const formatCondition = (value) =>
  LISTING_CONDITIONS.find((c) => c.value === value)?.label || value;

export const formatType = (value) =>
  LISTING_TYPES.find((t) => t.value === value)?.label || value;
