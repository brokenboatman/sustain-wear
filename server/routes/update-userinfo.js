import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";
import { createNotification } from "../utils/notificationHelper.js";

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

    //console.log(`Attempting profile update for User ID: ${userIdInt}`);

    // Fetch current user data to compare changes
    const user = await prisma.user.findUnique({
      where: { userId: userIdInt },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // --- GOOGLE AUTH RESTRICTIONS ---
    if (user.googleId) {
      if (email && email !== user.email) {
        return res.status(403).json({
          error:
            "Security Restriction: Google-authenticated users cannot change their email address.",
        });
      }
      if (newPassword) {
        return res.status(403).json({
          error:
            "Security Restriction: Google-authenticated users cannot set a password.",
        });
      }
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

    let changeType = "GENERAL";

    if (newPassword) {
      changeType = "PASSWORD";
    } else if (email && email !== user.email) {
      changeType = "EMAIL";
    } else if (profileURL && profileURL !== user.profileURL) {
      changeType = "PROFILE IMAGE";
    } else if (username && username !== user.username) {
      changeType = "USERNAME";
    }
    
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

    //console.log("Profile updated successfully for:", updatedUser.email);

    switch (changeType) {
      case "PASSWORD":
        await createNotification(
          prisma,
          userIdInt,
          "ACCOUNT_SECURITY",
          "Your password was recently changed. If this wasn't you, please contact support."
        );
        break;

      case "EMAIL":
        await createNotification(
          prisma,
          userIdInt,
          "ACCOUNT_SECURITY",
          `Your email address has been updated to ${email}.`
        );
        break;

      case "PROFILE IMAGE":
        await createNotification(
          prisma,
          userIdInt,
          "PROFILE_UPDATE",
          "Your profile image has been updated."
        );
        break;

      case "USERNAME":
        await createNotification(
          prisma,
          userIdInt,
          "PROFILE_UPDATE",
          `Your username has been updated to ${username}.`
        );
        break;

      case "GENERAL":
      default:
        await createNotification(
          prisma,
          userIdInt,
          "PROFILE_UPDATE",
          "Your profile details have been successfully updated."
        );
        break;
    }

    const { password: _, ...safeUser } = updatedUser;

    res.json({ message: "Profile updated", user: safeUser });
  } catch (e) {
    console.error("Error updating profile:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
