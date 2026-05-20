import { Server } from "socket.io";
import { verifyAccessToken } from "../utils/tokens.js";
import User from "../models/user.model.js";

// In-memory online presence: userId (string) → Set of socket IDs
const onlineUsers = new Map();

export const getOnlineUserIds = () => [...onlineUsers.keys()];
export const isUserOnline = (userId) => onlineUsers.has(String(userId));

let io;

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized.");
  return io;
};

export const initSocket = (httpServer) => {
  const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    transports: ["websocket", "polling"],
  });

  // ---------------------
  // Auth Middleware
  // ---------------------
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) return next(new Error("Authentication required."));

      const decoded = verifyAccessToken(token);
      const user = await User.findById(decoded.id).select("_id name avatar isBanned");

      if (!user) return next(new Error("User not found."));
      if (user.isBanned) return next(new Error("Account suspended."));

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch {
      next(new Error("Invalid token."));
    }
  });

  // ---------------------
  // Connection
  // ---------------------
  io.on("connection", (socket) => {
    const userId = socket.userId;

    // Track online presence
    if (!onlineUsers.has(userId)) {
      onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId).add(socket.id);

    // Join personal room for targeted events
    socket.join(`user:${userId}`);

    // Broadcast online status
    socket.broadcast.emit("user:online", { userId });

    console.log(`[Socket] Connected: ${userId} (${socket.id})`);

    // ---------------------
    // Chat Events (Sprint 3)
    // ---------------------
    // Handlers imported dynamically in Sprint 3
    // For now, just stub the event name to confirm connection works
    socket.on("ping:server", (cb) => {
      if (typeof cb === "function") cb({ pong: true, userId });
    });

    // ---------------------
    // Disconnect
    // ---------------------
    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) {
          onlineUsers.delete(userId);
          socket.broadcast.emit("user:offline", { userId });
        }
      }
      console.log(`[Socket] Disconnected: ${userId} (${socket.id})`);
    });
  });

  console.log("✓ Socket.io initialized");
  return io;
};
