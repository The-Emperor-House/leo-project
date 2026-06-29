import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const defaultPassword = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@leoangelo.co.th" },
    update: {},
    create: {
      email: "admin@leoangelo.co.th",
      name: "LeoAngelo Admin",
      password: defaultPassword,
      role: "ADMIN",
    },
  });

  const ownerEmail = process.env.SEED_ADMIN_EMAIL;
  const ownerPassword = process.env.SEED_ADMIN_PASSWORD;
  const ownerName = process.env.SEED_ADMIN_NAME ?? "Super Admin";

  if (ownerEmail && ownerPassword) {
    const hashed = await bcrypt.hash(ownerPassword, 12);
    await prisma.user.upsert({
      where: { email: ownerEmail },
      update: { password: hashed, name: ownerName, role: "ADMIN" },
      create: {
        email: ownerEmail,
        name: ownerName,
        password: hashed,
        role: "ADMIN",
      },
    });
    console.log(`Seeded owner: ${ownerEmail}`);
  }

  console.log("Seeded admin user: admin@leoangelo.co.th / admin1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
