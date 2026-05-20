import { z } from "zod";
import {
  LISTING_CATEGORIES,
  LISTING_CONDITIONS,
  LISTING_TYPES,
  LISTING_STATUSES,
  LOCATION_SCOPES,
} from "../models/listing.model.js";

const categoryEnum = z.enum(LISTING_CATEGORIES);
const conditionEnum = z.enum(LISTING_CONDITIONS);
const typeEnum = z.enum(LISTING_TYPES);
const statusEnum = z.enum(LISTING_STATUSES.filter((s) => s !== "deleted"));
const locationScopeEnum = z.enum(LOCATION_SCOPES);

export const createListingSchema = z.object({
  title: z.string().min(3).max(80).trim(),
  description: z.string().min(10).max(1000).trim(),
  price: z.coerce.number().min(0),
  type: typeEnum.default("sale"),
  condition: conditionEnum,
  category: categoryEnum,
  locationScope: locationScopeEnum.default("on-campus"),
});

export const updateListingSchema = createListingSchema.partial();

export const updateListingStatusSchema = z.object({
  status: statusEnum,
});

export const listingQuerySchema = z.object({
  q: z.string().trim().optional(),
  category: z.string().trim().optional(),
  type: typeEnum.optional(),
  condition: conditionEnum.optional(),
  locationScope: locationScopeEnum.optional(),
  college: z.string().trim().optional(),
  allColleges: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sortBy: z.enum(["createdAt", "price", "views", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
  includeMine: z
    .union([z.literal("true"), z.literal("false"), z.boolean()])
    .optional()
    .transform((v) => v === true || v === "true"),
});
