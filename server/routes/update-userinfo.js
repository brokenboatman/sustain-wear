import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.put("/", auth(), async (req, res) => {
  try {
    const userIdFromToken = req.user?.id || req.user?.userId;

    if (!userIdFromToken) {
      return res
        .status(401)
        .json({ error: "Unauthorized: User ID missing in token" });
    }

    const userIdInt = parseInt(userIdFromToken);
    if (isNaN(userIdInt)) {
      return res.status(400).json({ error: "Invalid User ID format" });
    }

    const { username, email, currentPassword, newPassword, profileURL } =
      req.body;

    console.log(`Attempting profile update for User ID: ${userIdInt}`);

    const user = await prisma.user.findUnique({
      where: { userId: userIdInt },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (email && email !== user.email) {
      const emailExists = await prisma.user.findUnique({ where: { email } });
      if (emailExists)
        return res.status(400).json({ error: "Email already in use" });
    }

    if (username && username !== user.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });
      if (usernameExists)
        return res.status(400).json({ error: "Username already taken" });
    }

    const updateData = {
      username: username || user.username,
      email: email || user.email,
      profileURL: profileURL || user.profileURL,
    };

    if (newPassword) {
      if (user.password) {
        if (!currentPassword) {
          return res
            .status(400)
            .json({ error: "Current password is required to set a new one" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
          return res.status(400).json({ error: "Incorrect current password" });
        }
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    const updatedUser = await prisma.user.update({
      where: { userId: userIdInt },
      data: updateData,
    });

    console.log("Profile updated successfully for:", updatedUser.email);

    const { password: _, ...safeUser } = updatedUser;

    res.json({ message: "Profile updated", user: safeUser });
  } catch (e) {
    console.error("Error updating profile:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
