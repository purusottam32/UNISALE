import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getConversationMessagesRequest,
  getConversationsRequest,
  sendMessageRequest,
  startConversationRequest,
} from "../api/chat.api";
import { queryKeys } from "../api/queryKeys";
import { getErrorMessage } from "../utils/getErrorMessage";

export const useConversations = (options = {}) => {
  const query = useQuery({
    queryKey: queryKeys.chat.conversations,
    enabled: options.enabled ?? true,
    queryFn: async () => {
      const response = await getConversationsRequest();
      return response.data?.data || [];
    },
  });

  return {
    conversations: query.data || [],
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load conversations.") : "",
    refetch: query.refetch,
  };
};

export const useConversationMessages = (conversationId, params = {}, options = {}) => {
  const query = useQuery({
    queryKey: queryKeys.chat.messages(conversationId, params),
    enabled: Boolean(conversationId) && (options.enabled ?? true),
    queryFn: async () => {
      const response = await getConversationMessagesRequest(conversationId, params);
      return response.data?.data || { messages: [], totalPages: 1, currentPage: 1 };
    },
  });

  return {
    conversation: query.data?.conversation || null,
    messages: query.data?.messages || [],
    totalPages: query.data?.totalPages || 1,
    currentPage: query.data?.currentPage || 1,
    loading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Failed to load messages.") : "",
    refetch: query.refetch,
  };
};

export const useStartConversationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await startConversationRequest(payload);
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations });
    },
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const response = await sendMessageRequest(payload);
      return response.data?.data;
    },
    onSuccess: (message) => {
      const conversationId = message?.conversationId?.toString?.() || message?.conversationId;

      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations });

      if (conversationId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.chat.messages(conversationId),
          exact: false,
        });
      }
    },
  });
};
