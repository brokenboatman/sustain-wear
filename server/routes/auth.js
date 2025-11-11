import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    const roleId = parseInt(req.body.roleId);
    if (!email || !password || !username || !roleId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail)
      return res.status(409).json({ error: "User already exists" });
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername)
      return res.status(409).json({ error: "Username already taken" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        roleId,
      },
    });

    res.json({
      message: "Registered!",
      user: { id: user.id, email: user.email, username: user.username },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
