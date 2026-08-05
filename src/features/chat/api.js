import api from "@/lib/api-client";

export const getConversationsRequest = (params = {}) => api.get("/chat/conversations", { params });

export const startConversationRequest = (payload) => api.post("/chat/conversations", payload);

export const getMessagesRequest = (conversationId, params = {}) =>
  api.get(`/chat/conversations/${conversationId}`, { params });

/** REST fallback used when the socket is not connected. */
export const sendMessageRequest = (conversationId, payload) =>
  api.post(`/chat/conversations/${conversationId}/messages`, payload);

export const markReadRequest = (conversationId) =>
  api.patch(`/chat/conversations/${conversationId}/read`);

export const toggleArchiveRequest = (conversationId) =>
  api.patch(`/chat/conversations/${conversationId}/archive`);
