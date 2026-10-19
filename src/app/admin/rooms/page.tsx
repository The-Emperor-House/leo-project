import { prisma } from "@/lib/prisma";
import { RoomsClient } from "./RoomsClient";

export default async function RoomsPage() {
  const [rooms, products] = await Promise.all([
    prisma.room.findMany({
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      include: { products: { select: { id: true } } },
    }),
    prisma.product.findMany({
      orderBy: [{ category: "asc" }, { order: "asc" }, { title: "asc" }],
      select: { id: true, title: true, imageUrl: true, line: true, category: true, published: true },
    }),
  ]);

  return (
    <RoomsClient
      rooms={rooms.map(({ products, ...r }) => ({ ...r, productIds: products.map((p) => p.id) }))}
      products={products}
    />
  );
}
