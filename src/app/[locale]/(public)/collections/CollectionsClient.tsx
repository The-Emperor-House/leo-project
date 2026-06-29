"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

const CAT_LABELS: Record<string, string> = {
  furniture: "Furniture", lighting: "Lighting", ornament: "Ornament", hardwares: "Hardwares",
};
const LINE_LABELS: Record<string, string> = { classic: "Classic", luxury: "Luxury" };

type ProductItem = {
  id: string; title: string; imageUrl: string | null; images: string | null;
  description: string; line: string; category: string; featured: boolean;
};
type CategoryProducts = { preview: ProductItem[]; rest: ProductItem[] };
type LineProducts = Record<string, CategoryProducts>;

/* ── Product detail modal ── */
function ProductModal({ product, onClose }: { product: ProductItem; onClose: () => void }) {
  const gallery: string[] = product.images ? JSON.parse(product.images) : [];
  const allImages = [product.imageUrl, ...gallery].filter(Boolean) as string[];
  const [imgIdx, setImgIdx] = useState(0);
  const t = useTranslations("collections");

  function prev() { setImgIdx((i) => (i - 1 + allImages.length) % allImages.length); }
  function next() { setImgIdx((i) => (i + 1) % allImages.length); }

  return (
    <AnimatePresence>
      <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm" onClick={onClose} />

      <motion.div key="modal"
        initial={{ opacity: 0, scale: 0.94, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 16 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="pointer-events-auto bg-card rounded-2xl shadow-2xl border border-border w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          <button onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/90 backdrop-blur-sm border border-border hover:bg-secondary transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* Image gallery */}
            <div className="md:w-[56%] shrink-0 flex flex-col bg-secondary/30">
              <div className="relative aspect-[4/3] bg-secondary">
                <AnimatePresence mode="wait">
                  <motion.div key={imgIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }} className="absolute inset-0">
                    {allImages.length > 0 ? (
                      <Image src={allImages[imgIdx]} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 480px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
                {allImages.length > 1 && (
                  <>
                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
                    <div className="absolute bottom-3 right-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">{imgIdx + 1} / {allImages.length}</div>
                  </>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto bg-secondary/50 border-t border-border">
                  {allImages.map((src, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? "border-primary scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
                      <Image src={src} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              <div className="flex-1 px-6 py-6 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                      {LINE_LABELS[product.line] ?? product.line}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">
                      {CAT_LABELS[product.category] ?? product.category}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-semibold leading-snug text-foreground font-display">{product.title}</h2>
                </div>
                <div className="w-8 h-0.5 bg-primary/40 rounded" />
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed text-sm">{product.description}</p>
                )}
              </div>
              <div className="px-6 pb-6 pt-4 border-t border-border space-y-3 shrink-0">
                <p className="text-xs text-muted-foreground">สนใจสินค้าชิ้นนี้? ติดต่อเราเพื่อสอบถามราคาและรายละเอียดเพิ่มเติม</p>
                <Link href="/contact" onClick={onClose}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gold-glow tracking-wider">
                    {t("enquire")} <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Product card ── */
function ProductCard({ product, onSelect }: { product: ProductItem; onSelect: (p: ProductItem) => void }) {
  return (
    <button onClick={() => onSelect(product)}
      className="group text-left rounded-xl overflow-hidden border border-border bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 w-full">
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide">แนะนำ</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">ดูรายละเอียด</span>
        </div>
      </div>
      <div className="p-3.5">
        <h4 className="font-medium text-sm text-foreground mb-1 leading-snug line-clamp-2">{product.title}</h4>
        {product.description && <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{product.description}</p>}
      </div>
    </button>
  );
}

/* ── Featured section ── */
function FeaturedSection({ products, onSelect }: { products: ProductItem[]; onSelect: (p: ProductItem) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const t = useTranslations("collections");
  if (products.length === 0) return null;
  return (
    <section className="py-20 px-6 border-b border-border bg-secondary/20">
      <div ref={ref} className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.55 }} className="flex items-end justify-between mb-8">
          <div>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-2">Editor's Pick</p>
            <h2 className="text-3xl md:text-4xl font-light text-foreground">สินค้า<span className="gold-text font-semibold italic">แนะนำ</span></h2>
          </div>
          <p className="text-sm text-muted-foreground hidden sm:block">{products.length} รายการ คัดสรรโดยทีมงาน</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.55 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} onSelect={onSelect} />)}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Category grid within a line section ── */
function CategoryGrid({ category, products, onSelect }: { category: string; products: CategoryProducts; onSelect: (p: ProductItem) => void }) {
  const [showAll, setShowAll] = useState(false);
  const { preview, rest } = products;
  const total = preview.length + rest.length;
  if (total === 0) return null;
  const displayed = showAll ? [...preview, ...rest] : preview;

  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-3 mb-5">
        <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{CAT_LABELS[category] ?? category}</h3>
        <span className="text-xs text-muted-foreground">({total} รายการ)</span>
        <div className="flex-1 h-px bg-border" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {displayed.map((p) => <ProductCard key={p.id} product={p} onSelect={onSelect} />)}
      </div>
      {!showAll && rest.length > 0 && (
        <div className="mt-5 text-center">
          <button onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 border border-primary/30 hover:border-primary/60 hover:bg-primary/5 px-5 py-2 rounded-full transition-all">
            <ChevronDown className="w-4 h-4" />
            ดูเพิ่มเติม {rest.length} รายการ
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Line section (Classic / Luxury) ── */
function LineSection({ line, products, onSelect }: { line: string; products: LineProducts; onSelect: (p: ProductItem) => void }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const totalInLine = Object.values(products).reduce((sum, cat) => sum + cat.preview.length + cat.rest.length, 0);
  if (totalInLine === 0) return null;

  const isLuxury = line === "luxury";

  return (
    <section className={`py-20 px-6 border-b border-border ${isLuxury ? "damask-bg text-white" : "linen-bg"}`}>
      <div className="max-w-6xl mx-auto">
        <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="mb-14">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em] mb-3">
            {isLuxury ? "— Prestige Collection" : "— Heritage Collection"}
          </p>
          <h2 className={`text-5xl md:text-6xl font-light leading-tight ${isLuxury ? "text-white" : "text-foreground"}`}>
            <span className="gold-text font-semibold italic">{LINE_LABELS[line]}</span>
            <span className={`text-2xl md:text-3xl ml-3 font-light ${isLuxury ? "text-white/60" : "text-muted-foreground"}`}>Collection</span>
          </h2>
          <div className="w-12 h-0.5 bg-primary/60 rounded mt-6" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.6 }}>
          {["furniture", "lighting", "ornament", "hardwares"].map((cat) => (
            <CategoryGrid key={cat} category={cat} products={products[cat] ?? { preview: [], rest: [] }} onSelect={onSelect} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ── Main export ── */
export function CollectionsClient({ productsByLine, featuredProducts }: {
  productsByLine: { classic: LineProducts; luxury: LineProducts };
  featuredProducts: ProductItem[];
}) {
  const t = useTranslations("collections");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [selected, setSelected] = useState<ProductItem | null>(null);

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6 linen-bg border-b border-border">
        <div ref={heroRef} className="max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">{t("label")}</motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-light mb-5 leading-tight text-foreground">
            <span className="gold-text font-semibold italic">{t("heading")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto">{t("sub")}</motion.p>
        </div>
      </section>

      <FeaturedSection products={featuredProducts} onSelect={setSelected} />

      <LineSection line="classic" products={productsByLine.classic} onSelect={setSelected} />
      <LineSection line="luxury" products={productsByLine.luxury} onSelect={setSelected} />

      {/* CTA */}
      <section className="py-20 px-6 damask-bg text-white border-t border-border">
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
