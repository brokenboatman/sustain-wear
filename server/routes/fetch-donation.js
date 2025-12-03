// server/routes/my-donations.js
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";
import { renderSlot } from "vue";

const router = Router();

router.get("/", auth([2,3]), async (req, res) => {
  
  try {
    const donationId = req.query.donationId;
    
    if (!donationId)
      return res
        .status(400)
        .json({ error: "Bad Request: donationId query parameter is required" });
    const donation = await prisma.donation.findUnique({
    where: {
        donationId: parseInt(donationId),
    },
      include: {
        status: true,
      },
    });
    if (!donation) {
        return res.status(404).json({ error: "Donation not found" });
    }

    console.log("Found donation:", donation);

    res.json({ donation });
  } catch (e) {
    console.error("Error fetching donations:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
