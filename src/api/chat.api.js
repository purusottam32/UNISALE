import api from "./axios";

export const startConversationRequest = (payload) => api.post("/chat/start", payload);

export const getConversationsRequest = () => api.get("/chat/conversations");

export const getConversationMessagesRequest = (conversationId, params = {}) =>
  api.get(`/chat/${conversationId}`, { params });

export const sendMessageRequest = (payload) => api.post("/chat/send", payload);
