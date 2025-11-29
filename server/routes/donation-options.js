// routes/donation-options.js

import { Router } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = Router();

router.get("/", async (req, res) => {
  try {
    const [categories, colours, materials, conditions, genders, sizes] =
      await Promise.all([
        prisma.category.findMany(),
        prisma.colour.findMany(),
        prisma.material.findMany(),
        prisma.condition.findMany(),
        prisma.gender.findMany(),
        prisma.size.findMany(),
      ]);

    res.json({
      categories,
      colours,
      materials,
      conditions,
      genders,
      sizes,
    });
  } catch (error) {
    console.error("Error fetching form options:", error);
    res.status(500).json({ error: "Failed to fetch form options" });
  }
});

export default router;
