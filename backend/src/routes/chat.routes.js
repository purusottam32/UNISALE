import express from "express";
import {
  getConversationMessages,
  getConversations,
  sendMessage,
  startConversation,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  validateObjectIdField,
  validateObjectIdParam,
  validateRequiredFields,
} from "../middleware/validation.middleware.js";

const router = express.Router();

router.use(protect);

router.post(
  "/start",
  validateRequiredFields(["sellerId"]),
  validateObjectIdField("sellerId"),
  validateObjectIdField("productId"),
  startConversation
);

router.get("/conversations", getConversations);
router.get("/:conversationId", validateObjectIdParam("conversationId"), getConversationMessages);

router.post(
  "/send",
  validateRequiredFields(["conversationId", "text"]),
  validateObjectIdField("conversationId"),
  sendMessage
);

export default router;
