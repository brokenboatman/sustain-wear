// routes/add-donation.js (Using Express Router)

import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

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

    // Indents
    const identTitle = quote_ident(body.title)
    const identDescription = quote_ident(body.description)


    const imageRef =
      body.images && body.images.length > 0 ? body.images[0] : null;

    const newDonation = await prisma.donation.create({
      data: {
        title: identTitle,
        description: identDescription,
        quantity: body.quantity,
        photoUrl: imageRef,

        // Connect to User using the parsed ID
        user: { connect: { userId: userIdInt } },

        // Links to the lookup tables using the IDs
        category: { connect: { categoryId: body.category } },
        size: { connect: { sizeId: body.size } },
        colour: { connect: { colourId: body.colour } },
        material: { connect: { materialId: body.material } },
        condition: { connect: { conditionId: body.condition } },
        gender: { connect: { genderId: body.gender } },
        status: { connect: { statusId: 1 } },
        charity: { connect: { charityId: 1 } },
      },
    });

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
