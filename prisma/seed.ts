import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin1234", 12);
  await prisma.user.upsert({
    where: { email: "admin@leoangelo.co.th" },
    update: {},
    create: {
      email: "admin@leoangelo.co.th",
      name: "LeoAngelo Admin",
      password,
      role: "ADMIN",
    },
  });
  console.log("Seeded admin user: admin@leoangelo.co.th / admin1234");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
