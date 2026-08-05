import { Router } from "express";
import {
  getConversationMessages,
  getConversations,
  getUnreadTotal,
  markRead,
  sendMessage,
  startConversation,
  toggleArchive,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validation.middleware.js";

const router = Router();
router.use(protect);

const withId = validateObjectId("conversationId");

router.get("/conversations", getConversations);
router.get("/unread", getUnreadTotal);
router.post("/conversations", startConversation);

router.get("/conversations/:conversationId", withId, getConversationMessages);
router.post("/conversations/:conversationId/messages", withId, sendMessage);
router.patch("/conversations/:conversationId/read", withId, markRead);
router.patch("/conversations/:conversationId/archive", withId, toggleArchive);

export default router;
