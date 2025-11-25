import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- 1. Cleanup existing data (in reverse order of creation) ---
  console.log("Cleaning up database...");

  // DELETED: await prisma.donationItem.deleteMany(); <- This line was causing the issue

  await prisma.donation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.charity.deleteMany();
  await prisma.role.deleteMany();
  await prisma.status.deleteMany();
  await prisma.colour.deleteMany();
  await prisma.condition.deleteMany();
  await prisma.gender.deleteMany();
  await prisma.category.deleteMany();
  await prisma.material.deleteMany();
  await prisma.size.deleteMany();
  console.log("Database cleaned.");

  // --- 2. Create Lookup Tables ---
  console.log("Creating lookup tables...");

  // Roles
  await prisma.role.createMany({
    data: [
      { roleName: "Donor", roleId: 1 },
      { roleName: "Charity Staff", roleId: 2 },
      { roleName: "Administrator", roleId: 3 },
    ],
    skipDuplicates: true, // Useful to prevent errors if running multiple times
  });

  // Statuses
  await prisma.status.createMany({
    data: [
      { status: "On its way" },
      { status: "In transit" },
      { status: "Received at Charity" },
      { status: "Accepted" },
    ],
    skipDuplicates: true,
  });

  // Colours
  const colours = [
    "Black",
    "Blue",
    "White",
    "Multi-colour",
    "Red",
    "Green",
    "Yellow",
    "Pink",
    "Purple",
    "Grey",
    "Brown",
    "Beige",
    "Orange",
    "Gold",
    "Silver",
  ];

  // Using Promise.all for speed, or createMany if you don't need the return objects immediately
  await prisma.colour.createMany({
    data: colours.map((c) => ({ colour: c })),
    skipDuplicates: true,
  });

  // Conditions
  const conditions = [
    "New with Tags",
    "Like New",
    "Good",
    "Fair",
    "New without Tags",
    "Heavily Used / Poor",
  ];
  await prisma.condition.createMany({
    data: conditions.map((c) => ({ condition: c })),
    skipDuplicates: true,
  });

  // Genders
  await prisma.gender.createMany({
    data: [
      { gender: "Mens" },
      { gender: "Womens" },
      { gender: "Kids" },
      { gender: "Unisex" },
    ],
    skipDuplicates: true,
  });

  // Categories
  const categories = [
    "Tops",
    "Bottoms",
    "Outerwear",
    "Shoes",
    "Dresses",
    "Accessories",
    "Bags",
    "Jewelry",
    "Activewear",
    "Swimwear",
    "Suits & Blazers",
  ];
  await prisma.category.createMany({
    data: categories.map((c) => ({ category: c })),
    skipDuplicates: true,
  });

  // Materials
  const materialNames = [
    "Cotton",
    "Denim",
    "Polyester",
    "Wool",
    "Silk",
    "Linen",
    "Leather",
    "Nylon",
    "Spandex",
    "Rayon",
    "Cashmere",
    "Velvet",
    "Suede",
    "Bamboo",
    "Hemp",
    "Fleece",
    "Satin",
    "Corduroy",
  ];

  await prisma.material.createMany({
    data: materialNames.map((m) => ({ material: m })),
    skipDuplicates: true,
  });
  console.log(`Seeded materials.`);

  // Sizes
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  await prisma.size.createMany({
    data: sizes.map((s) => ({ size: s })),
    skipDuplicates: true,
  });

  console.log("Lookup tables created.");

  console.log("Creating charities...");
  const charity1 = await prisma.charity.create({
    data: {
      name: "Charity",
      city: "Sheffield",
      address: "28 Neill Road, Sheffield, S11 8QG",
    },
  });

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
