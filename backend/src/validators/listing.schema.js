import { z } from "zod";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_STATUSES,
  LISTING_TYPES,
  LOCATION_SCOPES,
} from "../config/constants.js";

const categoryEnum = z.enum(LISTING_CATEGORIES);
const conditionEnum = z.enum(LISTING_CONDITIONS);
const typeEnum = z.enum(LISTING_TYPES);
const statusEnum = z.enum(LISTING_STATUSES.filter((status) => status !== "deleted"));
const locationScopeEnum = z.enum(LOCATION_SCOPES);

/** Accepts real booleans and the string forms multipart bodies produce. */
const booleanish = z
  .union([z.boolean(), z.literal("true"), z.literal("false")])
  .transform((value) => value === true || value === "true");

export const createListingSchema = z.object({
  title: z.string().min(3, "Give your item a descriptive title.").max(80).trim(),
  description: z.string().min(10, "Add at least a sentence of detail.").max(1000).trim(),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  originalPrice: z.coerce.number().min(0).optional().nullable(),
  isNegotiable: booleanish.optional(),
  type: typeEnum.default("sale"),
  condition: conditionEnum,
  category: categoryEnum,
  locationScope: locationScopeEnum.default("on-campus"),
  meetupHint: z.string().max(80).trim().optional(),
});

export const updateListingSchema = createListingSchema.partial();

export const updateListingStatusSchema = z.object({
  status: statusEnum,
  /** Optional: records who bought it, which unlocks mutual reviews. */
  buyerId: z.string().optional(),
});

export const listingQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  type: typeEnum.optional(),
  condition: conditionEnum.optional(),
  locationScope: locationScopeEnum.optional(),
  college: z.string().trim().optional(),
  allColleges: booleanish.optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["createdAt", "price", "views", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  includeMine: booleanish.optional(),
});
