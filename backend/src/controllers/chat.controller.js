import asyncHandler from "../utils/asyncHandler.js";
import {
  archiveConversationService,
  getConversationMessagesService,
  getTotalUnreadService,
  getUserConversationsService,
  markConversationReadService,
  sendMessageService,
  serializeConversation,
  startConversationService,
} from "../services/chat.service.js";

export const startConversation = asyncHandler(async (req, res) => {
  const { conversation, isNew } = await startConversationService({
    currentUserId: req.user._id,
    sellerId: req.body.sellerId,
    productId: req.body.listingId || req.body.productId,
  });

  res.status(isNew ? 201 : 200).json({
    success: true,
    data: serializeConversation(conversation, req.user._id),
  });
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversationsService({
    userId: req.user._id,
    includeArchived: req.query.includeArchived === "true",
  });

  res.status(200).json({ success: true, data: conversations });
});

export const getConversationMessages = asyncHandler(async (req, res) => {
  const payload = await getConversationMessagesService({
    conversationId: req.params.conversationId,
    userId: req.user._id,
    query: req.query,
  });

  res.status(200).json({ success: true, data: payload });
});

/**
 * REST fallback for sending. The socket path is preferred, but this keeps chat
 * working when WebSockets are blocked — some campus networks do exactly that.
 */
export const sendMessage = asyncHandler(async (req, res) => {
  const { message } = await sendMessageService({
    conversationId: req.params.conversationId || req.body.conversationId,
    userId: req.user._id,
    text: req.body.text,
    imageUrl: req.body.imageUrl,
    kind: req.body.kind || (req.body.imageUrl ? "image" : "text"),
  });

  res.status(201).json({ success: true, data: message });
});

export const markRead = asyncHandler(async (req, res) => {
  const result = await markConversationReadService({
    conversationId: req.params.conversationId,
    userId: req.user._id,
  });
  res.status(200).json({ success: true, data: result });
});

export const toggleArchive = asyncHandler(async (req, res) => {
  const result = await archiveConversationService({
    conversationId: req.params.conversationId,
    userId: req.user._id,
  });
  res.status(200).json({ success: true, data: result });
});

export const getUnreadTotal = asyncHandler(async (req, res) => {
  const unread = await getTotalUnreadService(req.user._id);
  res.status(200).json({ success: true, data: { unread } });
});
