import User from "../models/user.model.js";

/**
 * Presence is intentionally in-memory: it is disposable state that should not
 * survive a restart. `lastActiveAt` on the user document is the durable fallback
 * used to render "Active 2h ago" when someone is offline.
 */
const registerPresenceHandlers = (io, socket, { onlineUsers }) => {
  const { userId } = socket;

  const touchLastActive = () => {
    User.updateOne({ _id: userId }, { lastActiveAt: new Date() }).catch(() => {});
  };

  touchLastActive();
  const heartbeat = setInterval(touchLastActive, 5 * 60 * 1000);

  socket.on("presence:check", ({ userIds = [] } = {}, callback) => {
    if (typeof callback !== "function") return;
    const online = userIds.filter((id) => onlineUsers.has(String(id)));
    callback({ ok: true, online });
  });

  socket.on("disconnect", () => {
    clearInterval(heartbeat);
    touchLastActive();
  });
};

export default registerPresenceHandlers;
