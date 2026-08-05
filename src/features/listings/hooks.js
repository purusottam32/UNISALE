"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/errors";
import {
  createListingRequest,
  deleteListingRequest,
  getFeedRequest,
  getListingRequest,
  getListingsRequest,
  getSimilarRequest,
  getTrendingRequest,
  getUserListingsRequest,
  reportListingRequest,
  searchListingsRequest,
  updateListingRequest,
  updateListingStatusRequest,
} from "./api";

const PAGE_SIZE = 12;

const emptyPage = { listings: [], totalItems: 0, currentPage: 1, totalPages: 1, hasMore: false };

const unwrap = (response) => response.data?.data || emptyPage;

/** Shared page-param resolver: stop when the API says there is nothing more. */
const nextPageParam = (lastPage) =>
  lastPage?.hasMore ? (lastPage.currentPage || 1) + 1 : undefined;

/**
 * Collapses infinite-query pages into one array.
 *
 * The annotation is what gives `.tsx` consumers a real `Listing[]` — without
 * it every component mapping over `listings` gets an implicit `any` and fails
 * to compile under `strict`.
 *
 * @param {{ data?: { pages: import("./types").ListingPage[] } } & Record<string, any>} query
 */
const flatten = (query) => ({
  /** @type {import("./types").Listing[]} */
  listings: query.data?.pages.flatMap((page) => page.listings) || [],
  totalItems: query.data?.pages[0]?.totalItems || 0,
  isLoading: query.isLoading,
  isFetchingMore: query.isFetchingNextPage,
  hasMore: Boolean(query.hasNextPage),
  loadMore: query.fetchNextPage,
  error: query.error ? getErrorMessage(query.error, "Could not load listings.") : "",
  refetch: query.refetch,
});

/**
 * Browse/search listings with infinite scroll. Passing `q` transparently
 * switches to the search endpoint so callers do not have to branch.
 */
export function useListings(params = {}, options = {}) {
  const merged = { limit: PAGE_SIZE, ...params };

  const query = useInfiniteQuery({
    queryKey: queryKeys.listings.list(merged),
    enabled: options.enabled ?? true,
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    queryFn: async ({ pageParam }) => {
      const request = String(merged.q || "").trim() ? searchListingsRequest : getListingsRequest;
      return unwrap(await request({ ...merged, page: pageParam }));
    },
  });

  return flatten(query);
}

/** The personalised campus feed. Requires a signed-in user. */
export function useCampusFeed(params = {}, options = {}) {
  const merged = { limit: PAGE_SIZE, ...params };

  const query = useInfiniteQuery({
    queryKey: queryKeys.listings.feed(merged),
    enabled: options.enabled ?? true,
    initialPageParam: 1,
    getNextPageParam: nextPageParam,
    queryFn: async ({ pageParam }) => unwrap(await getFeedRequest({ ...merged, page: pageParam })),
  });

  return flatten(query);
}

export function useTrendingListings(params = {}, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.listings.trending(params),
    enabled: options.enabled ?? true,
    staleTime: 5 * 60_000,
    queryFn: async () => (await getTrendingRequest(params)).data?.data?.listings || [],
  });

  return {
    /** @type {import("./types").Listing[]} */
    listings: query.data || [],
    isLoading: query.isLoading,
  };
}

export function useListing(id, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.listings.detail(id),
    enabled: Boolean(id) && (options.enabled ?? true),
    initialData: options.initialData || undefined,
    queryFn: async () => (await getListingRequest(id)).data?.data,
  });

  return {
    listing: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Could not load this listing.") : "",
  };
}

export function useSimilarListings(id, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.listings.similar(id),
    enabled: Boolean(id) && (options.enabled ?? true),
    staleTime: 5 * 60_000,
    queryFn: async () => (await getSimilarRequest(id)).data?.data?.listings || [],
  });

  return { listings: query.data || [], isLoading: query.isLoading };
}

export function useUserListings(userId, params = {}, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.users.listings(userId, params),
    enabled: Boolean(userId) && (options.enabled ?? true),
    queryFn: async () => unwrap(await getUserListingsRequest(userId, params)),
  });

  return {
    listings: query.data?.listings || [],
    totalItems: query.data?.totalItems || 0,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
}

// ── Mutations ──────────────────────────────────────────────────────────

/** Every listing write invalidates the same set of caches. */
const useListingInvalidator = () => {
  const queryClient = useQueryClient();
  return (id) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    queryClient.invalidateQueries({ queryKey: ["users"] });
    if (id) queryClient.invalidateQueries({ queryKey: queryKeys.listings.detail(id) });
  };
};

export function useCreateListing() {
  const invalidate = useListingInvalidator();
  return useMutation({
    mutationFn: (formData) => createListingRequest(formData).then((r) => r.data?.data),
    onSuccess: () => invalidate(),
  });
}

export function useUpdateListing() {
  const invalidate = useListingInvalidator();
  return useMutation({
    mutationFn: ({ id, formData }) => updateListingRequest(id, formData).then((r) => r.data?.data),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}

export function useUpdateListingStatus() {
  const invalidate = useListingInvalidator();
  return useMutation({
    mutationFn: ({ id, status, buyerId }) =>
      updateListingStatusRequest(id, { status, buyerId }).then((r) => r.data?.data),
    onSuccess: (_, variables) => invalidate(variables.id),
  });
}

export function useDeleteListing() {
  const queryClient = useQueryClient();
  const invalidate = useListingInvalidator();
  return useMutation({
    mutationFn: (id) => deleteListingRequest(id).then(() => id),
    onSuccess: (id) => {
      invalidate();
      queryClient.removeQueries({ queryKey: queryKeys.listings.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.list });
    },
  });
}

export function useReportListing() {
  return useMutation({
    mutationFn: ({ id, reason }) => reportListingRequest(id, reason),
  });
}
