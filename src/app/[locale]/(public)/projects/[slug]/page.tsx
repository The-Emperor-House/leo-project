import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/navigation";
import { MapPin, Tag, ArrowLeft } from "lucide-react";
import { Gallery } from "./Gallery";

const styleLabel: Record<string, string> = {
  classic: "Classic",
  contemporary: "Contemporary",
  luxury: "Luxury",
  modern: "Modern",
};

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug, published: true } });
  if (!project) notFound();

  const images: string[] = project.images ? JSON.parse(project.images) : [];

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[380px] overflow-hidden bg-[oklch(0.10_0.022_52)]">
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            className="object-cover opacity-60"
            sizes="100vw"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-5xl mx-auto">
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> ผลงานทั้งหมด
          </Link>
          <div className="flex flex-wrap gap-2 mb-3">
            {project.location && (
              <span className="flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> {project.location}
              </span>
            )}
            {project.style && (
              <span className="flex items-center gap-1 text-white/70 text-xs bg-white/10 px-2.5 py-1 rounded-full">
                <Tag className="w-3 h-3" /> {styleLabel[project.style] ?? project.style}
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-light text-white leading-tight font-display">
            {project.title}
          </h1>
        </div>
      </section>

      {/* Description */}
      {project.description && (
        <section className="py-10 px-6 border-b border-border">
          <div className="max-w-3xl mx-auto">
            <p className="text-muted-foreground leading-relaxed text-base">{project.description}</p>
          </div>
        </section>
      )}

      {/* Gallery */}
      {images.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.2em] mb-6">
              {images.length} รูป
            </p>
            <Gallery images={images} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 linen-bg border-t border-border text-center">
        <p className="text-muted-foreground mb-4">สนใจตกแต่งบ้านด้วยเฟอร์นิเจอร์คลาสสิคจากอิตาลี?</p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-sm font-medium transition-colors gold-glow tracking-wider"
        >
          ติดต่อเรา
        </Link>
      </section>
    </main>
  );
}
