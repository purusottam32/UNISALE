import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: (value) => Array.isArray(value) && value.length >= 2,
        message: "A conversation must include at least two participants.",
      },
    },
    /** The listing this thread is about. Null for direct (non-listing) chats. */
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      default: null,
    },

    /**
     * Denormalised preview so the inbox renders from a single query instead of
     * N per-conversation lookups.
     */
    lastMessage: {
      text: { type: String, default: "" },
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      kind: { type: String, default: "text" },
    },
    lastMessageAt: { type: Date, default: Date.now },

    /** Per-participant unread counts, keyed by user id string. */
    unread: {
      type: Map,
      of: Number,
      default: () => new Map(),
    },

    /** User ids that have archived this thread from their own inbox. */
    archivedBy: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
  },
  { timestamps: true }
);

conversationSchema.index({ participants: 1, lastMessageAt: -1 });
conversationSchema.index({ product: 1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;
