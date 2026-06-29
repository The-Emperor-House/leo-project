import { prisma } from "@/lib/prisma";
import { CollectionsClient } from "./CollectionsClient";

const PREVIEW_LIMIT = 8;

const SELECT = {
  id: true, title: true, imageUrl: true, images: true,
  description: true, category: true, featured: true,
} as const;

export default async function CollectionsPage() {
  const [products, featuredProducts] = await Promise.all([
    prisma.product.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: SELECT,
    }),
    prisma.product.findMany({
      where: { published: true, featured: true },
      orderBy: [{ order: "asc" }],
      select: SELECT,
    }),
  ]);

  const byCategory = (cat: string) => {
    const all = products.filter((p) => p.category === cat);
    return { preview: all.slice(0, PREVIEW_LIMIT), rest: all.slice(PREVIEW_LIMIT) };
  };

  return (
    <CollectionsClient
      featuredProducts={featuredProducts}
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
