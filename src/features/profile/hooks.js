"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/errors";

export const getProfileRequest = (userId) => api.get(`/users/${userId}`);
export const getReviewsRequest = (userId, params = {}) =>
  api.get(`/users/${userId}/reviews`, { params });
export const reportUserRequest = (userId, reason) => api.post(`/users/${userId}/report`, { reason });

export const createReviewRequest = (payload) => api.post("/reviews", payload);
export const getPendingReviewsRequest = () => api.get("/reviews/pending");

export function usePublicProfile(userId, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.users.profile(userId),
    enabled: Boolean(userId) && (options.enabled ?? true),
    queryFn: async () => (await getProfileRequest(userId)).data?.data,
  });

  return {
    profile: query.data || null,
    isLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Could not load this profile.") : "",
  };
}

export function useUserReviews(userId, params = {}, options = {}) {
  const query = useQuery({
    queryKey: queryKeys.users.reviews(userId, params),
    enabled: Boolean(userId) && (options.enabled ?? true),
    queryFn: async () => (await getReviewsRequest(userId, params)).data?.data,
  });

  return {
    reviews: query.data?.reviews || [],
    distribution: query.data?.distribution || {},
    totalItems: query.data?.totalItems || 0,
    isLoading: query.isLoading,
  };
}

/**
 * Deals the signed-in user closed but has not rated yet. Drives the "rate your
 * recent deals" prompt, which is where nearly all review volume comes from.
 */
export function usePendingReviews(options = {}) {
  const query = useQuery({
    queryKey: queryKeys.reviews.pending,
    enabled: options.enabled ?? true,
    queryFn: async () => (await getPendingReviewsRequest()).data?.data || [],
  });

  return { pending: query.data || [], isLoading: query.isLoading };
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createReviewRequest(payload).then((r) => r.data?.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.pending });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useReportUser() {
  return useMutation({
    mutationFn: ({ userId, reason }) => reportUserRequest(userId, reason),
  });
}
