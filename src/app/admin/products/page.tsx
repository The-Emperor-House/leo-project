import { prisma } from "@/lib/prisma";
import { ProductsClient } from "./ProductsClient";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return <ProductsClient products={products} />;
}
