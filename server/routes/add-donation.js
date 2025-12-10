import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";

const prisma = new PrismaClient();
const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CO2_SAVING_PER_KG = 9.0;

const getCategoryWeight = (categoryName) => {
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
      return 0.5;
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
  // --- AUTHENTICATION ---
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
    const categoryIdInt = parseInt(body.category);
    const categoryRecord = await prisma.category.findUnique({
      where: { categoryId: categoryIdInt },
    });

    if (!categoryRecord) {
      return res.status(400).json({ error: "Invalid Category ID provided" });
    }

    const calculatedWeight = getCategoryWeight(categoryRecord.category);

    const calculatedCo2 = calculatedWeight * CO2_SAVING_PER_KG;

    const imagePayloads = body.images || [];
    const uploadPromises = [];

    for (const imgStr of imagePayloads) {
      if (imgStr.startsWith("data:")) {
        const p = cloudinary.uploader.upload(imgStr, {
          folder: "donations",
          resource_type: "image",
        });
        uploadPromises.push(p);
      } else {
        uploadPromises.push(Promise.resolve({ secure_url: imgStr }));
      }
    }

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((r) => r.secure_url);
    const coverPhotoUrl = imageUrls.length > 0 ? imageUrls[0] : null;

    const result = await prisma.$transaction(async (tx) => {
      const newDonation = await tx.donation.create({
        data: {
          title: body.title,
          description: body.description,
          quantity: body.quantity,
          weight: calculatedWeight,
          co2: calculatedCo2,
          photoUrl: coverPhotoUrl,
          user: { connect: { userId: userIdInt } },
          category: { connect: { categoryId: categoryIdInt } },
          size: { connect: { sizeId: body.size } },
          colour: { connect: { colourId: body.colour } },
          material: { connect: { materialId: body.material } },
          condition: { connect: { conditionId: body.condition } },
          gender: { connect: { genderId: body.gender } },
          status: { connect: { statusId: 1 } },
          charity: { connect: { charityId: 1 } },
          images: {
            create: imageUrls.map((url) => ({ url: url })),
          },
        },
        include: {
          images: true,
        },
      });

      const totalCount = await tx.donation.count({
        where: { userId: userIdInt },
      });

      if (totalCount === 5) {
        const notifType = await tx.notificationType.findUnique({
          where: { type: "DONATION_MILESTONE" },
        });

        if (notifType) {
          await tx.notifications.create({
            data: {
              userId: userIdInt,
              notificationTypeId: notifType.notificationTypeId,
              message:
                "Congratulations! You've unlocked the '5 Donations' badge.",
              isRead: false,
            },
          });
        }
      }

      return newDonation;
    });
    simulateLogisticsCycle(result.donationId);

    return res.json({
      donation: result,
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
