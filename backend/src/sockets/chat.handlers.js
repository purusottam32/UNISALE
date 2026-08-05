import {
  getConversationMessagesService,
  markConversationReadService,
  sendMessageService,
} from "../services/chat.service.js";
import Conversation from "../models/conversation.model.js";

const conversationRoom = (conversationId) => `conversation:${String(conversationId)}`;

/**
 * Socket callbacks follow the Node convention of a single result object with an
 * explicit `ok` flag, so the client never has to guess whether an ack succeeded.
 */
const reply = (callback, payload) => {
  if (typeof callback === "function") callback(payload);
};

const registerChatHandlers = (io, socket) => {
  const { userId } = socket;

  /** Join a thread's room so both parties receive live updates. */
  socket.on("conversation:join", async ({ conversationId } = {}, callback) => {
    try {
      const conversation = await Conversation.findById(conversationId).select("participants");
      if (!conversation) return reply(callback, { ok: false, error: "Conversation not found." });

      const allowed = conversation.participants.some((id) => String(id) === userId);
      if (!allowed) return reply(callback, { ok: false, error: "Not a participant." });

      socket.join(conversationRoom(conversationId));
      return reply(callback, { ok: true });
    } catch (error) {
      return reply(callback, { ok: false, error: error.message });
    }
  });

  socket.on("conversation:leave", ({ conversationId } = {}) => {
    socket.leave(conversationRoom(conversationId));
  });

  socket.on("message:send", async ({ conversationId, text, imageUrl, kind } = {}, callback) => {
    try {
      const { message, recipientIds } = await sendMessageService({
        conversationId,
        userId,
        text,
        imageUrl,
        kind: kind || (imageUrl ? "image" : "text"),
      });

      const payload = message.toJSON();

      // Deliver to everyone currently viewing the thread…
      io.to(conversationRoom(conversationId)).emit("message:new", payload);
      // …and nudge recipients' inbox badges wherever else they are in the app.
      recipientIds.forEach((id) => {
        io.to(`user:${id}`).emit("conversation:updated", {
          conversationId,
          lastMessage: { text: payload.text, kind: payload.kind, sender: userId },
          lastMessageAt: payload.createdAt,
        });
      });

      return reply(callback, { ok: true, message: payload });
    } catch (error) {
      return reply(callback, { ok: false, error: error.message });
    }
  });

  socket.on("message:read", async ({ conversationId } = {}, callback) => {
    try {
      const result = await markConversationReadService({ conversationId, userId });
      socket.to(conversationRoom(conversationId)).emit("message:read", {
        conversationId,
        readerId: userId,
        readAt: result.readAt,
      });
      return reply(callback, { ok: true, ...result });
    } catch (error) {
      return reply(callback, { ok: false, error: error.message });
    }
  });

  socket.on("typing:start", ({ conversationId } = {}) => {
    socket.to(conversationRoom(conversationId)).emit("typing:start", {
      conversationId,
      userId,
      name: socket.user?.name,
    });
  });

  socket.on("typing:stop", ({ conversationId } = {}) => {
    socket.to(conversationRoom(conversationId)).emit("typing:stop", { conversationId, userId });
  });

  /** Lets a reconnecting client resync without a REST round-trip. */
  socket.on("conversation:history", async ({ conversationId, page, limit } = {}, callback) => {
    try {
      const data = await getConversationMessagesService({
        conversationId,
        userId,
        query: { page, limit },
      });
      return reply(callback, { ok: true, ...data });
    } catch (error) {
      return reply(callback, { ok: false, error: error.message });
    }
  });
};

export default registerChatHandlers;
