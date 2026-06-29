"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Upload, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { upsertProduct, deleteProduct, uploadImage } from "../actions";
import { Pagination } from "@/components/Pagination";

type Product = {
  id: string; title: string; line: string; category: string; description: string;
  imageUrl: string | null; images: string | null;
  featured: boolean; published: boolean; order: number;
};

const LINES = [
  { value: "classic", label: "Classic" },
  { value: "luxury",  label: "Luxury" },
];

const CATEGORIES = [
  { value: "furniture",  label: "Furniture" },
  { value: "lighting",   label: "Lighting" },
  { value: "ornament",   label: "Ornament" },
  { value: "hardwares",  label: "Hardwares" },
];

const LINE_LABEL: Record<string, string> = { classic: "Classic", luxury: "Luxury" };
const CAT_LABEL: Record<string, string> = { furniture: "Furniture", lighting: "Lighting", ornament: "Ornament", hardwares: "Hardwares" };

function buildFilterUrl(line?: string, category?: string) {
  const p = new URLSearchParams();
  if (line) p.set("line", line);
  if (category) p.set("category", category);
  const q = p.toString();
  return `/admin/products${q ? `?${q}` : ""}`;
}

function ImageSlot({ url, uploading, onUpload, onRemove }: {
  url: string; uploading: boolean;
  onUpload: (f: File) => void; onRemove: () => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30">
      {url ? (
        <>
          <Image src={url} alt="" fill className="object-cover" sizes="200px" />
          <button type="button" onClick={onRemove}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors">
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
          {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Upload className="w-5 h-5" /><span className="text-xs">อัปโหลด</span></>}
          <input ref={ref} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
        </button>
      )}
    </div>
  );
}

function ProductDrawer({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(product?.title ?? "");
  const [line, setLine] = useState(product?.line ?? "classic");
  const [category, setCategory] = useState(product?.category ?? "furniture");
  const [description, setDescription] = useState(product?.description ?? "");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [published, setPublished] = useState(product?.published ?? true);
  const [order, setOrder] = useState(product?.order ?? 0);
  const [mainImage, setMainImage] = useState(product?.imageUrl ?? "");
  const [gallery, setGallery] = useState<string[]>(product?.images ? JSON.parse(product.images) : []);
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  async function handleUpload(file: File, isMain: boolean, idx?: number) {
    if (isMain) setUploadingMain(true); else setUploadingIdx(idx ?? null);
    const fd = new FormData(); fd.append("file", file);
    const { url } = await uploadImage(fd);
    if (isMain) { setMainImage(url); setUploadingMain(false); }
    else {
      setGallery((prev) => { const next = [...prev]; if (idx !== undefined && idx < next.length) next[idx] = url; else next.push(url); return next; });
      setUploadingIdx(null);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (mainImage) fd.set("imageUrl", mainImage);
    gallery.filter(Boolean).forEach((u) => fd.append("images", u));
    startTransition(async () => { await upsertProduct(fd); router.refresh(); onClose(); });
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-semibold">{product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {product && <input type="hidden" name="id" value={product.id} />}

          <div className="space-y-2">
            <label className="text-sm font-medium">ภาพหลัก</label>
            <div className="max-w-xs">
              <ImageSlot url={mainImage} uploading={uploadingMain}
                onUpload={(f) => handleUpload(f, true)} onRemove={() => setMainImage("")} />
              <input type="hidden" name="imageUrl" value={mainImage} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">ชื่อสินค้า</label>
            <input name="title" value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Line</label>
              <select name="line" value={line} onChange={(e) => setLine(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60">
                {LINES.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">หมวดหมู่</label>
              <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60">
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">รายละเอียด</label>
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> รูปเพิ่มเติม ({gallery.filter(Boolean).length} รูป)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[...gallery, ""].map((url, idx) => (
                <ImageSlot key={idx} url={url} uploading={uploadingIdx === idx}
                  onUpload={(f) => handleUpload(f, false, idx)}
                  onRemove={() => setGallery((prev) => prev.filter((_, i) => i !== idx))} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-6 flex-wrap">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} /> Published
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              <span>Featured</span>
              <span className="relative group/tip">
                <span className="w-4 h-4 rounded-full bg-secondary border border-border text-muted-foreground text-[10px] font-bold flex items-center justify-center cursor-help select-none">?</span>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-foreground text-background text-xs px-3 py-2 leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity z-20 shadow-lg">
                  ✦ สินค้าที่ติ๊ก Featured จะแสดง badge "แนะนำ" บน card และปรากฏในส่วน <strong>สินค้าแนะนำ</strong> ด้านบนหน้า Collections
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </span>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">Order</span>
              <span className="relative group/tip">
                <span className="w-4 h-4 rounded-full bg-secondary border border-border text-muted-foreground text-[10px] font-bold flex items-center justify-center cursor-help select-none">?</span>
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-lg bg-foreground text-background text-xs px-3 py-2 leading-relaxed opacity-0 group-hover/tip:opacity-100 transition-opacity z-20 shadow-lg">
                  ตัวเลขน้อย = แสดงก่อน<br />เช่น Order 1 ขึ้นก่อน Order 5
                  <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                </span>
              </span>
              <input type="number" name="order" value={order} onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-sm outline-none focus:border-primary/60 text-center" />
            </div>
          </div>

          <button type="submit" disabled={isPending || uploadingMain || uploadingIdx !== null}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {product ? "บันทึก" : "สร้างสินค้า"}
          </button>
        </form>
      </aside>
    </>
  );
}

export function ProductsClient({
  products, total, page, totalPages, currentLine, currentCategory, lineCounts, catCounts,
}: {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  currentLine?: string;
  currentCategory?: string;
  lineCounts: Record<string, number>;
  catCounts: Record<string, number>;
}) {
  const router = useRouter();
  const [drawer, setDrawer] = useState<Product | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalAll = Object.values(lineCounts).reduce((s, n) => s + n, 0);
  const catTotal = Object.values(catCounts).reduce((s, n) => s + n, 0);

  function handleDelete(id: string) {
    if (!confirm("ลบสินค้านี้?")) return;
    startTransition(async () => {
      const fd = new FormData(); fd.append("id", id);
      await deleteProduct(fd); router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 font-display">Products</h1>
          <p className="text-sm text-muted-foreground">
            {total} รายการ{currentLine || currentCategory ? " (filtered)" : ""}
          </p>
        </div>
        <button onClick={() => setDrawer("new")}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> เพิ่มสินค้า
        </button>
      </div>

      {/* Line tabs */}
      <div className="flex gap-1 mb-2 overflow-x-auto pb-1">
        {[{ value: undefined, label: "ทั้งหมด", count: totalAll }, ...LINES.map((l) => ({ ...l, value: l.value as string | undefined, count: lineCounts[l.value] ?? 0 }))].map((tab) => {
          const active = (tab.value ?? undefined) === currentLine;
          return (
            <Link key={tab.value ?? "all"} href={buildFilterUrl(tab.value, undefined)}
              className={`shrink-0 px-3.5 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5 ${active ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-border"}`}>{tab.count}</span>
            </Link>
          );
        })}
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {[{ value: undefined, label: "ทุกหมวด", count: catTotal }, ...CATEGORIES.map((c) => ({ ...c, value: c.value as string | undefined, count: catCounts[c.value] ?? 0 }))].map((tab) => {
          const active = (tab.value ?? undefined) === currentCategory;
          return (
            <Link key={tab.value ?? "all"} href={buildFilterUrl(currentLine, tab.value)}
              className={`shrink-0 px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1 ${active ? "bg-foreground text-background" : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              {tab.label}
              <span className={`text-[10px] px-1 py-0.5 rounded-full ${active ? "bg-white/20" : "bg-border"}`}>{tab.count}</span>
            </Link>
          );
        })}
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">
            {total === 0 ? "ยังไม่มีสินค้า" : "ไม่มีสินค้าในหมวดนี้"}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-14">ภาพ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อสินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Line</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมวดหมู่</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                      {p.imageUrl
                        ? <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="40px" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.line === "luxury" ? "bg-primary/15 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {LINE_LABEL[p.line] ?? p.line}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{CAT_LABEL[p.category] ?? p.category}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? "bg-green-500/15 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && <span className="ml-1 text-primary">★</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setDrawer(p)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} disabled={isPending}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        basePath="/admin/products"
        params={{ line: currentLine, category: currentCategory }}
      />

      {drawer !== null && (
        <ProductDrawer product={drawer === "new" ? null : drawer} onClose={() => setDrawer(null)} />
      )}
    </>
  );
}
