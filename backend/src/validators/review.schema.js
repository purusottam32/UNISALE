import { z } from "zod";

export const createReviewSchema = z.object({
  listingId: z.string().min(1, "A listing id is required."),
  rating: z.coerce.number().int().min(1, "Rating must be 1-5.").max(5, "Rating must be 1-5."),
  comment: z.string().max(500, "Keep your review under 500 characters.").trim().optional(),
});
