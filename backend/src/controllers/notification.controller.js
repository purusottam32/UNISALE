import asyncHandler from "../utils/asyncHandler.js";
import {
  getUnreadCountService,
  listNotificationsService,
  markAllNotificationsReadService,
  markNotificationReadService,
} from "../services/notification.service.js";
import { getTotalUnreadService } from "../services/chat.service.js";

export const listNotifications = asyncHandler(async (req, res) => {
  const result = await listNotificationsService({ userId: req.user._id, query: req.query });
  res.status(200).json({ success: true, data: result });
});

/**
 * Single source for every badge in the app shell, so the client polls one
 * cheap endpoint instead of three.
 */
export const getBadgeCounts = asyncHandler(async (req, res) => {
  const [notifications, messages] = await Promise.all([
    getUnreadCountService(req.user._id),
    getTotalUnreadService(req.user._id),
  ]);

  res.status(200).json({ success: true, data: { notifications, messages } });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await markNotificationReadService({
    userId: req.user._id,
    notificationId: req.params.id,
  });
  res.status(200).json({ success: true, data: notification });
});

export const markAllRead = asyncHandler(async (req, res) => {
  const result = await markAllNotificationsReadService(req.user._id);
  res.status(200).json({ success: true, message: "All notifications marked read.", ...result });
});
