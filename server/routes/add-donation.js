// routes/add-donation.js (Using Express Router)

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

// 1. Helper function: Returns weight (kg) based on Category Name
const getCategoryWeight = (categoryName) => {
  // Normalize string to ensure matching (optional but safer)
  const name = categoryName ? categoryName.trim() : "";

  switch (name) {
    case "Tops":
      return 0.3;
    case "Bottoms":
      return 0.5;
    case "Outerwear":
      return 1.2;
    case "Shoes":
      return 0.8;
    case "Dresses":
      return 0.4;
    case "Accessories":
    case "Jewelry":
      return 0.1;
    case "Bags":
      return 0.6;
    case "Activewear":
    case "Swimwear":
      return 0.2;
    case "Suits & Blazers":
      return 1.0;
    default:
      return 0.5; // Default fallback weight
  }
};

const simulateLogisticsCycle = async (donationId) => {
  console.log(`Starting simulation for Donation ${donationId}`);

  try {
    await new Promise((resolve) => setTimeout(resolve, 15000));
    await prisma.donation.update({
      where: { donationId: donationId },
      data: { statusId: 2 },
    });
    console.log(`Donation ${donationId} moved to 'In transit'`);

    await new Promise((resolve) => setTimeout(resolve, 15000));
    await prisma.donation.update({
      where: { donationId: donationId },
      data: { statusId: 3 },
    });
    console.log(`Donation ${donationId} moved to 'Received at Charity'`);
  } catch (error) {
    console.error(`Simulation failed for donation ${donationId}:`, error);
  }
};

router.post("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }
  const token = authHeader.split(" ")[1];
  let decoded;

  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Invalid or expired token" });
  }

  const userId = decoded.id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: User ID missing in token" });
  }

  const body = req.body;

  if (!body.title || !body.category || !body.size) {
    return res.status(400).json({ error: "Missing required donation fields" });
  }

  try {
    const userIdInt = parseInt(userId);
    const categoryIdInt = parseInt(body.category); // This comes from your Vue Select

    // 2. Fetch the Category Name from the DB using the ID
    const categoryRecord = await prisma.category.findUnique({
      where: { categoryId: categoryIdInt },
    });

    if (!categoryRecord) {
      return res.status(400).json({ error: "Invalid Category ID provided" });
    }

    // 3. Calculate Weight using the Name we just fetched
    const calculatedWeight = getCategoryWeight(categoryRecord.category);

    const imageRef =
      body.images && body.images.length > 0 ? body.images[0] : null;

    // 4. Create the Donation
    const newDonation = await prisma.donation.create({
      data: {
        title: body.title,
        description: body.description,
        quantity: body.quantity,
        photoUrl: imageRef,
        weight: calculatedWeight,
        user: { connect: { userId: userIdInt } },
        category: { connect: { categoryId: categoryIdInt } },
        size: { connect: { sizeId: body.size } },
        colour: { connect: { colourId: body.colour } },
        material: { connect: { materialId: body.material } },
        condition: { connect: { conditionId: body.condition } },
        gender: { connect: { genderId: body.gender } },
        status: { connect: { statusId: 1 } },
        charity: { connect: { charityId: 1 } },
      },
    });

    simulateLogisticsCycle(newDonation.donationId);

    return res.json({
      donation: newDonation,
      statusMessage: "Donation added successfully",
    });
  } catch (e) {
    console.error("Prisma error adding donation:", e);
    return res
      .status(500)
      .json({ error: "Failed to create donation record", details: e.message });
  }
});

export default router;
