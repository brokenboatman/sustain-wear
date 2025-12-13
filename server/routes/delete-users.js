import { Router } from "express";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.delete("/", auth([3]), async (req, res) => {
  try {
    // get all userIds from query parameters
    const userIds = req.body.userIds;

    if (!userIds) {
        return res
            .status(400)
            .json({ error: "Bad Request: userIds query parameter is required" });
        }

    // deletes users from IDs
    const deletedUsers = await prisma.user.deleteMany({
        where: {
            userId: {
                in: userIds.map(id => parseInt(id)),
            },
        },
    });

    console.log(`Deleted ${deletedUsers.count} users and their associated data.`);
    res.json({
      message: "Profiles and all associated data deleted successfully.",
    });
  } catch (e) {
    console.error("Error deleting users: ", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
