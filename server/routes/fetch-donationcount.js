import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([1]), async (req, res) => {
  try {
    const userIdFromToken = req.user?.id;

    if (!userIdFromToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID missing in token" });
    }

    const userIdInt = parseInt(userIdFromToken);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    // console.log("Fetching stats for userId:", userIdInt);

    const totalDonations = await prisma.donation.count({
      where: {
        userId: userIdInt,
      },
    });

    res.json({
      stats: {
        totalDonations: totalDonations,
      },
    });
  } catch (e) {
    console.error("Error fetching user stats:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
