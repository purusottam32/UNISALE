import mongoose from "mongoose";
import { NOTIFICATION_TYPES } from "../config/constants.js";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    body: { type: String, trim: true, maxlength: 300, default: "" },
    /** In-app destination, e.g. `/messages/64f...` */
    href: { type: String, trim: true, default: "" },
    /** Small square image (listing thumbnail or sender avatar). */
    image: { type: String, trim: true, default: "" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, readAt: 1 });
// Auto-expire after 60 days so the collection cannot grow unbounded.
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 60 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
