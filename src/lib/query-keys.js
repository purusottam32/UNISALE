/**
 * Every React Query cache key in one place. Keys are hierarchical so a broad
 * invalidation (`queryKeys.listings.all`) sweeps all the narrow ones under it.
 */
export const queryKeys = {
  auth: {
    profile: ["auth", "profile"],
  },
  listings: {
    all: ["listings"],
    list: (params = {}) => ["listings", "list", params],
    feed: (params = {}) => ["listings", "feed", params],
    trending: (params = {}) => ["listings", "trending", params],
    detail: (id) => ["listings", "detail", id],
    similar: (id) => ["listings", "similar", id],
  },
  users: {
    profile: (id) => ["users", id, "profile"],
    listings: (id, params = {}) => ["users", id, "listings", params],
    reviews: (id, params = {}) => ["users", id, "reviews", params],
  },
  saved: {
    list: ["saved", "list"],
    ids: ["saved", "ids"],
  },
  chat: {
    conversations: ["chat", "conversations"],
    messages: (conversationId) => ["chat", "messages", conversationId],
  },
  notifications: {
    list: (params = {}) => ["notifications", "list", params],
    badges: ["notifications", "badges"],
  },
  reviews: {
    pending: ["reviews", "pending"],
  },
};
