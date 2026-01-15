import express from "express";
import protect from "../../lib/middleware/protect.middleware.js";
import { getNotifications, markRead, markAllRead } from "./notification.controller.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markRead);
router.patch("/read-all", protect, markAllRead);

export default router;
