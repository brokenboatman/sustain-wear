import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- 1. Cleanup existing data (in reverse order of creation) ---
  console.log("Cleaning up database...");

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
    skipDuplicates: true,
  });

  // Statuses
  await prisma.status.createMany({
    data: [
      { status: "On its way", statusId: 1 },
      { status: "In transit", statusId: 2 },
      { status: "Received at Charity", statusId: 3 },
      { status: "Accepted", statusId: 4 },
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

  // Sizes
  const sizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  await prisma.size.createMany({
    data: sizes.map((s) => ({ size: s })),
    skipDuplicates: true,
  });

  console.log("Lookup tables created.");

  // --- 3. Create Users and Charity ---
  console.log("Creating users and charities...");

  const hashedPassword = await bcrypt.hash("SuperPassword123", 10);

  // We capture the SuperDoner object to use its ID later
  const superDoner = await prisma.user.upsert({
    where: { email: "SuperDoner" },
    update: { password: hashedPassword },
    create: {
      email: "SuperDoner@sustainwear.com",
      username: "SuperDoner",
      password: hashedPassword,
      roleId: 1,
      userId: 1,
    },
  });

  await prisma.user.upsert({
    where: { email: "SuperStaff@sustainwear.com" },
    update: { password: hashedPassword },
    create: {
      email: "SuperStaff@sustainwear.com",
      username: "SuperStaff",
      password: hashedPassword,
      roleId: 2,
      userId: 2,
    },
  });

  await prisma.user.upsert({
    where: { email: "SuperAdmin@sustainwear.com" },
    update: { password: hashedPassword },
    create: {
      email: "SuperAdmin@sustainwear.com",
      username: "SuperAdmin",
      password: hashedPassword,
      roleId: 3,
      userId: 3,
    },
  });

  // Capture charity1 so we can link donations to it
  const charity1 = await prisma.charity.create({
    data: {
      name: "Charity",
      city: "Sheffield",
      address: "28 Neill Road, Sheffield, S11 8QG",
    },
  });

  // --- 4. NEW: Create Donations for SuperDoner ---
  console.log("Seeding donations for SuperDoner...");

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
      size: "XL", // Assumed size mapping
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

  // We loop through the data and create them individually
  // This allows us to "connect" to the specific lookup tables by name
  for (const item of donationsData) {
    await prisma.donation.create({
      data: {
        title: item.title,
        description: item.description,
        weight: item.weight,
        co2: item.co2,
        // Connect Relationships
        user: { connect: { userId: superDoner.userId } },
        charity: { connect: { charityId: charity1.charityId } },
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

  console.log(`Seeded ${donationsData.length} donations for SuperDoner.`);
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
