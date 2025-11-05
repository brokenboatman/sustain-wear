import { PrismaClient } from ("@prisma/client");
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
  const roleDonor = await prisma.role.create({ data: { roleName: "Donor" } });
  const roleCharityAdmin = await prisma.role.create({
    data: { roleName: "Charity Staff" },
  });
  const roleSuperAdmin = await prisma.role.create({
    data: { roleName: "Administrator" },
  });

  // Statuses
  const statusPending = await prisma.status.create({
    data: { status: "Pending Pickup" },
  });
  const statusPickedUp = await prisma.status.create({
    data: { status: "Picked Up" },
  });
  const statusReceived = await prisma.status.create({
    data: { status: "Received at Charity" },
  });
  const statusAccepted = await prisma.status.create({
    data: { status: "Accepted" },
  });
  const statusRejected = await prisma.status.create({
    data: { status: "Rejected" },
  });

  // Colours
  const colBlack = await prisma.colour.create({ data: { colour: "Black" } });
  const colBlue = await prisma.colour.create({ data: { colour: "Blue" } });
  const colWhite = await prisma.colour.create({ data: { colour: "White" } });
  const colMulti = await prisma.colour.create({
    data: { colour: "Multi-colour" },
  });

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

  // Materials
  const matCotton = await prisma.material.create({
    data: { material: "Cotton" },
  });
  const matDenim = await prisma.material.create({
    data: { material: "Denim" },
  });
  const matPolyester = await prisma.material.create({
    data: { material: "Polyester" },
  });
  const matWool = await prisma.material.create({ data: { material: "Wool" } });

  // Sizes
  const sizeS = await prisma.size.create({ data: { size: "S" } });
  const sizeM = await prisma.size.create({ data: { size: "M" } });
  const sizeL = await prisma.size.create({ data: { size: "L" } });
  const sizeOne = await prisma.size.create({ data: { size: "One Size" } });

  console.log("Lookup tables created.");

  // --- 3. Create Charities ---
  console.log("Creating charities...");
  const charity1 = await prisma.charity.create({
    data: {
      name: "CityHope Outreach",
      city: "London",
      address: "123 Helping Hand St, London, E1 4BH",
    },
  });

  const charity2 = await prisma.charity.create({
    data: {
      name: "People's Closet",
      city: "Manchester",
      address: "456 Community Way, Manchester, M4 1AH",
    },
  });
  console.log("Charities created.");

  // --- 4. Create Users ---
  console.log("Creating users...");
  // NOTE: In a real application, you MUST hash passwords.
  // We use plaintext here only for a simple seed script.
  const userAlice = await prisma.user.create({
    data: {
      username: "alice_donor",
      email: "alice@example.com",
      password: "password123", // <-- HASH THIS in a real app
      roleId: roleDonor.roleId,
      charityId: null, // Donors are not affiliated with a specific charity
    },
  });

  const userBob = await prisma.user.create({
    data: {
      username: "bob_admin",
      email: "bob@cityhope.org",
      password: "password456", // <-- HASH THIS in a real app
      roleId: roleCharityAdmin.roleId,
      charityId: charity1.charityId, // Bob works for CityHope Outreach
    },
  });
  console.log("Users created.");

  // --- 5. Create a Donation ---
  console.log("Creating a donation...");
  const donation1 = await prisma.donation.create({
    data: {
      userId: userAlice.userId,
      charityId: charity1.charityId,
      statusId: statusPending.statusId,
      date: new Date("2025-10-20T10:00:00Z"),
    },
  });
  console.log("Donation created.");

  // --- 6. Create Donation Items ---
  console.log("Creating donation items...");
  const item1 = await prisma.donationItem.create({
    data: {
      donationId: donation1.donationId,
      statusId: statusPending.statusId, // Item status starts same as donation
      description: "Mens Blue Jeans",
      quantity: 1,
      weight: 0.5,
      co2: 1.2,
      colourId: colBlue.colourId,
      conditionId: condGood.conditionId,
      genderId: genMens.genderId,
      categoryId: catBottoms.categoryId,
      materialId: matDenim.materialId,
      sizeId: sizeM.sizeId,
    },
  });

  const item2 = await prisma.donationItem.create({
    data: {
      donationId: donation1.donationId,
      statusId: statusPending.statusId,
      description: "Womens Wool Coat",
      photoUrl: "https://example.com/images/coat.jpg",
      quantity: 1,
      weight: 1.1,
      co2: 2.5,
      colourId: colBlack.colourId,
      conditionId: condLikeNew.conditionId,
      genderId: genWomens.genderId,
      categoryId: catOuterwear.categoryId,
      materialId: matWool.materialId,
      sizeId: sizeL.sizeId,
    },
  });

  const item3 = await prisma.donationItem.create({
    data: {
      donationId: donation1.donationId,
      statusId: statusPending.statusId,
      description: "Kids Cotton T-Shirts",
      quantity: 5,
      weight: 0.8,
      co2: 1.0,
      colourId: colMulti.colourId,
      conditionId: condGood.conditionId,
      genderId: genKids.genderId,
      categoryId: catTops.categoryId,
      materialId: matCotton.materialId,
      sizeId: sizeS.sizeId,
    },
  });
  console.log("Donation items created.");

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
