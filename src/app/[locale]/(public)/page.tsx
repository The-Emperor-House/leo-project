"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Gem, Clock, Truck, Star, ChevronRight } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

function CollectionCard({ title, subtitle, image, href, delay }: { title: string; subtitle: string; image: string; href: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.55 }}>
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
          <Image src={image} alt={title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 25vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white/70 text-xs tracking-widest uppercase">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium text-foreground font-display">{title}</h3>
          <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

function ValueCard({ icon: Icon, title, desc, delay }: { icon: React.ElementType; title: string; desc: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, scale: 0.96 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay, duration: 0.5 }} className="rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-medium mb-3 text-foreground font-display">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function TestimonialCard({ text, author, role, delay }: { text: string; author: string; role: string; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay, duration: 0.5 }} className="rounded-2xl border border-border bg-card p-7 flex flex-col gap-4">
      <div className="flex gap-1">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}</div>
      <p className="text-base italic text-foreground/80 leading-relaxed flex-1 font-display">&ldquo;{text}&rdquo;</p>
      <div>
        <p className="font-semibold text-sm text-foreground">{author}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const t = useTranslations("home");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const collectionsRef = useRef(null);
  const collectionsInView = useInView(collectionsRef, { once: true, margin: "-60px" });
  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-60px" });
  const aboutRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-80px" });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: "-80px" });

  const collections = [
    { id: "living", title: t("col_living_label"), subtitle: t("col_living_name"), image: `${BASE}/2014/12/Portfolio-LivingRoom.jpg`, href: "/collections#living" },
    { id: "dining", title: t("col_dining_label"), subtitle: t("col_dining_name"), image: `${BASE}/2014/12/Portfolio-Dining.jpg`, href: "/collections#dining" },
    { id: "bedroom", title: t("col_bedroom_label"), subtitle: t("col_bedroom_name"), image: `${BASE}/2014/12/Bedroom-01.png`, href: "/collections#bedroom" },
    { id: "working", title: t("col_working_label"), subtitle: t("col_working_name"), image: `${BASE}/2014/10/leoAngelo-Zanaboni-006-w960-300x139.jpg`, href: "/collections#working" },
  ];

  const values = [
    { icon: Gem, title: t("col_living_headline"), desc: t("col_living_desc") },
    { icon: Shield, title: t("col_dining_headline"), desc: t("col_dining_desc") },
    { icon: Clock, title: t("col_bedroom_headline"), desc: t("col_bedroom_desc") },
    { icon: Truck, title: t("col_working_headline"), desc: t("col_working_desc") },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src={`${BASE}/2014/10/leoAngelo-05_Wiriya-015-w960.jpg`} alt="LeoAngelo Classic Furniture" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        </div>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white" ref={heroRef}>
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="ornament text-xs tracking-[0.3em] uppercase text-primary font-medium mb-8 max-w-xs mx-auto">
            {t("hero_label")}
          </motion.div>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="text-6xl md:text-8xl font-light tracking-wide mb-4 leading-none">
            {t("hero_h1")}
          </motion.h1>
          <motion.h1 custom={2} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="text-5xl md:text-7xl font-semibold italic tracking-wide mb-8 leading-none gold-text">
            {t("hero_h2")}
          </motion.h1>
          <motion.p custom={3} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="text-lg text-white/65 max-w-xl mx-auto mb-12 leading-relaxed">
            {t("hero_desc")}
          </motion.p>
          <motion.div custom={4} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/collections">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-13 text-base gold-glow tracking-widest" style={{ letterSpacing: "0.1em" }}>
                {t("hero_btn_collections")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground h-13 text-base px-8 transition-all duration-300 shadow-none">
                {t("hero_btn_contact")}
              </Button>
            </Link>
          </motion.div>
        </div>

        <motion.div custom={5} variants={fadeUp} initial="hidden" animate={heroInView ? "show" : "hidden"} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <span className="text-[10px] text-white/40 tracking-[0.25em] uppercase">Scroll</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </section>

      {/* Collections */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={collectionsRef}>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={collectionsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.2em] text-center mb-3">
              {t("col_label")}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={collectionsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.6 }} className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground">
              <span className="gold-text font-semibold italic">{t("col_heading")}</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {collections.map((col, i) => <CollectionCard key={col.id} {...col} delay={i * 0.1} />)}
          </div>
          <div className="text-center mt-10">
            <Link href="/collections">
              <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 px-8 tracking-wider">
                {t("col_view_all")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-28 px-6 linen-bg border-y border-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div ref={aboutRef}>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={aboutInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              {t("about_label")}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={aboutInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground">
              <span className="gold-text font-semibold italic">{t("about_heading")}</span>
            </motion.h2>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={aboutInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-muted-foreground leading-relaxed mb-5">{t("about_desc1")}</motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={aboutInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25, duration: 0.55 }} className="text-muted-foreground leading-relaxed mb-8">{t("about_desc2")}</motion.p>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={aboutInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.55 }}>
              <Link href="/about">
                <Button variant="outline" className="border-primary/40 text-primary hover:bg-primary/5 px-6 tracking-wider">
                  {t("about_learn")} <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={aboutInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2, duration: 0.6 }} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
            <Image src={`${BASE}/2014/10/leoAngelo-02_PreeDee020-w960.jpg`} alt="LeoAngelo Showroom" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
            <div className="absolute bottom-5 right-5 bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-5 text-center">
              <p className="text-3xl font-semibold gold-text font-display">12+</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">{t("about_stat")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={valuesRef}>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={valuesInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.6 }} className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground">
              LeoAngelo
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => <ValueCard key={i} {...v} delay={i * 0.1} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-28 px-6 linen-bg border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div ref={testimonialsRef}>
            <motion.p initial={{ opacity: 0, y: 20 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.2em] text-center mb-3">
              {t("testi_label")}
            </motion.p>
            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={testimonialsInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.08, duration: 0.6 }} className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground">
              <span className="gold-text font-semibold italic">{t("testi_heading")}</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard text={t("testi1_text")} author={t("testi1_author")} role={t("testi1_role")} delay={0} />
            <TestimonialCard text={t("testi2_text")} author={t("testi2_author")} role={t("testi2_role")} delay={0.1} />
            <TestimonialCard text={t("testi3_text")} author={t("testi3_author")} role={t("testi3_role")} delay={0.2} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 px-6 damask-bg text-white">
        <div ref={ctaRef} className="max-w-3xl mx-auto text-center">
          <motion.h2 initial={{ opacity: 0, y: 30 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-4xl md:text-5xl font-light mb-4 leading-tight">
            {t("cta_heading")}{" "}
            <span className="gold-text font-semibold italic">Real Italy Furniture</span>
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.55 }} className="text-white/70 text-base leading-relaxed mb-4 max-w-xl mx-auto">
            {t("cta_sub")}
          </motion.p>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-primary font-semibold text-lg mb-10">
            {t("cta_phone")}
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={ctaInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.3, duration: 0.55 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base gold-glow tracking-wider">
                {t("cta_btn_contact")} <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground h-12 text-base px-8 tracking-wider transition-all duration-300 shadow-none">
                {t("cta_btn_collections")}
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
