import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.patch("/", auth([1, 2, 3]), async (req, res) => {
  try {
    const userId = req.user?.id;
    const notificationId = parseInt(req.params.id);

    if (isNaN(notificationId)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const updated = await prisma.notifications.updateMany({
      where: {
        notificationId: notificationId,
        userId: parseInt(userId),
      },
      data: {
        isRead: true,
      },
    });

    if (updated.count === 0) {
      return res
        .status(404)
        .json({ error: "Notification not found or unauthorized" });
    }

    res.json({ success: true });
  } catch (e) {
    console.error("Error marking notification read:", e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
