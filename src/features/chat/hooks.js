"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { getErrorMessage } from "@/lib/errors";
import { useAuth } from "@/features/auth/auth-context";
import {
  getConversationsRequest,
  getMessagesRequest,
  markReadRequest,
  sendMessageRequest,
  startConversationRequest,
  toggleArchiveRequest,
} from "./api";
import { emitWithAck, getSocket } from "./socket";
import { useSocket } from "./socket-provider";

export function useConversations(options = {}) {
  const { isAuthenticated } = useAuth();

  const query = useQuery({
    queryKey: queryKeys.chat.conversations,
    enabled: isAuthenticated && (options.enabled ?? true),
    queryFn: async () => (await getConversationsRequest()).data?.data || [],
  });

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Could not load your chats.") : "",
  };
}

/**
 * A single conversation: history from REST, live updates from the socket.
 *
 * Sending goes through the socket when connected (instant, no HTTP overhead)
 * and silently falls back to REST when it is not — some campus networks block
 * WebSockets outright, and chat is too important to lose there.
 */
export function useConversation(conversationId) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const [typingUser, setTypingUser] = useState(null);
  const typingTimer = useRef(null);

  const query = useQuery({
    queryKey: queryKeys.chat.messages(conversationId),
    enabled: Boolean(conversationId),
    queryFn: async () => (await getMessagesRequest(conversationId, { limit: 60 })).data?.data,
  });

  const appendMessage = useCallback(
    (message) => {
      queryClient.setQueryData(queryKeys.chat.messages(conversationId), (previous) => {
        if (!previous) return previous;
        // Guard against the double-delivery that happens when the sender is
        // also in the conversation room.
        if (previous.messages.some((existing) => existing._id === message._id)) return previous;
        return { ...previous, messages: [...previous.messages, message] };
      });
    },
    [conversationId, queryClient]
  );

  // Join the thread room and subscribe to its live events.
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return undefined;

    socket.emit("conversation:join", { conversationId });
    socket.emit("message:read", { conversationId });

    const onNew = (message) => {
      if (String(message.conversationId) !== String(conversationId)) return;
      appendMessage(message);
      if (String(message.sender?._id || message.sender) !== String(user?.id)) {
        socket.emit("message:read", { conversationId });
      }
    };

    const onTypingStart = ({ conversationId: id, name }) => {
      if (String(id) !== String(conversationId)) return;
      setTypingUser(name || "Typing");
      window.clearTimeout(typingTimer.current);
      // Safety net in case the `typing:stop` event never arrives.
      typingTimer.current = window.setTimeout(() => setTypingUser(null), 4000);
    };

    const onTypingStop = ({ conversationId: id }) => {
      if (String(id) === String(conversationId)) setTypingUser(null);
    };

    const onRead = ({ conversationId: id }) => {
      if (String(id) !== String(conversationId)) return;
      queryClient.setQueryData(queryKeys.chat.messages(conversationId), (previous) =>
        previous
          ? {
              ...previous,
              messages: previous.messages.map((message) =>
                String(message.sender?._id || message.sender) === String(user?.id) && !message.readAt
                  ? { ...message, readAt: new Date().toISOString() }
                  : message
              ),
            }
          : previous
      );
    };

    socket.on("message:new", onNew);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);
    socket.on("message:read", onRead);

    return () => {
      socket.emit("conversation:leave", { conversationId });
      socket.off("message:new", onNew);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      socket.off("message:read", onRead);
      window.clearTimeout(typingTimer.current);
    };
  }, [conversationId, isConnected, appendMessage, queryClient, user?.id]);

  // Clear this thread's unread badge as soon as it is opened.
  useEffect(() => {
    if (!conversationId) return;
    markReadRequest(conversationId)
      .then(() => queryClient.invalidateQueries({ queryKey: queryKeys.notifications.badges }))
      .catch(() => {});
  }, [conversationId, queryClient]);

  const send = useCallback(
    async (text) => {
      const body = String(text || "").trim();
      if (!body) return;

      try {
        const response = await emitWithAck("message:send", { conversationId, text: body });
        appendMessage(response.message);
      } catch {
        const response = await sendMessageRequest(conversationId, { text: body });
        appendMessage(response.data?.data);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations });
    },
    [conversationId, appendMessage, queryClient]
  );

  const setTyping = useCallback(
    (isTyping) => {
      const socket = getSocket();
      socket?.emit(isTyping ? "typing:start" : "typing:stop", { conversationId });
    },
    [conversationId]
  );

  return {
    conversation: query.data?.conversation || null,
    messages: query.data?.messages || [],
    isLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error, "Could not load this chat.") : "",
    typingUser,
    send,
    setTyping,
    isLive: isConnected,
  };
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => startConversationRequest(payload).then((r) => r.data?.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations }),
  });
}

export function useToggleArchive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId) => toggleArchiveRequest(conversationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.chat.conversations }),
  });
}
