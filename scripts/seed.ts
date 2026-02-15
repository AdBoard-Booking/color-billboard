import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. Create Publisher
  const publisher = await prisma.publisher.upsert({
    where: { id: "pub_1" },
    update: {},
    create: {
      id: "pub_1",
      name: "City Media Group",
    },
  });

  // 2. Create Screen
  const screen = await prisma.screen.upsert({
    where: { id: "screen_1" },
    update: {},
    create: {
      id: "screen_1",
      name: "Main Square LED",
      location: "Central Square, Mumbai",
      publisherId: publisher.id,
    },
  });

  // 3. Create Brand
  const brand = await prisma.brand.upsert({
    where: { id: "brand_1" },
    update: {},
    create: {
      id: "brand_1",
      name: "Uber Holi",
      logoUrl: "https://example.com/uber.png",
    },
  });

  // 4. Create Campaign
  const campaign = await prisma.campaign.upsert({
    where: { id: "camp_1" },
    update: {},
    create: {
      id: "camp_1",
      name: "Holi Splash 2026",
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      brandId: brand.id,
      screenId: screen.id,
    },
  });

  // 5. Create Brand Slot
  await prisma.brandSlot.upsert({
    where: { id: "slot_1" },
    update: {},
    create: {
      id: "slot_1",
      campaignId: campaign.id,
      brandId: brand.id,
      duration: 15,
      hexColors: ["#E63946", "#F4A261", "#457B9D"],
    },
  });

  // 6. Create Admin User
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@holi-ooh.com" },
    update: {},
    create: {
      email: "admin@holi-ooh.com",
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  console.log("Seeding completed!");
  console.log("Screen ID: screen_1");
  console.log("Admin Info: admin@holi-ooh.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
