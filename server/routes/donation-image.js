import { Router } from "express";
import { auth } from "../middleware/auth.js";
import prisma from "../utils/prisma.js";
import path from "path";
import fs from "fs";

const router = Router();

// Get image URLs for a donation
router.get("/:donationId", auth([1, 2, 3]), async (req, res) => {
  try {
    const donationId = parseInt(req.params.donationId);
    const userId = req.user?.id;
    const roleId = req.user?.roleId;

    const donation = await prisma.donation.findUnique({
      where: { donationId },
      select: { userId: true }
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const hasAccess = donation.userId === userId || roleId === 2 || roleId === 3;
    
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    const donationFolder = path.join(
      process.cwd(), 
      'server/uploads/donations', 
      donationId.toString()
    );

    if (!fs.existsSync(donationFolder)) {
      return res.json({ images: [] }); // Respond with empty array
    }

    const files = fs.readdirSync(donationFolder);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
    });

    const images = imageFiles.map(file => 
      `/api/donation-image/${donationId}/${file}`
    );

    res.json({ images });
  } catch (e) {
    console.error("Error fetching donation images:", e);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:donationId/:filename", auth([1, 2, 3]), async (req, res) => {
  try {
    const donationId = parseInt(req.params.donationId);
    const filename = req.params.filename;
    const userId = req.user?.id;
    const roleId = req.user?.roleId;

    const donation = await prisma.donation.findUnique({
      where: { donationId },
      select: { userId: true }
    });

    if (!donation) {
      return res.status(404).json({ error: "Donation not found" });
    }

    const hasAccess = donation.userId === userId || roleId === 2 || roleId === 3;
    
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied" });
    }

    // prevents file traversal attacks
    const safeName = path.basename(filename);
    
    const imagePath = path.join(
      process.cwd(),
      'server/uploads/donations',
      donationId.toString(),
      safeName
    );

    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({ error: "Image not found" });
    }

    res.sendFile(imagePath);
  } catch (e) {
    console.error("Error serving image:", e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;