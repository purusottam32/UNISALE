import { Server } from "socket.io";
import config from "../config/index.js";
import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/user.model.js";
import registerChatHandlers from "./chat.handlers.js";
import registerPresenceHandlers from "./presence.handlers.js";

/** userId (string) → Set of socket ids. A user may have several tabs open. */
const onlineUsers = new Map();

export const getOnlineUserIds = () => [...onlineUsers.keys()];
export const isUserOnline = (userId) => onlineUsers.has(String(userId));

let io;

export const getIO = () => {
  if (!io) throw new Error("Socket.io has not been initialised.");
  return io;
};

/** Room name convention: every user gets a private room for targeted emits. */
export const userRoom = (userId) => `user:${String(userId)}`;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: config.clientOrigins, credentials: true },
    transports: ["websocket", "polling"],
  });

  // ── Handshake authentication ─────────────────────────────────────────
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Authentication required."));

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("_id name avatar isBanned");

      if (!user) return next(new Error("User not found."));
      if (user.isBanned) return next(new Error("Account suspended."));

      socket.userId = user._id.toString();
      socket.user = user;
      return next();
    } catch {
      return next(new Error("Invalid token."));
    }
  });

  io.on("connection", (socket) => {
    const { userId } = socket;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);

    socket.join(userRoom(userId));
    socket.broadcast.emit("presence:online", { userId });

    registerChatHandlers(io, socket);
    registerPresenceHandlers(io, socket, { onlineUsers });

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (!sockets) return;

      sockets.delete(socket.id);
      if (sockets.size === 0) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("presence:offline", { userId, lastSeen: new Date().toISOString() });
      }
    });
  });

  return io;
};
