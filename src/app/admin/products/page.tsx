import { prisma } from "@/lib/prisma";
import { deleteProduct } from "../actions";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

type ProductRow = {
  id: string; title: string; category: string; published: boolean; featured: boolean;
};

const categoryLabel: Record<string, string> = {
  living: "Living Room",
  dining: "Dining Room",
  bedroom: "Bedroom",
  working: "Working Room",
  lighting: "Lighting",
  ornament: "Ornament",
};

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            Products
          </h1>
          <p className="text-sm text-muted-foreground">จัดการสินค้าและคอลเลกชัน</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          เพิ่มสินค้า
        </Link>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">ยังไม่มีสินค้า</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อสินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมวดหมู่</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(products as ProductRow[]).map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{categoryLabel[p.category] ?? p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? "bg-green-500/15 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.featured ? "★" : "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      <Link href={`/admin/products/${p.id}`} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                      <form action={deleteProduct}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500 text-xs">
                          ลบ
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
