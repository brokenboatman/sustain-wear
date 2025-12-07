import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.delete("/", auth([3]), async (req, res) => {
    try{
        const donationId = req.query.donationId;

        if(!donationId) {
            return res
                .status(400)
                .json({ error: "Bad Request: donationId query parameter is required" });
        }

        // deletes donation from ID
        const deletedDonation = await prisma.donation.delete({
            where: {
                donationId: parseInt(donationId),
            },
        });

        console.log("Deleted donation: ", deletedDonation);

    } catch(e) {
        console.error("Error deleting donation: ", e);
        res.status(500).json({ error: "Server error", details: e.message });
    }
})

export default router;