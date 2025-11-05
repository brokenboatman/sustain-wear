import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router(); // Create a new router

// --- 1. GET all posts ---
router.get("/", async (req, res) => {
  try {
    const posts = await prisma.post.findMany();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// --- 2. CREATE a new post (POST) ---
router.post("/", async (req, res) => {
  try {
    const { title, content } = req.body;
    const newPost = await prisma.post.create({
      data: {
        title,
        content,
      },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
});

// --- 3. DELETE a post (DELETE) ---
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(id),
      },
    });
    res.status(200).json(deletedPost);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post" });
  }
});

export default router; // Export the router
