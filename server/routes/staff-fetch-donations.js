// server/routes/my-donations.js
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([3]), async (req, res) => {
  try {
    const donations = await prisma.donation.findMany({
      where: {
        statusId: 3, // arrived at charity status
      },
      include: {
        status: true,
      },
    });

    console.log("Found donations:", donations);

    res.json({ donations, meta: { count: donations.length } });
  } catch (e) {
    console.error("Error fetching donations:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
