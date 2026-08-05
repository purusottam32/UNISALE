import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";
import { createNotification } from "./notification.service.js";

const PARTICIPANT_FIELDS =
  "name avatar college department year ratingAverage ratingCount isEmailVerified";
const LISTING_FIELDS = "title images price status seller";

const isParticipant = (conversation, userId) =>
  conversation.participants.some(
    (participant) => String(participant._id || participant) === String(userId)
  );

const assertParticipant = (conversation, userId) => {
  if (!isParticipant(conversation, userId)) {
    throw new AppError("You are not a participant in this conversation.", 403);
  }
};

/**
 * Shapes a conversation for the inbox: resolves "the other person" and pulls
 * this user's own unread count out of the per-participant map.
 */
export const serializeConversation = (conversation, viewerId) => {
  const raw = typeof conversation.toObject === "function" ? conversation.toObject() : conversation;
  const other = raw.participants.find((participant) => String(participant._id) !== String(viewerId));
  const unreadMap =
    conversation.unread instanceof Map ? Object.fromEntries(conversation.unread) : raw.unread || {};

  return {
    _id: raw._id,
    listing: raw.product || null,
    counterparty: other || null,
    lastMessage: raw.lastMessage || null,
    lastMessageAt: raw.lastMessageAt,
    unreadCount: Number(unreadMap[String(viewerId)] || 0),
    isArchived: (raw.archivedBy || []).some((id) => String(id) === String(viewerId)),
    createdAt: raw.createdAt,
  };
};

export const startConversationService = async ({ currentUserId, sellerId, productId = null }) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new AppError("Invalid seller id.", 400);
  }
  if (String(currentUserId) === String(sellerId)) {
    throw new AppError("You cannot start a chat with yourself.", 400);
  }

  const seller = await User.findById(sellerId).select("_id isBanned");
  if (!seller || seller.isBanned) throw new AppError("Seller not found.", 404);

  let normalizedProductId = null;
  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("Invalid listing id.", 400);
    }
    const listing = await Listing.findById(productId).select("_id status");
    if (!listing || listing.status === "deleted") throw new AppError("Listing not found.", 404);
    normalizedProductId = listing._id;
  }

  const query = {
    participants: { $all: [currentUserId, sellerId], $size: 2 },
    product: normalizedProductId,
  };

  let conversation = await Conversation.findOne(query);
  let isNew = false;

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, sellerId],
      product: normalizedProductId,
      lastMessageAt: new Date(),
      unread: new Map([
        [String(currentUserId), 0],
        [String(sellerId), 0],
      ]),
    });
    isNew = true;

    // A new thread is the PRD's north-star event — count it on the listing.
    if (normalizedProductId) {
      await Listing.findByIdAndUpdate(normalizedProductId, { $inc: { chatCount: 1 } });
    }
  }

  await conversation.populate([
    { path: "participants", select: PARTICIPANT_FIELDS },
    { path: "product", select: LISTING_FIELDS },
  ]);

  return { conversation, isNew };
};

export const getUserConversationsService = async ({ userId, includeArchived = false }) => {
  const filter = { participants: userId };
  if (!includeArchived) filter.archivedBy = { $ne: userId };

  const conversations = await Conversation.find(filter)
    .sort({ lastMessageAt: -1 })
    .populate("participants", PARTICIPANT_FIELDS)
    .populate("product", LISTING_FIELDS);

  return conversations.map((conversation) => serializeConversation(conversation, userId));
};

export const getConversationMessagesService = async ({ conversationId, userId, query = {} }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId)
    .populate("participants", PARTICIPANT_FIELDS)
    .populate("product", LISTING_FIELDS);

  if (!conversation) throw new AppError("Conversation not found.", 404);
  assertParticipant(conversation, userId);

  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 40, 1), 100);

  const [messages, totalItems] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit)
      .populate("sender", "name avatar"),
    Message.countDocuments({ conversationId }),
  ]);

  return {
    conversation: serializeConversation(conversation, userId),
    // Query is newest-first for correct pagination; the UI renders oldest-first.
    messages: messages.reverse(),
    totalItems,
    currentPage,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};

/**
 * Persists a message, updates the conversation preview + unread counters, and
 * notifies the recipient. Shared by the REST endpoint and the socket handler so
 * both paths behave identically.
 */
export const sendMessageService = async ({ conversationId, userId, text, imageUrl, kind = "text" }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId).populate("product", "title images");
  if (!conversation) throw new AppError("Conversation not found.", 404);
  assertParticipant(conversation, userId);

  const body = String(text || "").trim();
  if (kind === "text" && !body) throw new AppError("Message text is required.", 400);
  if (kind === "image" && !imageUrl) throw new AppError("An image URL is required.", 400);

  const message = await Message.create({
    conversationId,
    sender: userId,
    kind,
    text: body,
    imageUrl: imageUrl || "",
  });

  const recipientIds = conversation.participants
    .map((participant) => String(participant._id || participant))
    .filter((id) => id !== String(userId));

  conversation.lastMessage = {
    text: kind === "image" ? "Photo" : body,
    sender: userId,
    kind,
  };
  conversation.lastMessageAt = new Date();
  recipientIds.forEach((id) => {
    conversation.unread.set(id, Number(conversation.unread.get(id) || 0) + 1);
  });
  conversation.unread.set(String(userId), 0);
  // Re-surface the thread for anyone who had archived it.
  conversation.archivedBy = [];
  await conversation.save();

  await message.populate("sender", "name avatar");

  const sender = await User.findById(userId).select("name avatar");
  await Promise.all(
    recipientIds.map((id) =>
      createNotification({
        recipient: id,
        type: "message",
        title: `New message from ${sender?.name || "a student"}`,
        body: kind === "image" ? "Sent a photo" : body.slice(0, 140),
        href: `/messages/${conversationId}`,
        image: sender?.avatar?.url || conversation.product?.images?.[0]?.url || "",
      })
    )
  );

  return { message, recipientIds };
};

export const markConversationReadService = async ({ conversationId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  assertParticipant(conversation, userId);

  conversation.unread.set(String(userId), 0);
  await conversation.save();

  const now = new Date();
  await Message.updateMany({ conversationId, sender: { $ne: userId }, readAt: null }, { readAt: now });

  return { conversationId, readAt: now };
};

export const archiveConversationService = async ({ conversationId, userId }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) throw new AppError("Conversation not found.", 404);
  assertParticipant(conversation, userId);

  const alreadyArchived = conversation.archivedBy.some((id) => String(id) === String(userId));
  conversation.archivedBy = alreadyArchived
    ? conversation.archivedBy.filter((id) => String(id) !== String(userId))
    : [...conversation.archivedBy, userId];

  await conversation.save();
  return { isArchived: !alreadyArchived };
};

export const getTotalUnreadService = async (userId) => {
  const conversations = await Conversation.find({ participants: userId }).select("unread");
  return conversations.reduce(
    (total, conversation) => total + Number(conversation.unread?.get(String(userId)) || 0),
    0
  );
};
