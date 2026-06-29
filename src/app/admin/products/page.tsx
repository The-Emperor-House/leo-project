import { prisma } from "@/lib/prisma";
import { ProductsClient } from "./ProductsClient";

const PAGE_SIZE = 20;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));
  const line = sp.line;
  const category = sp.category;

  const where = {
    ...(line ? { line } : {}),
    ...(category ? { category } : {}),
  };

  const [products, total, lineGroups, categoryGroups] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: [{ line: "asc" }, { category: "asc" }, { order: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.product.count({ where }),
    prisma.product.groupBy({ by: ["line"], _count: { id: true } }),
    prisma.product.groupBy({
      by: ["category"],
      where: line ? { line } : {},
      _count: { id: true },
    }),
  ]);

  const lineCounts = Object.fromEntries(lineGroups.map((g) => [g.line, g._count.id]));
  const catCounts = Object.fromEntries(categoryGroups.map((g) => [g.category, g._count.id]));

  return (
    <ProductsClient
      products={products}
      total={total}
      page={page}
      totalPages={Math.ceil(total / PAGE_SIZE)}
      currentLine={line}
      currentCategory={category}
      lineCounts={lineCounts}
      catCounts={catCounts}
    />
  );
}
