import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([1, 2, 3]), async (req, res) => {
  try {
    const userIdFromToken = req.user?.id;

    if (!userIdFromToken)
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID missing in token" });

    const userIdInt = parseInt(userIdFromToken);
    if (isNaN(userIdInt))
      return res.status(400).json({ error: "Invalid User ID format" });

    // console.log("Searching for userId:", userIdInt, "Type:", typeof userIdInt);

    const donations = await prisma.donation.findMany({
      where: {
        userId: userIdInt,
      },
      include: {
        status: true,
        images: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    // console.log("Found donations:", donations);

    res.json({ donations, meta: { count: donations.length } });
  } catch (e) {
    console.error("Error fetching donations:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
