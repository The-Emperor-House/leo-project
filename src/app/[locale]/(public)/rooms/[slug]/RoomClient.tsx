"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { CategoryGrid, ProductModal, type CategoryProducts, type ProductItem } from "../../collections/CollectionsClient";

export function RoomClient({ name, altName, description, coverImage, productCount, byCategory, otherRooms, labels }: {
  name: string;
  altName: string;
  description: string | null;
  coverImage: string | null;
  productCount: number;
  byCategory: { category: string; products: CategoryProducts }[];
  otherRooms: { slug: string; name: string }[];
  labels: { back: string; count: string; empty: string; other: string };
}) {
  const t = useTranslations("collections");
  const [selected, setSelected] = useState<ProductItem | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[360px] overflow-hidden bg-[oklch(0.10_0.022_52)]">
        {coverImage && (
          <Image src={coverImage} alt={name} fill className="object-cover opacity-60" sizes="100vw" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 max-w-6xl mx-auto">
          <Link href="/rooms" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> {labels.back}
          </Link>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">{altName}</p>
          <h1 className="text-4xl md:text-6xl font-light text-white leading-tight font-display">{name}</h1>
          <p className="text-white/60 text-sm mt-3">{labels.count}</p>
        </div>
      </section>

      {description && (
        <section className="py-10 px-6 border-b border-border">
          <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">{description}</p>
        </section>
      )}

      {/* Products, grouped by category */}
      <section className="py-16 px-6 linen-bg">
        <div className="max-w-6xl mx-auto">
          {productCount === 0 ? (
            <p className="text-center text-muted-foreground py-16">{labels.empty}</p>
          ) : (
            byCategory.map((g) => (
              <CategoryGrid key={g.category} category={g.category} products={g.products} onSelect={setSelected} anchorId />
            ))
          )}
        </div>
      </section>

      {/* Other rooms */}
      {otherRooms.length > 0 && (
        <section className="py-12 px-6 border-t border-border">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-5">{labels.other}</h2>
            <div className="flex flex-wrap gap-2">
              {otherRooms.map((r) => (
                <Link key={r.slug} href={`/rooms/${r.slug}` as "/rooms/[slug]"}
                  className="px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                  {r.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 px-6 damask-bg text-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4">{t("custom_heading")}</h2>
          <p className="text-white/65 mb-3 leading-relaxed">{t("custom_desc")}</p>
          <p className="text-primary font-semibold mb-8">{t("custom_phone")}</p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 gold-glow tracking-wider">
              {t("custom_btn")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {selected && <ProductModal product={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
