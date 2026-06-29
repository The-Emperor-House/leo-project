import { prisma } from "@/lib/prisma";
import { CollectionsClient } from "./CollectionsClient";

export default async function CollectionsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    select: { id: true, title: true, imageUrl: true, images: true, description: true, category: true },
  });

  const byCategory = (cat: string) =>
    products.filter((p) => p.category === cat);

  return (
    <CollectionsClient
      productsByCategory={{
        living: byCategory("living"),
        dining: byCategory("dining"),
        bedroom: byCategory("bedroom"),
        working: byCategory("working"),
        lighting: byCategory("lighting"),
        ornament: byCategory("ornament"),
      }}
    />
  );
}
