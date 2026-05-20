import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Listing from "../models/listing.model.js";
import User from "../models/user.model.js";
import AppError from "../utils/apiError.js";

const ensureParticipant = (conversation, userId) =>
  conversation.participants.some((participant) => participant.toString() === userId.toString());

export const startConversationService = async ({ currentUserId, sellerId, productId = null }) => {
  if (!mongoose.Types.ObjectId.isValid(sellerId)) {
    throw new AppError("Invalid seller id.", 400);
  }

  if (currentUserId.toString() === sellerId.toString()) {
    throw new AppError("You cannot start a chat with yourself.", 400);
  }

  const seller = await User.findById(sellerId).select("_id");
  if (!seller) {
    throw new AppError("Seller not found.", 404);
  }

  let normalizedProductId = null;

  if (productId) {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new AppError("Invalid product id.", 400);
    }

    const listing = await Listing.findById(productId).select("_id status seller");
    if (!listing || listing.status === "deleted") {
      throw new AppError("Listing not found.", 404);
    }

    normalizedProductId = listing._id;
  }

  const conversationQuery = {
    participants: {
      $all: [currentUserId, sellerId],
      $size: 2,
    },
  };

  if (normalizedProductId) {
    conversationQuery.product = normalizedProductId;
  }

  let conversation = await Conversation.findOne(conversationQuery)
    .populate("participants", "name email avatar")
    .populate("product", "title images price");

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [currentUserId, sellerId],
      product: normalizedProductId,
      lastMessageAt: new Date(),
    });

    conversation = await conversation
      .populate("participants", "name email avatar")
      .populate("product", "title images price");
  }

  return conversation;
};

export const getUserConversationsService = async (userId) => {
  const conversations = await Conversation.find({ participants: userId })
    .sort({ lastMessageAt: -1 })
    .populate("participants", "name email avatar")
    .populate("product", "title images price");

  return conversations;
};

export const getConversationMessagesService = async ({ conversationId, userId, query = {} }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError("Conversation not found.", 404);
  }

  if (!ensureParticipant(conversation, userId)) {
    throw new AppError("You are not a participant in this conversation.", 403);
  }

  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 30, 1), 100);
  const skip = (currentPage - 1) * limit;

  const [messages, totalItems] = await Promise.all([
    Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name email avatar"),
    Message.countDocuments({ conversationId }),
  ]);

  return {
    conversation,
    messages,
    totalPages: Math.ceil(totalItems / limit) || 1,
    currentPage,
    totalItems,
    limit,
  };
};

export const sendMessageService = async ({ conversationId, userId, text }) => {
  if (!mongoose.Types.ObjectId.isValid(conversationId)) {
    throw new AppError("Invalid conversation id.", 400);
  }

  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new AppError("Conversation not found.", 404);
  }

  if (!ensureParticipant(conversation, userId)) {
    throw new AppError("You are not a participant in this conversation.", 403);
  }

  const messageText = String(text || "").trim();
  if (!messageText) {
    throw new AppError("Message text is required.", 400);
  }

  const message = await Message.create({
    conversationId,
    sender: userId,
    text: messageText,
  });

  conversation.lastMessageAt = new Date();
  await conversation.save();

  return message.populate("sender", "name email avatar");
};
