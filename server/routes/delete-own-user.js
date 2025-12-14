import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.delete("/", auth([1, 2, 3]), async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User not identified" });
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.delete({
        where: { userId: Number(userId) },
      });
    });

    console.log(`Deleted user ${userId} and their associated data.`);
    res.json({
      message: "Profile and all associated data deleted successfully.",
    });
  } catch (e) {
    console.error("Error deleting user: ", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
