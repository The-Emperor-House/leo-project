import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedUser(email: string, name: string, password: string) {
  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { password: hashed, name, role: "ADMIN" },
    create: { email, name, password: hashed, role: "ADMIN" },
  });
  console.log(`Seeded: ${email}`);
}

async function main() {
  const defaultEmail = process.env.SEED_DEFAULT_EMAIL;
  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD;
  const defaultName = process.env.SEED_DEFAULT_NAME ?? "LeoAngelo Admin";

  if (!defaultEmail || !defaultPassword) {
    throw new Error("SEED_DEFAULT_EMAIL and SEED_DEFAULT_PASSWORD are required");
  }

  await seedUser(defaultEmail, defaultName, defaultPassword);

  const ownerEmail = process.env.SEED_ADMIN_EMAIL;
  const ownerPassword = process.env.SEED_ADMIN_PASSWORD;
  const ownerName = process.env.SEED_ADMIN_NAME ?? "Super Admin";

  if (ownerEmail && ownerPassword) {
    await seedUser(ownerEmail, ownerName, ownerPassword);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
