import { Router } from "express";
import {
  getBadgeCounts,
  listNotifications,
  markAllRead,
  markRead,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validation.middleware.js";

const router = Router();
router.use(protect);

router.get("/", listNotifications);
router.get("/badges", getBadgeCounts);
router.patch("/read-all", markAllRead);
router.patch("/:id/read", validateObjectId("id"), markRead);

export default router;
