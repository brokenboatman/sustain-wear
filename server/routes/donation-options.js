import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Fetch all lookup tables in parallel for performance
    const [categories, colours, materials, conditions, genders, sizes] =
      await Promise.all([
        prisma.category.findMany(),
        prisma.colour.findMany(),
        prisma.material.findMany(),
        prisma.condition.findMany(),
        prisma.gender.findMany(),
        prisma.size.findMany(),
      ]);

    // Return it as a single object
    return {
      categories,
      colours,
      materials,
      conditions,
      genders,
      sizes,
    };
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch form options",
    });
  }
});
