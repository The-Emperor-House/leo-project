import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

function buildHref(basePath: string, params: Record<string, string | undefined>, page: number) {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v && v !== "all") p.set(k, v); });
  p.set("page", String(page));
  return `${basePath}?${p.toString()}`;
}

function pageRange(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

const btnBase = "h-8 min-w-[2rem] px-2 rounded-lg text-sm flex items-center justify-center transition-colors";

export function Pagination({ page, totalPages, basePath, params = {} }: {
  page: number;
  totalPages: number;
  basePath: string;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const pages = pageRange(page, totalPages);

  return (
    <nav className="flex items-center justify-center gap-1 mt-6 select-none">
      {page > 1 ? (
        <Link href={buildHref(basePath, params, page - 1)} className={`${btnBase} bg-secondary hover:bg-border text-foreground`}>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className={`${btnBase} opacity-30 bg-secondary text-foreground pointer-events-none`}><ChevronLeft className="w-4 h-4" /></span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className={`${btnBase} text-muted-foreground`}>…</span>
        ) : (
          <Link key={p} href={buildHref(basePath, params, p)}
            className={`${btnBase} font-medium ${p === page ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-border text-foreground"}`}>
            {p}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link href={buildHref(basePath, params, page + 1)} className={`${btnBase} bg-secondary hover:bg-border text-foreground`}>
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={`${btnBase} opacity-30 bg-secondary text-foreground pointer-events-none`}><ChevronRight className="w-4 h-4" /></span>
      )}
    </nav>
  );
}
