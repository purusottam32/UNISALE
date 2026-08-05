"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api-client";
import { queryKeys } from "@/lib/query-keys";
import { useAuth } from "@/features/auth/auth-context";

export const getNotificationsRequest = (params = {}) => api.get("/notifications", { params });
export const getBadgesRequest = () => api.get("/notifications/badges");
export const markReadRequest = (id) => api.patch(`/notifications/${id}/read`);
export const markAllReadRequest = () => api.patch("/notifications/read-all");

/**
 * Unread counts for the shell badges. Sockets push most updates, so the poll
 * is a slow safety net for tabs that lost their connection, not the mechanism.
 */
export function useBadgeCounts() {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.notifications.badges,
    enabled: isAuthenticated,
    staleTime: 30_000,
    refetchInterval: 120_000,
    queryFn: async () => (await getBadgesRequest()).data?.data || { notifications: 0, messages: 0 },
  });

  return query.data || { notifications: 0, messages: 0 };
}

export function useNotifications(params = {}) {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.notifications.list(params),
    enabled: isAuthenticated,
    queryFn: async () => (await getNotificationsRequest(params)).data?.data,
  });

  return {
    notifications: query.data?.notifications || [],
    unreadCount: query.data?.unreadCount || 0,
    isLoading: query.isLoading,
  };
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  };

  return {
    markOne: useMutation({ mutationFn: markReadRequest, onSuccess: invalidate }),
    markAll: useMutation({ mutationFn: markAllReadRequest, onSuccess: invalidate }),
  };
}
