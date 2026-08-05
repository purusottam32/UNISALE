import type { ListingCategory, ListingCondition, ListingType, LocationScope } from "@/config/catalog";

/**
 * A listing as returned by the API.
 *
 * Declared here rather than inferred from the fetch layer so `.tsx` consumers
 * get a real shape across the JS/TS boundary — `hooks.js` is still JavaScript
 * and would otherwise hand every component `any`.
 */

export type ListingStatus = "active" | "reserved" | "sold" | "paused" | "deleted";

export interface ListingSeller {
  _id: string;
  name: string;
  avatar?: { url?: string } | string;
  college?: string;
  department?: string;
  year?: number | null;
  bio?: string;
  ratingAverage?: number;
  ratingCount?: number;
  completedDeals?: number;
  isEmailVerified?: boolean;
  isIdVerified?: boolean;
  trustTier?: { key: string; label: string };
  createdAt?: string;
}

export interface ListingImage {
  url: string;
  key?: string;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number | null;
  isNegotiable?: boolean;
  type: ListingType;
  condition: ListingCondition;
  category: ListingCategory;
  images: ListingImage[];
  locationScope: LocationScope;
  meetupHint?: string;
  status: ListingStatus;
  college: string;
  /** Engagement counters — these drive the feed ranker. */
  views: number;
  saveCount: number;
  chatCount: number;
  seller: ListingSeller;
  soldTo?: string | null;
  soldAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

/** The shape every paginated listings endpoint returns. */
export interface ListingPage {
  listings: Listing[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
  limit?: number;
}
