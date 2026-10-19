import { PrismaClient } from "@prisma/client";
import { ROOMS } from "./rooms-data";

const prisma = new PrismaClient();

// Existing rooms are left untouched, so this is safe to run against production
// after admins have edited them.
async function main() {
  for (const room of ROOMS) {
    await prisma.room.upsert({ where: { slug: room.slug }, update: {}, create: room });
    console.log(`Room: ${room.slug}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
