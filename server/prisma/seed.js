import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding ...");

  // --- 1. Cleanup existing data (in reverse order of creation) ---
  console.log("Cleaning up database...");
  await prisma.donationItem.deleteMany();
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
  // 1. Donor
  const roleDonor = await prisma.role.upsert({
    where: { roleId: 1 },
    update: {}, // No changes if it already exists
    create: {
      roleId: 1,
      roleName: "Donor",
    },
  });

  // 2. Charity Staff
  const roleCharityAdmin = await prisma.role.upsert({
    where: { roleId: 2 },
    update: {},
    create: {
      roleId: 2,
      roleName: "Charity Staff",
    },
  });

  // 3. Administrator
  const roleSuperAdmin = await prisma.role.upsert({
    where: { roleId: 3 },
    update: {},
    create: {
      roleId: 3,
      roleName: "Administrator",
    },
  });

  // Statuses
  const statusPending = await prisma.status.create({
    data: { status: "On its way" },
  });
  const statusPickedUp = await prisma.status.create({
    data: { status: "In transit" },
  });
  const statusReceived = await prisma.status.create({
    data: { status: "Received at Charity" },
  });
  const statusAccepted = await prisma.status.create({
    data: { status: "Accepted" },
  });

  // Colours
  const colBlack = await prisma.colour.create({ data: { colour: "Black" } });
  const colBlue = await prisma.colour.create({ data: { colour: "Blue" } });
  const colWhite = await prisma.colour.create({ data: { colour: "White" } });
  const colMulti = await prisma.colour.create({
    data: { colour: "Multi-colour" },
  });
  // ... existing colours ...
  const colRed = await prisma.colour.create({ data: { colour: "Red" } });
  const colGreen = await prisma.colour.create({ data: { colour: "Green" } });
  const colYellow = await prisma.colour.create({ data: { colour: "Yellow" } });
  const colPink = await prisma.colour.create({ data: { colour: "Pink" } });
  const colPurple = await prisma.colour.create({ data: { colour: "Purple" } });
  const colGrey = await prisma.colour.create({ data: { colour: "Grey" } });
  const colBrown = await prisma.colour.create({ data: { colour: "Brown" } });
  const colBeige = await prisma.colour.create({ data: { colour: "Beige" } });
  const colOrange = await prisma.colour.create({ data: { colour: "Orange" } });
  const colGold = await prisma.colour.create({ data: { colour: "Gold" } });
  const colSilver = await prisma.colour.create({ data: { colour: "Silver" } });

  // Conditions
  const condNewTags = await prisma.condition.create({
    data: { condition: "New with Tags" },
  });
  const condLikeNew = await prisma.condition.create({
    data: { condition: "Like New" },
  });
  const condGood = await prisma.condition.create({
    data: { condition: "Good" },
  });
  const condFair = await prisma.condition.create({
    data: { condition: "Fair" },
  });
  const condNewNoTags = await prisma.condition.create({
    data: { condition: "New without Tags" },
  });
  const condPoor = await prisma.condition.create({
    data: { condition: "Heavily Used / Poor" },
  });

  // Genders
  const genMens = await prisma.gender.create({ data: { gender: "Mens" } });
  const genWomens = await prisma.gender.create({ data: { gender: "Womens" } });
  const genKids = await prisma.gender.create({ data: { gender: "Kids" } });
  const genUnisex = await prisma.gender.create({ data: { gender: "Unisex" } });

  // Categories
  const catTops = await prisma.category.create({ data: { category: "Tops" } });
  const catBottoms = await prisma.category.create({
    data: { category: "Bottoms" },
  });
  const catOuterwear = await prisma.category.create({
    data: { category: "Outerwear" },
  });
  const catShoes = await prisma.category.create({
    data: { category: "Shoes" },
  });
  const catDresses = await prisma.category.create({
    data: { category: "Dresses" },
  });
  const catAccessories = await prisma.category.create({
    data: { category: "Accessories" }, // Belts, hats, scarves
  });
  const catBags = await prisma.category.create({
    data: { category: "Bags" },
  });
  const catJewelry = await prisma.category.create({
    data: { category: "Jewelry" },
  });
  const catActivewear = await prisma.category.create({
    data: { category: "Activewear" },
  });
  const catSwimwear = await prisma.category.create({
    data: { category: "Swimwear" },
  });
  const catSuits = await prisma.category.create({
    data: { category: "Suits & Blazers" },
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

  const materials = await Promise.all(
    materialNames.map((name) =>
      prisma.material.create({
        data: { material: name },
      })
    )
  );

  console.log(`Seeded ${materials.length} materials.`);

  // Sizes
  const sizeS = await prisma.size.create({ data: { size: "S" } });
  const sizeM = await prisma.size.create({ data: { size: "M" } });
  const sizeL = await prisma.size.create({ data: { size: "L" } });
  const sizeXL = await prisma.size.create({ data: { size: "XL" } });
  const sizeXXL = await prisma.size.create({ data: { size: "XXL" } });
  const size3Xl = await prisma.size.create({ data: { size: "3XL" } });
  const size4XL = await prisma.size.create({ data: { size: "4XL" } });

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
