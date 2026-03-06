import asyncHandler from "../utils/asyncHandler.js";
import {
  getConversationMessagesService,
  getUserConversationsService,
  sendMessageService,
  startConversationService,
} from "../services/chat.service.js";

export const startConversation = asyncHandler(async (req, res) => {
  const conversation = await startConversationService({
    currentUserId: req.user._id,
    sellerId: req.body.sellerId,
    productId: req.body.productId,
  });

  res.status(201).json({
    success: true,
    data: conversation,
  });
});

export const getConversations = asyncHandler(async (req, res) => {
  const conversations = await getUserConversationsService(req.user._id);

  res.status(200).json({
    success: true,
    data: conversations,
  });
});

export const getConversationMessages = asyncHandler(async (req, res) => {
  const payload = await getConversationMessagesService({
    conversationId: req.params.conversationId,
    userId: req.user._id,
    query: req.query,
  });

  res.status(200).json({
    success: true,
    data: payload,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const message = await sendMessageService({
    conversationId: req.body.conversationId,
    userId: req.user._id,
    text: req.body.text,
  });

  res.status(201).json({
    success: true,
    data: message,
  });
});
