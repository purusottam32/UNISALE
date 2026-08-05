/**
 * Listing vocabulary. Mirrors `backend/src/config/constants.js` — change one,
 * change the other.
 *
 * Everything is `as const` so category names are a union type rather than
 * `string`, which is what lets `CATEGORY_META[category]` type-check and stops
 * a typo'd category reaching the API.
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
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

/** Display metadata for the category rail and the sell wizard picker. */
export const CATEGORY_META: Record<ListingCategory, { emoji: string; blurb: string }> = {
  Electronics: { emoji: "💻", blurb: "Laptops, phones, cameras" },
  "Books & Notes": { emoji: "📚", blurb: "Textbooks, notes, guides" },
  Furniture: { emoji: "🪑", blurb: "Tables, chairs, shelves" },
  "Hostel Essentials": { emoji: "🛏️", blurb: "Bedding, kettles, storage" },
  Fashion: { emoji: "👕", blurb: "Clothing, shoes, bags" },
  "Sports & Fitness": { emoji: "🚲", blurb: "Cycles, gear, gym kit" },
  "Stationery & Supplies": { emoji: "✏️", blurb: "Drafters, calculators, art" },
  "Gadgets & Accessories": { emoji: "🎧", blurb: "Earphones, chargers, cables" },
  Services: { emoji: "🛠️", blurb: "Tutoring, design, repairs" },
  Other: { emoji: "📦", blurb: "Everything else" },
};

export interface CatalogOption<T extends string = string> {
  value: T;
  label: string;
  hint?: string;
}

export const LISTING_TYPES = [
  { value: "sale", label: "For sale", hint: "A one-time sale" },
  { value: "rent", label: "For rent", hint: "Lend it for a fee" },
  { value: "exchange", label: "Exchange", hint: "Swap for something else" },
  { value: "giveaway", label: "Giveaway", hint: "Free to a good home" },
] as const satisfies readonly CatalogOption[];

export type ListingType = (typeof LISTING_TYPES)[number]["value"];

/**
 * Condition ladder. The hints matter more than the labels — vague conditions
 * are the number one cause of disputes at handover.
 */
export const LISTING_CONDITIONS = [
  { value: "new", label: "New", hint: "Sealed or never used" },
  { value: "like-new", label: "Like new", hint: "Used a few times, no marks" },
  { value: "good", label: "Good", hint: "Light wear, works perfectly" },
  { value: "fair", label: "Fair", hint: "Visible wear, fully functional" },
  { value: "for-parts", label: "For parts", hint: "Faulty or incomplete" },
] as const satisfies readonly CatalogOption[];

export type ListingCondition = (typeof LISTING_CONDITIONS)[number]["value"];

export const LOCATION_SCOPES = [
  { value: "on-campus", label: "On campus", hint: "Meet inside the campus" },
  { value: "near-campus", label: "Near campus", hint: "Within walking distance" },
  { value: "city", label: "Anywhere in city", hint: "Buyer travels to you" },
] as const satisfies readonly CatalogOption[];

export type LocationScope = (typeof LOCATION_SCOPES)[number]["value"];

export const LISTING_STATUSES = [
  { value: "active", label: "Active" },
  { value: "reserved", label: "Reserved" },
  { value: "sold", label: "Sold" },
  { value: "paused", label: "Paused" },
] as const satisfies readonly CatalogOption[];

export const SORT_OPTIONS = [
  { value: "createdAt:desc", label: "Newest first" },
  { value: "price:asc", label: "Price: low to high" },
  { value: "price:desc", label: "Price: high to low" },
  { value: "views:desc", label: "Most viewed" },
] as const satisfies readonly CatalogOption[];

/** Quick price bands shown as chips in the filter panel. */
export const PRICE_BANDS = [
  { label: "Under ₹500", minPrice: 0, maxPrice: 500 },
  { label: "₹500 – ₹2k", minPrice: 500, maxPrice: 2000 },
  { label: "₹2k – ₹10k", minPrice: 2000, maxPrice: 10000 },
  { label: "₹10k+", minPrice: 10000, maxPrice: undefined },
] as const;

const byValue = <T extends readonly CatalogOption[]>(list: T) =>
  Object.fromEntries(list.map((item) => [item.value, item])) as Record<
    T[number]["value"],
    T[number]
  >;

export const CONDITION_BY_VALUE = byValue(LISTING_CONDITIONS);
export const TYPE_BY_VALUE = byValue(LISTING_TYPES);
export const SCOPE_BY_VALUE = byValue(LOCATION_SCOPES);

export const formatCondition = (value?: string) =>
  CONDITION_BY_VALUE[value as ListingCondition]?.label ?? value ?? "";

export const formatType = (value?: string) =>
  TYPE_BY_VALUE[value as ListingType]?.label ?? value ?? "";

export const formatScope = (value?: string) =>
  SCOPE_BY_VALUE[value as LocationScope]?.label ?? value ?? "";

/** Categories as `<Select>`/`<ChoiceGroup>` options. */
export const CATEGORY_OPTIONS = LISTING_CATEGORIES.map((category) => ({
  value: category,
  label: category,
  hint: CATEGORY_META[category].blurb,
}));
