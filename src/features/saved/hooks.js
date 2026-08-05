"use client";

import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/auth-context";

export const getSavedRequest = () => api.get("/wishlist");
export const getSavedIdsRequest = () => api.get("/wishlist/ids");
export const addSavedRequest = (listingId) => api.post("/wishlist", { listingId });
export const removeSavedRequest = (listingId) => api.delete(`/wishlist/${listingId}`);

/** Full saved-items list, used by the /saved page. */
export function useSavedListings() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.saved.list,
    enabled: isAuthenticated,
    queryFn: async () => (await getSavedRequest()).data?.data || [],
  });

  return {
    items: query.data || [],
    listings: (query.data || []).map((item) => item.productId).filter(Boolean),
    isLoading: query.isLoading,
  };
}

/**
 * Save/unsave with an optimistic id set.
 *
 * The heart has to flip on the very first frame — a save that waits for a round
 * trip feels broken on a slow campus connection — so we mutate the id cache
 * immediately and roll it back if the request fails.
 */
export function useSaveToggle() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const idsQuery = useQuery({
    queryKey: queryKeys.saved.ids,
    enabled: isAuthenticated,
    staleTime: 60_000,
    queryFn: async () => (await getSavedIdsRequest()).data?.data || [],
  });

  const savedIds = useMemo(() => new Set(idsQuery.data || []), [idsQuery.data]);

  const mutation = useMutation({
    mutationFn: ({ listingId, isSaved }) =>
      isSaved ? removeSavedRequest(listingId) : addSavedRequest(listingId),

    onMutate: async ({ listingId, isSaved }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.saved.ids });
      const previous = queryClient.getQueryData(queryKeys.saved.ids) || [];

      queryClient.setQueryData(
        queryKeys.saved.ids,
        isSaved ? previous.filter((id) => id !== listingId) : [...previous, listingId]
      );

      return { previous };
    },

    onError: (_error, _variables, context) => {
      if (context?.previous) queryClient.setQueryData(queryKeys.saved.ids, context.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.ids });
      queryClient.invalidateQueries({ queryKey: queryKeys.saved.list });
    },
  });

  const toggle = useCallback(
    (listingId) => {
      if (!listingId) return Promise.resolve();
      return mutation.mutateAsync({ listingId, isSaved: savedIds.has(String(listingId)) });
    },
    [mutation, savedIds]
  );

  return {
    savedIds,
    isSaved: useCallback((id) => savedIds.has(String(id)), [savedIds]),
    toggle,
    isPending: mutation.isPending,
  };
}
