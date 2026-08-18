import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { LISTING_CATEGORIES } from "@/config/catalog";
import { fetchListings } from "@/lib/server-fetch";
import type { Listing } from "@/features/listings/types";

/**
 * Sitemap for the publicly readable half of the app.
 *
 * Listing URLs are the pages worth ranking — a student searching "used cycle
 * IIT Bombay" should land on the listing, not the homepage — so the most
 * recent ones are enumerated from the API. `fetchListings` already swallows a
 * failed request and returns null, which matters here: a sitemap that throws
 * takes the build down with it, and a stale-but-static sitemap is a better
 * outcome than no deploy.
 */
export const revalidate = 3600;

/**
 * The API caps `limit` at 50 and rejects anything larger outright, so this
 * pages rather than asking for the lot — a single oversized request came back
 * 400 and produced a sitemap with no listings in it at all, which is the
 * failure mode worth guarding against here.
 */
const PAGE_SIZE = 50;
const MAX_PAGES = 10;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${site.url}/explore`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    { url: `${site.url}/login`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${site.url}/register`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = LISTING_CATEGORIES.map((category) => ({
    url: `${site.url}/explore?category=${encodeURIComponent(category)}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const listings: Listing[] = [];

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const result = (await fetchListings({
      page,
      limit: PAGE_SIZE,
      sort: "createdAt:desc",
    })) as { listings?: Listing[]; hasMore?: boolean } | null;

    if (!result?.listings?.length) break;
    listings.push(...result.listings);
    if (!result.hasMore) break;
  }

  const listingRoutes: MetadataRoute.Sitemap = listings.map((listing) => ({
    url: `${site.url}/listings/${listing._id}`,
    lastModified: listing.updatedAt ? new Date(listing.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...listingRoutes];
}
