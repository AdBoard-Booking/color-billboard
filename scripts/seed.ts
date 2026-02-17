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

  // 3. Create Admin User
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
