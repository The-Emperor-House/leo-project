import { prisma } from "@/lib/prisma";
import { CollectionsClient } from "./CollectionsClient";

const PREVIEW_LIMIT = 8;

const SELECT = {
  id: true, title: true, imageUrl: true, images: true,
  description: true, line: true, category: true, featured: true,
} as const;

const CATEGORIES = ["furniture", "lighting", "ornament", "hardwares"] as const;

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

  const byLineCategory = (line: string, category: string) => {
    const all = products.filter((p) => p.line === line && p.category === category);
    return { preview: all.slice(0, PREVIEW_LIMIT), rest: all.slice(PREVIEW_LIMIT) };
  };

  const buildLine = (line: string) =>
    Object.fromEntries(CATEGORIES.map((cat) => [cat, byLineCategory(line, cat)])) as
      Record<typeof CATEGORIES[number], { preview: typeof products; rest: typeof products }>;

  return (
    <CollectionsClient
      featuredProducts={featuredProducts}
      productsByLine={{
        classic: buildLine("classic"),
        luxury: buildLine("luxury"),
      }}
    />
  );
}
