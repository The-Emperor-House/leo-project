"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Upload, Loader2, ImageIcon, Search, Check } from "lucide-react";
import Image from "next/image";
import { upsertRoom, deleteRoom } from "./actions";
import { uploadImage } from "../actions";

type Room = {
  id: string; slug: string; nameEn: string; nameTh: string;
  descriptionEn: string | null; descriptionTh: string | null; coverImage: string | null;
  published: boolean; order: number; productIds: string[];
};

type ProductOption = {
  id: string; title: string; imageUrl: string | null; line: string; category: string; published: boolean;
};

const CATEGORIES = [
  { value: "furniture", label: "Furniture" },
  { value: "lighting", label: "Lighting" },
  { value: "ornament", label: "Ornament" },
  { value: "hardwares", label: "Hardwares" },
];
const CAT_LABEL: Record<string, string> = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.label]));

const MAX_UPLOAD_MB = 20;

function toSlug(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").replace(/--+/g, "-").replace(/^-|-$/g, "");
}

function ProductPicker({ products, selected, onToggle }: {
  products: ProductOption[]; selected: Set<string>; onToggle: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [onlySelected, setOnlySelected] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) =>
      (!category || p.category === category) &&
      (!onlySelected || selected.has(p.id)) &&
      (!q || p.title.toLowerCase().includes(q))
    );
  }, [products, query, category, onlySelected, selected]);

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="p-2.5 space-y-2 border-b border-border bg-secondary/30">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ค้นหาสินค้า..."
            className="w-full rounded-md border border-border bg-card pl-8 pr-3 py-1.5 text-sm outline-none focus:border-primary/60" />
        </div>
        <div className="flex gap-1 flex-wrap">
          {[{ value: null as string | null, label: "ทุกหมวด" }, ...CATEGORIES].map((c) => (
            <button key={c.value ?? "all"} type="button" onClick={() => setCategory(c.value)}
              className={`px-2.5 py-0.5 rounded-md text-xs transition-colors ${category === c.value ? "bg-foreground text-background" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"}`}>
              {c.label}
            </button>
          ))}
          <button type="button" onClick={() => setOnlySelected((v) => !v)}
            className={`ml-auto px-2.5 py-0.5 rounded-md text-xs transition-colors ${onlySelected ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground hover:bg-secondary"}`}>
            เลือกแล้ว ({selected.size})
          </button>
        </div>
      </div>
      <div className="max-h-72 overflow-y-auto divide-y divide-border">
        {filtered.length === 0 ? (
          <p className="p-6 text-center text-xs text-muted-foreground">ไม่พบสินค้า</p>
        ) : filtered.map((p) => {
          const checked = selected.has(p.id);
          return (
            <button key={p.id} type="button" onClick={() => onToggle(p.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors ${checked ? "bg-primary/5" : "hover:bg-secondary/40"}`}>
              <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${checked ? "bg-primary border-primary text-primary-foreground" : "border-border"}`}>
                {checked && <Check className="w-3 h-3" />}
              </span>
              <span className="relative w-9 h-9 rounded-md overflow-hidden bg-secondary shrink-0">
                {p.imageUrl
                  ? <Image src={p.imageUrl} alt="" fill className="object-cover" sizes="36px" />
                  : <span className="w-full h-full flex items-center justify-center"><ImageIcon className="w-3.5 h-3.5 text-muted-foreground" /></span>}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm truncate">{p.title}</span>
                <span className="block text-xs text-muted-foreground">
                  {CAT_LABEL[p.category] ?? p.category} · {p.line === "luxury" ? "Luxury" : "Classic"}{!p.published && " · Draft"}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoomDrawer({ room, products, onClose }: { room: Room | null; products: ProductOption[]; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [slug, setSlug] = useState(room?.slug ?? "");
  const [coverImage, setCoverImage] = useState(room?.coverImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set(room?.productIds ?? []));
  const uploadToken = useRef(0);
  const fileRef = useRef<HTMLInputElement>(null);

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function handleUpload(file: File) {
    if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
      alert(`ไฟล์ใหญ่เกินไป (${(file.size / 1024 / 1024).toFixed(1)}MB) ขนาดสูงสุดที่อัปโหลดได้คือ ${MAX_UPLOAD_MB}MB`);
      return;
    }
    const token = ++uploadToken.current;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const { url } = await uploadImage(fd);
      if (uploadToken.current === token) setCoverImage(url);
    } catch {
      if (uploadToken.current === token) alert("อัปโหลดรูปไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      if (uploadToken.current === token) setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("coverImage", coverImage);
    selected.forEach((id) => fd.append("productIds", id));
    startTransition(async () => {
      const res = await upsertRoom(fd);
      if (res.error) { setError(res.error); return; }
      router.refresh();
      onClose();
    });
  }

  const inputCls = "w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60";

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-xl bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-semibold">{room ? "แก้ไขห้อง" : "เพิ่มห้องใหม่"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {room && <input type="hidden" name="id" value={room.id} />}

          <div className="space-y-2">
            <label className="text-sm font-medium">ภาพหน้าปก</label>
            <div className="max-w-xs relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30">
              {coverImage ? (
                <>
                  <Image src={coverImage} alt="" fill className="object-cover" sizes="320px" />
                  <button type="button" onClick={() => setCoverImage("")}
                    className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : uploading ? (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <button type="button" onClick={() => { uploadToken.current++; setUploading(false); }}
                    className="text-xs underline hover:text-foreground transition-colors">ยกเลิก</button>
                </div>
              ) : (
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                  <Upload className="w-5 h-5" /><span className="text-xs">อัปโหลด</span>
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ""; }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ชื่อห้อง (EN)</label>
              <input name="nameEn" defaultValue={room?.nameEn ?? ""} required placeholder="Living Room" className={inputCls}
                onChange={(e) => { if (!room) setSlug(toSlug(e.target.value)); }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ชื่อห้อง (TH)</label>
              <input name="nameTh" defaultValue={room?.nameTh ?? ""} required placeholder="ห้องนั่งเล่น" className={inputCls} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Slug (URL)</label>
            <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="living-room"
              className={`${inputCls} font-mono`} />
            <p className="text-xs text-muted-foreground">ลิงก์หน้าเว็บ: <span className="font-mono">/rooms/{slug || "..."}</span></p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">รายละเอียด (EN)</label>
              <textarea name="descriptionEn" defaultValue={room?.descriptionEn ?? ""} rows={3} className={`${inputCls} resize-none`} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">รายละเอียด (TH)</label>
              <textarea name="descriptionTh" defaultValue={room?.descriptionTh ?? ""} rows={3} className={`${inputCls} resize-none`} />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">สินค้าในห้องนี้ ({selected.size} รายการ)</label>
            <ProductPicker products={products} selected={selected} onToggle={toggleProduct} />
          </div>

          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" defaultChecked={room?.published ?? true} /> Published
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm">Order</span>
              <input type="number" name="order" defaultValue={room?.order ?? 0}
                className="w-16 rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-sm outline-none focus:border-primary/60 text-center" />
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={isPending || uploading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {room ? "บันทึก" : "สร้างห้อง"}
          </button>
        </form>
      </aside>
    </>
  );
}

export function RoomsClient({ rooms, products }: { rooms: Room[]; products: ProductOption[] }) {
  const router = useRouter();
  const [drawer, setDrawer] = useState<Room | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(room: Room) {
    if (!confirm(`ลบห้อง "${room.nameTh}"? (สินค้าจะไม่ถูกลบ แค่เอาออกจากห้องนี้)`)) return;
    startTransition(async () => {
      const fd = new FormData(); fd.append("id", room.id);
      await deleteRoom(fd); router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 font-display">Rooms</h1>
          <p className="text-sm text-muted-foreground">จัดสินค้าเข้าห้อง · {rooms.length} ห้อง</p>
        </div>
        <button onClick={() => setDrawer("new")}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors">
          <Plus className="w-4 h-4" /> เพิ่มห้อง
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {rooms.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">ยังไม่มีห้อง</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-14">ภาพ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ห้อง</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สินค้า</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {rooms.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                      {r.coverImage
                        ? <Image src={r.coverImage} alt="" fill className="object-cover" sizes="40px" />
                        : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="w-4 h-4 text-muted-foreground" /></div>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{r.nameTh} <span className="text-muted-foreground font-normal">· {r.nameEn}</span></p>
                    <p className="text-xs text-muted-foreground font-mono">/rooms/{r.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.productIds.length} รายการ</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.published ? "bg-green-500/15 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                      {r.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button onClick={() => setDrawer(r)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(r)} disabled={isPending}
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

      {drawer !== null && (
        <RoomDrawer room={drawer === "new" ? null : drawer} products={products} onClose={() => setDrawer(null)} />
      )}
    </>
  );
}
