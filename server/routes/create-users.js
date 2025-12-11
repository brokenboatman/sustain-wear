import { Router } from "express";
import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js";
import { auth } from "../middleware/auth.js";

const router = Router();

router.post("/", auth([3]), async (req, res) => {
    try {
        const users = req.body.users;
        if (!Array.isArray(users)) {
            return res.status(400).json({ error: "Invalid input format" });
        }

        const createdUsers = [];

        for (const userData of users) {
            const { username, email, password, roleId, profileURL } = userData;

            // Validate required fields
            if (!username || !email || !password) {
                return res.status(400).json({ error: "Username, email, and password are required" });
            }

            // Check if email already exists
            const emailExists = await prisma.user.findUnique({ where: { email } });
            if (emailExists) {
                return res.status(400).json({ error: `Email ${email} already in use` });
            }

            // Check if username already exists
            const usernameExists = await prisma.user.findUnique({ where: { username } });
            if (usernameExists) {
                return res.status(400).json({ error: `Username ${username} already taken` });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const newUser = await prisma.user.create({
                data: {
                    username,
                    email,
                    password: hashedPassword,
                    roleId: roleId || 1,
                    profileURL: profileURL || null,
                },
            });

            createdUsers.push(newUser);
        }

        console.log("Users created successfully");
        res.json({ message: "Users created successfully", users: createdUsers });
    } catch (e) {
        console.error("Error creating users:", e);
        res.status(500).json({ error: "Server error", details: e.message });
    }
});

export default router;