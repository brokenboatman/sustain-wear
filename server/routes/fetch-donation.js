import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([1, 2, 3]), async (req, res) => {
  try {
    const donationId = req.query.donationId;
    const userId = req.user.id;
    const userRole = req.user.roleId;

    if (!donationId) {
      return res
        .status(400)
        .json({ error: "Bad Request: donationId is required" });
    }

    const donation = await prisma.donation.findUnique({
      where: {
        donationId: parseInt(donationId),
      },
      include: {
        status: true,
        category: true,
        gender: true,
        size: true,
        colour: true,
        material: true,
        condition: true,
        images: true,
      },
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    if (userRole === 1 && donation.userId !== userId) {
      // Regular user
      return res
        .status(403)
        .json({ error: "Unauthorized access to this donation" });
    }

    res.json({ donation });
  } catch (e) {
    console.error("Error fetching donation:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
