import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.get("/", auth([3]), async (req, res) => {
    try {
        const users = await prisma.user.findMany();

        console.log("Found users:", users);

        res.json({ users, meta: { count: users.length } });
    } catch (e) {
        console.error("Error fetching users:", e);
        res.status(500).json({ error: "Server error", details: e.message });
    }
});

export default router;