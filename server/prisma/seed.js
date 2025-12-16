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
    "Cream",
    "Navy",
    "Turquoise",
    "Maroon",
    "Olive",
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
    "Sleepwear", // <--- ADD THIS
  ];
  await prisma.category.createMany({
    data: categories.map((c, index) => ({
      category: c,
      categoryId: index + 1,
    })),
    skipDuplicates: true,
  });

  console.log("Categories seeded");

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
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL"];
  await prisma.size.createMany({
    data: sizes.map((s, index) => ({ size: s, sizeId: index + 1 })),
    skipDuplicates: true,
  });

  console.log("Lookup tables created.");

  console.log("Creating users and charities...");

  const hashedPassword = await bcrypt.hash("SuperPassword123", 10);

  // SuperDonor
  await prisma.user.upsert({
    where: { email: "SuperDonor@sustainwear.com" },
    update: {
      password: hashedPassword,
      userId: 1,
    },
    create: {
      userId: 1,
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
      userId: 2,
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
      userId: 3,
      email: "SuperAdmin@sustainwear.com",
      username: "SuperAdmin",
      password: hashedPassword,
      roleId: 3,
    },
  });

  // Create Charity
  await prisma.charity.upsert({
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

  const notificationTypeData = [
    { type: "DONATION_MILESTONE" }, // For 10, 50, 100 donations
    { type: "SYSTEM_ALERT" }, // For system maintenance or important updates
    { type: "CHARITY_UPDATE" }, //update the user on the status of their item
    { type: "ACCOUNT_SECURITY" }, // For password changes, login from new device, etc.
    {
      type: "PROFILE_UPDATE",
    },
  ];

  for (const n of notificationTypeData) {
    const type = await prisma.notificationType.upsert({
      where: { type: n.type },
      update: {}, // If it exists, do nothing
      create: {
        type: n.type,
      },
    });
    console.log(`Upserted type: ${type.type}`);
  }

  console.log("Notification seeding finished.");

  const today = new Date();

  const lastMonth = new Date(today);
  lastMonth.setMonth(today.getMonth() - 1);

  const twoMonthsAgo = new Date(today);
  twoMonthsAgo.setMonth(today.getMonth() - 2);

  const threeMonthsAgo = new Date(today);
  threeMonthsAgo.setMonth(today.getMonth() - 3);

  const fiveMonthsAgo = new Date(today);
  fiveMonthsAgo.setMonth(today.getMonth() - 5);

  const eightMonthsAgo = new Date(today);
  eightMonthsAgo.setMonth(today.getMonth() - 8);

  const donationsData = [
    {
      title: "Vintage Denim Jacket",
      description: "A classic 90s denim jacket in great condition.",
      status: "Received at Charity",
      colour: "Blue",
      condition: "Good",
      gender: "Unisex",
      category: "Outerwear",
      material: "Denim",
      size: "L",
      weight: 0.8,
      co2: 2.5,
      date: eightMonthsAgo,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792325/o8hfrzrqfcwb7l3pii9h.jpg",
    },
    {
      title: "Men's Pyjama Set",
      description: "Cozy and warm.",
      status: "Received at Charity",
      colour: "Black",
      condition: "Good",
      gender: "Mens",
      category: "Sleepwear",
      material: "Polyester",
      size: "XL",
      weight: 1.38,
      co2: 6.0,
      date: fiveMonthsAgo,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792382/xy6mwglqhym7aymodljx.jpg",
    },
    {
      title: "Leather Hiking Boots",
      description: "Sturdy boots, worn for one season.",
      status: "In transit",
      colour: "Brown",
      condition: "Fair",
      gender: "Mens",
      category: "Shoes",
      material: "Leather",
      size: "XL",
      weight: 1.2,
      co2: 5.0,
      date: threeMonthsAgo,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792534/lzzb0yh9nvva5eukneak.jpg",
    },
    {
      title: "Wool Scarf",
      description: "Warm winter scarf.",
      status: "In transit",
      colour: "Cream",
      condition: "Like New",
      gender: "Unisex",
      category: "Accessories",
      material: "Wool",
      size: "M",
      weight: 0.2,
      co2: 0.5,
      date: twoMonthsAgo,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792255/ey5refgoctzhqebeorme.jpg",
    },
    {
      title: "Black Leggings",
      description: "Brand new, great for exercise.",
      status: "On its way",
      colour: "Black",
      condition: "Like New",
      gender: "Womens",
      category: "Activewear",
      material: "Spandex",
      size: "M",
      weight: 0.84,
      co2: 3.2,
      date: lastMonth,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792509/hua8j8i8erwdxs3n3mye.jpg",
    },
    {
      title: "Yellow Knit Sweater",
      description: "Cozy and warm.",
      status: "On its way",
      colour: "Yellow",
      condition: "Good",
      gender: "Unisex",
      category: "Tops",
      material: "Wool",
      size: "M",
      weight: 0.45,
      co2: 5.3,
      date: today,
      photoUrl:
        "https://res.cloudinary.com/dtckq9bj4/image/upload/v1765792466/nfvuy36fzpjjmachhz1m.jpg",
    },
  ];

  for (const item of donationsData) {
    await prisma.donation.create({
      data: {
        title: item.title,
        description: item.description,
        weight: item.weight,
        co2: item.co2,
        photoUrl: item.photoUrl,
        date: item.date ? item.date : undefined,
        user: { connect: { userId: 1 } },
        charity: { connect: { charityId: 1 } },
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
