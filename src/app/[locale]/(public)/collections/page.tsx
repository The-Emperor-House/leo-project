"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

function CategorySection({ id, label, labelSub, headline, desc, items, image, reversed }: {
  id: string; label: string; labelSub: string; headline: string; desc: string;
  items: string[]; image: string; reversed: boolean;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const t = useTranslations("collections");
  return (
    <section id={id} className="py-24 px-6 border-b border-border last:border-0">
      <div ref={ref} className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${reversed ? "lg:grid-flow-dense" : ""}`}>
        <motion.div initial={{ opacity: 0, x: reversed ? 30 : -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${reversed ? "lg:col-start-2" : ""}`}>
          <Image src={image} alt={label} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
          <div className="absolute top-5 left-5">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-border/60">{label}</span>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: reversed ? -30 : 30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15, duration: 0.7 }} className={reversed ? "lg:col-start-1 lg:row-start-1" : ""}>
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-1">{label}</p>
          <p className="text-muted-foreground text-sm mb-4">{labelSub}</p>
          <h2 className="text-4xl md:text-5xl font-light mb-5 leading-tight text-foreground">
            <span className="gold-text font-semibold italic">{headline}</span>
          </h2>
          <div className="w-10 h-0.5 bg-primary/50 rounded mb-6" />
          <p className="text-muted-foreground leading-relaxed mb-7">{desc}</p>
          <ul className="grid grid-cols-2 gap-2 mb-8">
            {items.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-foreground/80">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <Link href="/contact">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 tracking-wider gold-glow">
              {t("enquire")} <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function ExtraCard({ title, titleSub, desc, bg, delay }: { title: string; titleSub: string; desc: string; bg: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const t = useTranslations("collections");
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.55 }} className={`rounded-2xl border border-border p-10 ${bg}`}>
      <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">{title}</p>
      <h3 className="text-3xl font-light text-foreground mb-4">{titleSub}</h3>
      <p className="text-muted-foreground leading-relaxed mb-6">{desc}</p>
      <Link href="/contact">
        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5">
          {t("enquire")} <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </Link>
    </motion.div>
  );
}

export default function CollectionsPage() {
  const t = useTranslations("collections");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const extraRef = useRef(null);
  const extraInView = useInView(extraRef, { once: true, margin: "-60px" });

  const categories = [
    { id: "living", label: t("living_label"), labelSub: t("living_name"), headline: t("living_headline"), desc: t("living_desc"), image: `${BASE}/2014/12/Portfolio-LivingRoom.jpg`, items: [t("living_i1"), t("living_i2"), t("living_i3"), t("living_i4")], reversed: false },
    { id: "dining", label: t("dining_label"), labelSub: t("dining_name"), headline: t("dining_headline"), desc: t("dining_desc"), image: `${BASE}/2014/12/Portfolio-Dining.jpg`, items: [t("dining_i1"), t("dining_i2"), t("dining_i3"), t("dining_i4")], reversed: true },
    { id: "bedroom", label: t("bedroom_label"), labelSub: t("bedroom_name"), headline: t("bedroom_headline"), desc: t("bedroom_desc"), image: `${BASE}/2014/12/Bedroom-01.png`, items: [t("bedroom_i1"), t("bedroom_i2"), t("bedroom_i3"), t("bedroom_i4")], reversed: false },
    { id: "working", label: t("working_label"), labelSub: t("working_name"), headline: t("working_headline"), desc: t("working_desc"), image: `${BASE}/2014/10/leoAngelo-Zanaboni-006-w960-300x139.jpg`, items: [t("working_i1"), t("working_i2"), t("working_i3"), t("working_i4")], reversed: true },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6 linen-bg border-b border-border">
        <div ref={heroRef} className="max-w-3xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {t("label")}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-5xl md:text-6xl font-light mb-5 leading-tight text-foreground">
            <span className="gold-text font-semibold italic">{t("heading")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {t("sub")}
          </motion.p>
        </div>
      </section>

      {categories.map((cat) => <CategorySection key={cat.id} {...cat} />)}

      {/* Lighting & Ornament */}
      <section className="py-24 px-6 linen-bg border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div ref={extraRef} className="text-center mb-14">
            <motion.p initial={{ opacity: 0, y: 20 }} animate={extraInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              {t("extra_label")}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={extraInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.6 }} className="text-4xl md:text-5xl font-light text-foreground">
              {t("lighting_title")} &amp;{" "}
              <span className="gold-text font-semibold italic">{t("ornament_title")}</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ExtraCard title={t("lighting_title")} titleSub={t("lighting_name")} desc={t("lighting_desc")} bg="bg-accent/10" delay={0} />
            <ExtraCard title={t("ornament_title")} titleSub={t("ornament_name")} desc={t("ornament_desc")} bg="bg-primary/5" delay={0.15} />
          </div>
        </div>
      </section>

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
    </main>
  );
}
