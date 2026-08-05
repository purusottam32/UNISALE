import Notification from "../models/notification.model.js";
import AppError from "../utils/apiError.js";

/**
 * Creates a notification and pushes it to the recipient's socket room if they
 * are connected. Socket delivery is best-effort — a transport failure must
 * never fail the business action that triggered the notification.
 */
export const createNotification = async ({ recipient, type, title, body = "", href = "", image = "" }) => {
  const notification = await Notification.create({ recipient, type, title, body, href, image });

  try {
    const { getIO } = await import("../sockets/index.js");
    getIO().to(`user:${String(recipient)}`).emit("notification:new", notification.toJSON());
  } catch {
    // Socket layer not initialised (scripts, tests) or user offline — ignore.
  }

  return notification;
};

export const listNotificationsService = async ({ userId, query = {} }) => {
  const currentPage = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 20, 1), 50);

  const filter = { recipient: userId };
  if (query.unreadOnly === "true" || query.unreadOnly === true) filter.readAt = null;

  const [notifications, totalItems, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * limit)
      .limit(limit),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: userId, readAt: null }),
  ]);

  return {
    notifications,
    unreadCount,
    totalItems,
    currentPage,
    totalPages: Math.ceil(totalItems / limit) || 1,
  };
};

export const markNotificationReadService = async ({ userId, notificationId }) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient: userId },
    { readAt: new Date() },
    { new: true }
  );

  if (!notification) throw new AppError("Notification not found.", 404);
  return notification;
};

export const markAllNotificationsReadService = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, readAt: null },
    { readAt: new Date() }
  );
  return { updated: result.modifiedCount };
};

export const getUnreadCountService = async (userId) =>
  Notification.countDocuments({ recipient: userId, readAt: null });
