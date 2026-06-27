"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Gem, Clock, Truck, Star, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] },
  }),
};

// ─── Collection card ──────────────────────────────────────────
const collections = [
  {
    id: "living",
    title: "Living Room",
    subtitle: "ห้องนั่งเล่น",
    image: `${BASE}/2014/12/Portfolio-LivingRoom.jpg`,
    href: "/collections#living",
  },
  {
    id: "dining",
    title: "Dining Room",
    subtitle: "ห้องรับประทานอาหาร",
    image: `${BASE}/2014/12/Portfolio-Dining.jpg`,
    href: "/collections#dining",
  },
  {
    id: "bedroom",
    title: "Bedroom",
    subtitle: "ห้องนอน",
    image: `${BASE}/2014/12/Bedroom-01.png`,
    href: "/collections#bedroom",
  },
  {
    id: "working",
    title: "Working Room",
    subtitle: "ห้องทำงาน",
    image: `${BASE}/2014/10/leoAngelo-Zanaboni-006-w960-300x139.jpg`,
    href: "/collections#working",
  },
];

function CollectionCard({
  title,
  subtitle,
  image,
  href,
  delay,
}: {
  title: string;
  subtitle: string;
  image: string;
  href: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55 }}
    >
      <Link href={href} className="group block">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4">
            <p className="text-white/70 text-xs tracking-widest uppercase">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <h3
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h3>
          <ChevronRight className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Value card ───────────────────────────────────────────────
const values = [
  {
    icon: Gem,
    title: "เฟอร์นิเจอร์จากอิตาลีแท้",
    desc: "นำเข้าตรงจากอิตาลี เลือกสรรเฉพาะแบรนด์ที่มีประวัติการผลิตยาวนาน ด้วยวัสดุระดับพรีเมียม",
  },
  {
    icon: Shield,
    title: "งานทำมือ (Handmade)",
    desc: "ทุกชิ้นผลิตโดยช่างมืออาชีพดั้งเดิมชาวอิตาลี ไม่มีการผลิตจำนวนมากแบบโรงงาน",
  },
  {
    icon: Clock,
    title: "สไตล์คลาสสิคแท้",
    desc: "ดีไซน์ที่ไม่ตกยุค ผสมผสานความหรูหราระดับยุโรปเข้ากับการใช้งานจริงในชีวิตประจำวัน",
  },
  {
    icon: Truck,
    title: "บริการครบวงจร",
    desc: "ทีมงานมืออาชีพให้คำแนะนำในการเลือกเฟอร์นิเจอร์ที่เหมาะสมกับพื้นที่และรสนิยมของคุณ",
  },
];

function ValueCard({
  icon: Icon,
  title,
  desc,
  delay,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-7 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3
        className="text-xl font-medium mb-3 text-foreground"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
    </motion.div>
  );
}

// ─── Testimonial card ─────────────────────────────────────────
const testimonials = [
  {
    name: "วรรณา ศรีไทย",
    role: "Interior Designer",
    text: "เฟอร์นิเจอร์ของ LeoAngelo มีคุณภาพที่รู้สึกได้ทันทีที่จับต้อง งานทำมือจากอิตาลีแตกต่างจากของที่ผลิตจากโรงงานทั่วไปอย่างชัดเจน",
    stars: 5,
  },
  {
    name: "พิพัฒน์ ชนะชัย",
    role: "เจ้าของบ้าน กรุงเทพฯ",
    text: "ใช้มากกว่า 8 ปีแล้ว ยังสวยงามและแข็งแรงเหมือนวันแรก คุ้มค่าทุกบาทที่จ่ายไป เฟอร์นิเจอร์แบบนี้ส่งต่อให้ลูกหลานได้เลย",
    stars: 5,
  },
  {
    name: "อธิคุณ ศิริชัย",
    role: "สถาปนิก",
    text: "แนะนำ LeoAngelo ให้ลูกค้าทุกโปรเจ็คที่ต้องการสไตล์คลาสสิค ทีมงานให้คำปรึกษาดีมากและช่วยจับคู่เฟอร์นิเจอร์กับพื้นที่ได้อย่างลงตัว",
    stars: 5,
  },
];

function TestimonialCard({
  name,
  role,
  text,
  stars,
  delay,
}: {
  name: string;
  role: string;
  text: string;
  stars: number;
  delay: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.5 }}
      className="rounded-2xl border border-border bg-card p-7 flex flex-col gap-4"
    >
      <div className="flex gap-1">
        {Array.from({ length: stars }).map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-primary text-primary" />
        ))}
      </div>
      <p
        className="text-base italic text-foreground/80 leading-relaxed flex-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        &ldquo;{text}&rdquo;
      </p>
      <div>
        <p className="font-semibold text-sm text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </motion.div>
  );
}

// ─── About section ────────────────────────────────────────────
function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-28 px-6 linen-bg border-y border-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={ref}>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4"
          >
            เกี่ยวกับเรา
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ผู้นำเข้าเฟอร์นิเจอร์{" "}
            <span className="gold-text font-semibold italic">คลาสสิคจากอิตาลี</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-muted-foreground leading-relaxed mb-5"
          >
            กว่า 12 ปี ที่บริษัท ลีโอ แอนเจลโล่ จำกัด ให้บริการจัดหาเฟอร์นิเจอร์สไตล์คลาสสิคแท้
            ที่มีความหรูหราเป็นงานทำมือ (Handmade) คุณภาพสูงจากช่างมืออาชีพดั้งเดิมชาวอิตาลี
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.25, duration: 0.55 }}
            className="text-muted-foreground leading-relaxed mb-8"
          >
            ลูกค้าทุกรายจึงเชื่อมั่นได้ในคุณภาพของเฟอร์นิเจอร์และงานตกแต่ง
            ที่เป็นมืออาชีพอย่างแท้จริง ห้องทุกห้องในบ้านของคุณควรบอกเล่าเรื่องราวของคุณ
            ด้วยเฟอร์นิเจอร์ที่มีคุณค่าและความงามที่ยั่งยืน
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.55 }}
          >
            <Link href="/about">
              <Button
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/5 px-6 tracking-wider"
              >
                เรื่องราวของเรา <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero image from real site */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden"
        >
          <Image
            src={`${BASE}/2014/10/leoAngelo-02_PreeDee020-w960.jpg`}
            alt="LeoAngelo Showroom"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
          {/* Floating stat */}
          <div className="absolute bottom-5 right-5 bg-card/90 backdrop-blur-sm rounded-2xl border border-border p-5 text-center">
            <p
              className="text-3xl font-semibold gold-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              12+
            </p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              ปีแห่งประสบการณ์
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA section ──────────────────────────────────────────────
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section className="py-28 px-6 damask-bg text-white">
      <div ref={ref} className="max-w-3xl mx-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-4"
        >
          เยี่ยมชมโชว์รูม
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-4xl md:text-5xl font-light mb-6 leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          สัมผัสความงามของ{" "}
          <span className="gold-text font-semibold italic">Real Italy Furniture</span>
          <br />
          ด้วยตัวเอง
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="text-white/70 text-base leading-relaxed mb-4 max-w-xl mx-auto"
        >
          ไม่มีหน้าจอใดถ่ายทอดความรู้สึกของงานทำมือที่แท้จริงได้
          มาสัมผัสคุณภาพด้วยตัวเอง ทีมงานพร้อมให้คำปรึกษาทุกวัน
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.25, duration: 0.55 }}
          className="text-primary font-semibold text-lg mb-10"
        >
          โทร 02-561-4209 · จ.–ศ. 10:00–18:00 น.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.55 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base gold-glow tracking-wider"
            >
              ติดต่อเรา <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/collections">
            <Button
              size="lg"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground h-12 text-base px-8 tracking-wider transition-all duration-300 shadow-none"
            >
              ดูคอลเลกชัน
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────
export default function Home() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const collectionsRef = useRef(null);
  const collectionsInView = useInView(collectionsRef, { once: true, margin: "-60px" });
  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-60px" });
  const testimonialsRef = useRef(null);
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-60px" });

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Real LeoAngelo image as hero background */}
        <div className="absolute inset-0">
          <Image
            src={`${BASE}/2014/10/leoAngelo-05_Wiriya-015-w960.jpg`}
            alt="LeoAngelo Classic Furniture"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
        </div>

        {/* Ambient warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white" ref={heroRef}>
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            className="ornament text-xs tracking-[0.3em] uppercase text-primary font-medium mb-8 max-w-xs mx-auto"
          >
            Real Italy Furniture
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            className="text-6xl md:text-8xl font-light tracking-wide mb-4 leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            เฟอร์นิเจอร์
          </motion.h1>
          <motion.h1
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            className="text-5xl md:text-7xl font-semibold italic tracking-wide mb-8 leading-none gold-text"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            คลาสสิคจากอิตาลี
          </motion.h1>

          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            className="text-lg text-white/65 max-w-xl mx-auto mb-12 leading-relaxed"
          >
            งานทำมือ (Handmade) โดยช่างมืออาชีพชาวอิตาลี
            คุณภาพสูงที่ลูกค้าเชื่อมั่นมากว่า 12 ปี
          </motion.p>

          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate={heroInView ? "show" : "hidden"}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/collections">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-13 text-base gold-glow tracking-widest"
                style={{ letterSpacing: "0.1em" }}
              >
                ดูคอลเลกชัน
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground h-13 text-base px-8 transition-all duration-300 shadow-none"
              >
                ติดต่อเรา
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate={heroInView ? "show" : "hidden"}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-white/40 tracking-[0.25em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Featured Collections ──────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div ref={collectionsRef}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={collectionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold uppercase tracking-[0.2em] text-center mb-3"
            >
              คอลเลกชันของเรา
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={collectionsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              เฟอร์นิเจอร์สำหรับ{" "}
              <span className="gold-text font-semibold italic">ทุกห้องในบ้าน</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {collections.map((col, i) => (
              <CollectionCard
                key={col.id}
                title={col.title}
                subtitle={col.subtitle}
                image={col.image}
                href={col.href}
                delay={i * 0.1}
              />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/collections">
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 px-8 tracking-wider"
              >
                ดูคอลเลกชันทั้งหมด <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────── */}
      <AboutSection />

      {/* ── Why Choose Us ─────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={valuesRef}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold uppercase tracking-[0.2em] text-center mb-3"
            >
              ทำไมต้อง LeoAngelo
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              คุณภาพที่{" "}
              <span className="gold-text font-semibold italic">เชื่อมั่นได้</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <ValueCard key={v.title} icon={v.icon} title={v.title} desc={v.desc} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Bedroom Styles highlight ──────────────────────────── */}
      <section className="py-20 px-6 linen-bg border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              Bedroom Styles
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              สไตล์ห้องนอน
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: `${BASE}/2014/12/Bedroom-02.png`,
                style: "Mellifluous Classic",
                desc: "ความหรูหราอ่อนหวาน สง่างามแบบคลาสสิคยุโรป",
              },
              {
                img: `${BASE}/2014/12/Bedroom-03.png`,
                style: "Luxurious Attractively Decorated",
                desc: "ตกแต่งอย่างวิจิตร เต็มเปี่ยมด้วยความหรูหราสมบูรณ์แบบ",
              },
              {
                img: `${BASE}/2014/12/Bedroom-04.png`,
                style: "Contemporary",
                desc: "สไตล์ร่วมสมัย ผสมผสานความคลาสสิคเข้ากับความทันสมัย",
              },
            ].map((s, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-50px" });
              return (
                <motion.div
                  key={s.style}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.1, duration: 0.55 }}
                  className="rounded-2xl overflow-hidden border border-border"
                >
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={s.img}
                      alt={s.style}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-5 bg-card">
                    <h3
                      className="font-semibold text-foreground mb-1"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {s.style}
                    </h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={testimonialsRef}>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold uppercase tracking-[0.2em] text-center mb-3"
            >
              เสียงจากลูกค้า
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-4xl md:text-5xl font-light text-center mb-14 text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              ลูกค้าที่{" "}
              <span className="gold-text font-semibold italic">ไว้วางใจเรา</span>
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t.name}
                name={t.name}
                role={t.role}
                text={t.text}
                stars={t.stars}
                delay={i * 0.12}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <CTASection />
    </main>
  );
}
