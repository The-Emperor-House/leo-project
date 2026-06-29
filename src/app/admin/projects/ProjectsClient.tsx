"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, X, Upload, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";
import { upsertProject, deleteProject } from "./actions";
import { uploadImage } from "../actions";

type Project = {
  id: string; title: string; slug: string; location: string | null;
  description: string | null; coverImage: string | null; images: string | null;
  style: string | null; featured: boolean; published: boolean; order: number;
};

function toSlug(s: string) {
  return s.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "").replace(/--+/g, "-");
}

function ImageUploadSlot({
  url, onUploaded, onRemove, uploading, onUpload,
}: {
  url: string; onUploaded: (u: string) => void; onRemove: () => void;
  uploading: boolean; onUpload: (f: File) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary/30">
      {url ? (
        <>
          <Image src={url} alt="" fill className="object-cover" sizes="200px" />
          <button
            type="button"
            onClick={onRemove}
            className="absolute top-1.5 right-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-xs">อัปโหลด</span>
            </>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
          />
        </button>
      )}
    </div>
  );
}

function ProjectDrawer({
  project, onClose,
}: {
  project: Project | null; onClose: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [style, setStyle] = useState(project?.style ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [published, setPublished] = useState(project?.published ?? true);
  const [order, setOrder] = useState(project?.order ?? 0);
  const [coverImage, setCoverImage] = useState(project?.coverImage ?? "");
  const [galleryImages, setGalleryImages] = useState<string[]>(
    project?.images ? JSON.parse(project.images) : []
  );
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingIdx, setUploadingIdx] = useState<number | null>(null);

  async function handleUpload(file: File, isCover: boolean, idx?: number) {
    if (isCover) setUploadingCover(true);
    else setUploadingIdx(idx ?? null);
    const fd = new FormData();
    fd.append("file", file);
    const { url } = await uploadImage(fd);
    if (isCover) { setCoverImage(url); setUploadingCover(false); }
    else {
      setGalleryImages((prev) => {
        const next = [...prev];
        if (idx !== undefined && idx < next.length) next[idx] = url;
        else next.push(url);
        return next;
      });
      setUploadingIdx(null);
    }
  }

  function handleTitleChange(v: string) {
    setTitle(v);
    if (!project) setSlug(toSlug(v));
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (coverImage) fd.set("coverImage", coverImage);
    galleryImages.filter(Boolean).forEach((u) => fd.append("images", u));
    startTransition(async () => {
      await upsertProject(fd);
      router.refresh();
      onClose();
    });
  }

  const slots = [...galleryImages, ""];

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-lg bg-card border-l border-border shadow-xl z-50 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 className="font-semibold">{project ? "แก้ไขโปรเจค" : "เพิ่มโปรเจคใหม่"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {project && <input type="hidden" name="id" value={project.id} />}

          {/* Cover image */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ภาพหน้าปก</label>
            <div className="max-w-xs">
              <ImageUploadSlot
                url={coverImage}
                onUploaded={setCoverImage}
                onRemove={() => setCoverImage("")}
                uploading={uploadingCover}
                onUpload={(f) => handleUpload(f, true)}
              />
              <input type="hidden" name="coverImage" value={coverImage} />
            </div>
          </div>

          {/* Title + Slug */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ชื่อโปรเจค</label>
              <input name="title" value={title} onChange={(e) => handleTitleChange(e.target.value)} required
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                Slug (URL)
                <span className="group relative">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-muted text-muted-foreground text-[10px] font-bold cursor-default select-none">?</span>
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-foreground text-background text-xs px-3 py-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                    ใช้เป็นส่วนท้ายของ URL เช่น slug <span className="font-mono bg-white/10 px-1 rounded">classic-sathorn</span> จะได้ลิงก์ <span className="font-mono bg-white/10 px-1 rounded">/projects/classic-sathorn</span> — ใช้ภาษาอังกฤษตัวเล็ก คั่นด้วย - ห้ามซ้ำ
                    <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-foreground" />
                  </span>
                </span>
              </label>
              <input name="slug" value={slug} onChange={(e) => setSlug(e.target.value)} required
                placeholder="เช่น classic-sathorn"
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60 font-mono" />
            </div>
          </div>

          {/* Location + Style */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">ทำเล / ที่ตั้ง</label>
              <input name="location" value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="เช่น กรุงเทพฯ, นนทบุรี"
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">สไตล์</label>
              <select name="style" value={style} onChange={(e) => setStyle(e.target.value)}
                className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60">
                <option value="">— เลือก —</option>
                <option value="classic">Classic</option>
                <option value="contemporary">Contemporary</option>
                <option value="luxury">Luxury</option>
                <option value="modern">Modern</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">รายละเอียด</label>
            <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)}
              rows={3} className="w-full rounded-lg border border-border bg-secondary/40 px-3 py-2 text-sm outline-none focus:border-primary/60 resize-none" />
          </div>

          {/* Gallery images */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> แกลลอรี่ ({galleryImages.filter(Boolean).length} รูป)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {slots.map((url, idx) => (
                <ImageUploadSlot
                  key={idx}
                  url={url}
                  onUploaded={(u) => setGalleryImages((prev) => { const next = [...prev]; next[idx] = u; return next; })}
                  onRemove={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                  uploading={uploadingIdx === idx}
                  onUpload={(f) => handleUpload(f, false, idx)}
                />
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded" />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" name="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="rounded" />
              Featured
            </label>
            <div className="flex items-center gap-2">
              <label className="text-sm">Order</label>
              <input type="number" name="order" value={order} onChange={(e) => setOrder(Number(e.target.value))}
                className="w-16 rounded-lg border border-border bg-secondary/40 px-2 py-1.5 text-sm outline-none focus:border-primary/60 text-center" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending || uploadingCover || uploadingIdx !== null}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm py-2.5 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            {project ? "บันทึก" : "สร้างโปรเจค"}
          </button>
        </form>
      </aside>
    </>
  );
}

export function ProjectsClient({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [drawerProject, setDrawerProject] = useState<Project | "new" | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    if (!confirm("ลบโปรเจคนี้?")) return;
    startTransition(async () => {
      const fd = new FormData();
      fd.append("id", id);
      await deleteProject(fd);
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1 font-display">Projects</h1>
          <p className="text-sm text-muted-foreground">ผลงานการตกแต่งบ้าน</p>
        </div>
        <button
          onClick={() => setDrawerProject("new")}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" /> เพิ่มโปรเจค
        </button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        {projects.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">ยังไม่มีโปรเจค</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground w-14">ภาพ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อ</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">ทำเล</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-secondary">
                      {p.coverImage ? (
                        <Image src={p.coverImage} alt="" fill className="object-cover" sizes="40px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{p.title}</p>
                    <p className="text-xs text-muted-foreground font-mono">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.location || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${p.published ? "bg-green-500/15 text-green-600" : "bg-secondary text-muted-foreground"}`}>
                      {p.published ? "Published" : "Draft"}
                    </span>
                    {p.featured && <span className="ml-1 text-primary">★</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        onClick={() => setDrawerProject(p)}
                        className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                      >
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

      {drawerProject !== null && (
        <ProjectDrawer
          project={drawerProject === "new" ? null : drawerProject}
          onClose={() => setDrawerProject(null)}
        />
      )}
    </>
  );
}
