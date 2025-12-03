import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- 1. Cleanup existing data (Order matters to avoid foreign key errors) ---
  console.log("Cleaning up database...");

  // Delete child tables first
  await prisma.donation.deleteMany();

  // Delete users and charities
  await prisma.user.deleteMany();
  await prisma.charity.deleteMany();

  // Delete lookup tables
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
    skipDuplicates: true,
  });

  // Statuses
  await prisma.status.createMany({
    data: [
      { status: "On its way", statusId: 1 },
      { status: "In transit", statusId: 2 },
      { status: "Received at Charity", statusId: 3 },
      { status: "Accepted", statusId: 4 },
      { status: "Rejected", statusId: 5 },
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
  await prisma.colour.createMany({
    // Maps index 0 -> ID 1, index 1 -> ID 2, etc.
    data: colours.map((c, index) => ({ colour: c, colourId: index + 1 })),
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
    data: conditions.map((c, index) => ({
      condition: c,
      conditionId: index + 1,
    })),
    skipDuplicates: true,
  });

  // Genders
  const genders = ["Mens", "Womens", "Kids", "Unisex"];
  await prisma.gender.createMany({
    data: genders.map((g, index) => ({ gender: g, genderId: index + 1 })),
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
    data: categories.map((c, index) => ({
      category: c,
      categoryId: index + 1,
    })),
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
    data: materialNames.map((m, index) => ({
      material: m,
      materialId: index + 1,
    })),
    skipDuplicates: true,
  });

  // Sizes
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  await prisma.size.createMany({
    data: sizes.map((s, index) => ({ size: s, sizeId: index + 1 })),
    skipDuplicates: true,
  });

  console.log("Lookup tables created.");

  console.log("Creating users and charities...");

  const hashedPassword = await bcrypt.hash("SuperPassword123", 10);

  // SuperDonor
  const superDonor = await prisma.user.upsert({
    where: { email: "SuperDonor@sustainwear.com" },
    update: {
      password: hashedPassword,
      userId: 1, // Ensure ID matches on update
    },
    create: {
      userId: 1, // Hardcoded ID
      email: "SuperDonor@sustainwear.com",
      username: "SuperDonor",
      password: hashedPassword,
      roleId: 1,
    },
  });

  // SuperStaff
  await prisma.user.upsert({
    where: { email: "SuperStaff@sustainwear.com" },
    update: {
      password: hashedPassword,
      userId: 2,
    },
    create: {
      userId: 2, // Hardcoded ID
      email: "SuperStaff@sustainwear.com",
      username: "SuperStaff",
      password: hashedPassword,
      roleId: 2,
    },
  });

  // SuperAdmin
  await prisma.user.upsert({
    where: { email: "SuperAdmin@sustainwear.com" },
    update: {
      password: hashedPassword,
      userId: 3,
    },
    create: {
      userId: 3, // Hardcoded ID
      email: "SuperAdmin@sustainwear.com",
      username: "SuperAdmin",
      password: hashedPassword,
      roleId: 3,
    },
  });

  // Create Charity
  const charity1 = await prisma.charity.upsert({
    where: { charityId: 1 },
    update: {},
    create: {
      charityId: 1, // Hardcoded ID
      name: "Charity",
      city: "Sheffield",
      address: "28 Neill Road, Sheffield, S11 8QG",
    },
  });

  // --- 4. Create Donations for SuperDonor ---
  console.log("Seeding donations for SuperDonor...");

  const donationsData = [
    {
      title: "Vintage Denim Jacket",
      description: "A classic 90s denim jacket in great condition.",
      status: "On its way",
      colour: "Blue",
      condition: "Good",
      gender: "Unisex",
      category: "Outerwear",
      material: "Denim",
      size: "L",
      weight: 0.8,
      co2: 2.5,
    },
    {
      title: "Summer Floral Dress",
      description: "Lightweight dress, never worn with tags.",
      status: "Received at Charity",
      colour: "Multi-colour",
      condition: "New with Tags",
      gender: "Womens",
      category: "Dresses",
      material: "Cotton",
      size: "M",
      weight: 0.3,
      co2: 1.1,
    },
    {
      title: "Leather Hiking Boots",
      description: "Sturdy boots, worn for one season.",
      status: "Accepted",
      colour: "Brown",
      condition: "Fair",
      gender: "Mens",
      category: "Shoes",
      material: "Leather",
      size: "XL",
      weight: 1.2,
      co2: 5.0,
    },
    {
      title: "Wool Scarf",
      description: "Warm winter scarf.",
      status: "In transit",
      colour: "Red",
      condition: "Like New",
      gender: "Unisex",
      category: "Accessories",
      material: "Wool",
      size: "M",
      weight: 0.2,
      co2: 0.5,
    },
  ];

  for (const item of donationsData) {
    await prisma.donation.create({
      data: {
        title: item.title,
        description: item.description,
        weight: item.weight,
        co2: item.co2,

        // Connect using the Hardcoded IDs directly
        user: { connect: { userId: 1 } },
        charity: { connect: { charityId: 1 } },

        // We can still connect by unique string name (safest),
        // or we could look up the ID if strictly necessary.
        // Connecting by unique name is standard best practice in Prisma seeding.
        status: { connect: { status: item.status } },
        colour: { connect: { colour: item.colour } },
        condition: { connect: { condition: item.condition } },
        gender: { connect: { gender: item.gender } },
        category: { connect: { category: item.category } },
        material: { connect: { material: item.material } },
        size: { connect: { size: item.size } },
      },
    });
  }

  console.log(`Seeded ${donationsData.length} donations for SuperDonor.`);
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
