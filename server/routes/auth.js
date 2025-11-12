import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import jwt from "jsonwebtoken";

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

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Basic validation
    if (!email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Validate password (do this BEFORE issuing token)
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Create JWT *after* verifying credentials
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || "dev-secret",
      { expiresIn: "12h" }
    );

    // ✅ Return token to frontend
    res.json({
      message: "Logged in!",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/logout", auth, async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
