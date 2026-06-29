import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Link } from "@/navigation";
import { MapPin, Images } from "lucide-react";
import { Pagination } from "@/components/Pagination";

const PAGE_SIZE = 12;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page ?? "1"));

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.project.count({ where: { published: true } }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main>
      {/* Hero */}
      <section className="py-24 px-6 text-center damask-bg text-white">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">Portfolio</p>
        <h1 className="text-5xl md:text-6xl font-light mb-4">
          <span className="gold-text font-semibold italic">ผลงานของเรา</span>
        </h1>
        <p className="text-white/60 max-w-xl mx-auto text-base leading-relaxed">
          รวมผลงานการตกแต่งบ้านด้วยเฟอร์นิเจอร์คลาสสิคจากอิตาลี ทุกโปรเจคออกแบบโดยทีมงานผู้เชี่ยวชาญ
        </p>
      </section>

      {/* Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-20">ยังไม่มีผลงาน</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((p) => {
                const imgCount = p.images ? (JSON.parse(p.images) as string[]).length : 0;
                return (
                  <Link key={p.id} href={`/projects/${p.slug}` as "/projects/[slug]"} className="group block">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary mb-4">
                      {p.coverImage ? (
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Images className="w-10 h-10 opacity-30" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <span className="text-white text-sm font-medium">ดูผลงาน →</span>
                      </div>
                      {p.featured && (
                        <div className="absolute top-3 left-3 bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 rounded-full font-medium">
                          Featured
                        </div>
                      )}
                      {imgCount > 0 && (
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5">
                          <Images className="w-3 h-3" /> {imgCount}
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors font-display">{p.title}</h2>
                      {p.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 shrink-0" /> {p.location}
                        </p>
                      )}
                      {p.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{p.description}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
          <Pagination page={page} totalPages={totalPages} basePath={`/projects`} />
        </div>
      </section>
    </main>
  );
}
