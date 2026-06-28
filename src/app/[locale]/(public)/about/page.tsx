"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Hammer, Heart, Leaf } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

function TimelineItem({ year, title, desc, delay }: { year: string; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay, duration: 0.55 }} className="relative pl-16">
      <div className="absolute left-0 w-12 h-12 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center">
        <span className="text-[10px] font-bold text-primary text-center leading-tight px-1 font-display">{year}</span>
      </div>
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-xl font-medium text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

function CraftCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.55 }} className="flex gap-5">
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="text-lg font-medium mb-2 text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const t = useTranslations("about");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const craftRef = useRef(null);
  const craftInView = useInView(craftRef, { once: true, margin: "-80px" });

  const milestones = [
    { year: t("t1_year"), title: t("t1_title"), desc: t("t1_desc") },
    { year: t("t2_year"), title: t("t2_title"), desc: t("t2_desc") },
    { year: t("t3_year"), title: t("t3_title"), desc: t("t3_desc") },
    { year: t("t4_year"), title: t("t4_title"), desc: t("t4_desc") },
    { year: t("t5_year"), title: t("t5_title"), desc: t("t5_desc") },
  ];

  const craftValues = [
    { icon: Gem, title: "Direct from Italy", desc: t("craft_p1") },
    { icon: Hammer, title: "True Handmade", desc: t("craft_p2") },
    { icon: Heart, title: "Timeless Classics", desc: t("craft_p1") },
    { icon: Leaf, title: "Premium Materials", desc: t("craft_p2") },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image src={`${BASE}/2014/10/leoAngelo-05_Wiriya-004-w960.jpg`} alt="LeoAngelo Showroom" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {t("hero_label")}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-5xl md:text-6xl font-light mb-5 leading-tight">
            {t("hero_heading")}{" "}
            <span className="gold-text font-semibold italic">{t("hero_heading2")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-white/65 leading-relaxed max-w-xl mx-auto">
            {t("hero_sub")}
          </motion.p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 px-6">
        <div ref={storyRef} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={storyInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <Image src={`${BASE}/2014/10/leoAngelo-02_PreeDee003-w960.jpg`} alt="LeoAngelo Classic Furniture" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xl italic font-light leading-snug font-display">
                &ldquo;Your home should tell the story of who you are.&rdquo;
              </p>
              <p className="text-sm mt-2 text-white/70">— LeoAngelo, Founder</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={storyInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15, duration: 0.7 }}>
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">{t("story_label")}</p>
            <h2 className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground">
              <span className="gold-text font-semibold italic">{t("story_heading")}</span>
            </h2>
            <div className="w-10 h-0.5 bg-primary/50 rounded mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-5">{t("story_p1")}</p>
            <p className="text-muted-foreground leading-relaxed mb-5">{t("story_p2")}</p>
            <p className="text-muted-foreground leading-relaxed">{t("story_p3")}</p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 linen-bg border-y border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">{t("timeline_label")}</p>
            <h2 className="text-4xl md:text-5xl font-light text-foreground">
              <span className="gold-text font-semibold italic">{t("timeline_heading")}</span>
            </h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <TimelineItem key={m.year} year={m.year} title={m.title} desc={m.desc} delay={i * 0.08} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship */}
      <section id="craftsmanship" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={craftRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={craftInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
                {t("craft_label")}
              </motion.p>
              <motion.h2 initial={{ opacity: 0, y: 30 }} animate={craftInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground">
                <span className="gold-text font-semibold italic">{t("craft_heading")}</span>
              </motion.h2>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={craftInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-muted-foreground leading-relaxed mb-4">
                {t("craft_p1")}
              </motion.p>
              <motion.p initial={{ opacity: 0, y: 20 }} animate={craftInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25, duration: 0.55 }} className="text-muted-foreground leading-relaxed">
                {t("craft_p2")}
              </motion.p>
            </div>

            <div className="flex flex-col gap-8">
              {craftValues.slice(0, 2).map((cv, i) => (
                <CraftCard key={i} icon={cv.icon} title={cv.title} desc={cv.desc} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary/40 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-4 text-foreground">
            {t("cta_heading")}
          </h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">{t("cta_desc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gold-glow tracking-wider">
                {t("cta_btn")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 px-8">
                Collections
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
