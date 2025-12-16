import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.put("/", auth([3]), async (req, res) => {
  try {
    const users = req.body.users;
    if (!Array.isArray(users)) {
      return res.status(400).json({ error: "Invalid input format" });
    }
    for (const userData of users) {
      const { userId, username, email, password, roleId, profileURL } = userData;
      const user = await prisma.user.findUnique({
        where: { userId: userId },
    });
        if (!user) {
            return res.status(404).json({ error: `User with ID ${userId} not found` });
        }

        if (email && email !== user.email) {
            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists)
                return res.status(400).json({ error: `Email ${email} already in use` });
        }

        if (username && username !== user.username) {
            const usernameExists = await prisma.user.findUnique({
                where: { username },
            });
            if (usernameExists)
                return res.status(400).json({ error: `Username ${username} already taken` });
        }

        const updateData = {
            username: username || user.username,
            email: email || user.email,
            profileURL: profileURL || user.profileURL,
            roleId: roleId !== undefined ? roleId : user.roleId,
        };

        if (password && password.trim() !== "") {
            if (user.password) {
                const salt = await bcrypt.genSalt(10);
                updateData.password = await bcrypt.hash(password, salt);
            } else {
                return res.status(403).json({
                    error: `Cannot set password for Google-authenticated user with ID ${userId}`,
                });
            }
        }

        await prisma.user.update({
            where: { userId },
            data: updateData,
        });
    }   
    //console.log("Users updated successfully");
    res.json({ message: "Users updated successfully" });
  } catch (e) {
    console.error("Error updating users:", e);
    res.status(500).json({ error: "Server error", details: e.message });
  }
});

export default router;
