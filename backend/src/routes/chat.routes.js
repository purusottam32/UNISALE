import express from "express";
import mongoose from "mongoose";
import {
  getConversationMessages,
  getConversations,
  sendMessage,
  startConversation,
} from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import AppError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = express.Router();
router.use(protect);

const validateId = (paramName) =>
  asyncHandler(async (req, res, next) => {
    const val = req.params[paramName] || req.body[paramName];
    if (val && !mongoose.Types.ObjectId.isValid(val)) {
      throw new AppError(`Invalid ${paramName}.`, 400);
    }
    next();
  });

router.post("/start", startConversation);
router.get("/conversations", getConversations);
router.get("/:conversationId", validateId("conversationId"), getConversationMessages);
router.post("/send", sendMessage);

export default router;
