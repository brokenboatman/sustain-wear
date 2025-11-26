// server/routes/my-donations.js
import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([1]), async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        console.log('Searching for userId:', userId, 'Type:', typeof userId);

        const donations = await prisma.donation.findMany({
            where: { 
                userId: parseInt(userId) // Ensure it's an integer
            },
            include: {
                status: true,
            },
        });

        console.log('Found donations:', donations);
        
        res.json({ donations, meta: { count: donations.length } });
    } catch (e) {
        console.error('Error fetching donations:', e);
        res.status(500).json({ error: "Server error", details: e.message });
    }
});

export default router;