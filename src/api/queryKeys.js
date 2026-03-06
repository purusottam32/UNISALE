export const queryKeys = {
  auth: {
    profile: ["auth", "profile"],
  },
  products: {
    all: ["products"],
    list: (params = {}) => ["products", "list", params],
    detail: (id) => ["products", "detail", id],
  },
  users: {
    products: (userId, params = {}) => ["users", userId, "products", params],
  },
  wishlist: {
    list: ["wishlist"],
  },
  chat: {
    conversations: ["chat", "conversations"],
    messages: (conversationId, params = {}) => ["chat", "messages", conversationId, params],
  },
};
