"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

const categories = [
  {
    id: "living",
    label: "Living Room",
    labelTh: "ห้องนั่งเล่น",
    headline: "ความหรูหราที่ได้สัมผัสทุกวัน",
    desc: "โซฟาและเฟอร์นิเจอร์ห้องนั่งเล่นสไตล์คลาสสิคแท้จากอิตาลี โครงไม้แข็งแรงหุ้มผ้าและหนังคุณภาพสูง ออกแบบให้ทั้งสวยงามและสะดวกสบายในการใช้ชีวิตจริง",
    image: `${BASE}/2014/12/Portfolio-LivingRoom.jpg`,
    items: ["โซฟาและชุดรับแขก", "เก้าอี้นวมและอาร์มแชร์", "โต๊ะกลางและโต๊ะข้าง", "ชั้นวางหนังสือและตู้โชว์"],
    reversed: false,
  },
  {
    id: "dining",
    label: "Dining Room",
    labelTh: "ห้องรับประทานอาหาร",
    headline: "โต๊ะอาหารที่สร้างความทรงจำ",
    desc: "โต๊ะและเก้าอี้รับประทานอาหารแบบ Handmade จากช่างอิตาลี ไม้แข็งแท้ขาโต๊ะแกะสลักด้วยมือ มีทั้งแบบขยายได้และขนาดประจำ เหมาะทั้งบ้านทั่วไปและบ้านขนาดใหญ่",
    image: `${BASE}/2014/12/Portfolio-Dining.jpg`,
    items: ["โต๊ะรับประทานอาหาร", "เก้าอี้รับประทานอาหาร", "ตู้บุฟเฟต์และซิดบอร์ด", "ตู้โชว์ภาชนะ"],
    reversed: true,
  },
  {
    id: "bedroom",
    label: "Bedroom",
    labelTh: "ห้องนอน",
    headline: "พักผ่อนในบรรยากาศที่ไม่มีวันเสื่อม",
    desc: "เตียงและเฟอร์นิเจอร์ห้องนอนสไตล์คลาสสิคยุโรป หัวเตียงแกะสลักอย่างวิจิตร มีสามสไตล์ให้เลือก ตั้งแต่ Mellifluous Classic, Luxurious Decorated ไปจนถึง Contemporary",
    image: `${BASE}/2014/12/Bedroom-01.png`,
    items: ["เตียงและหัวเตียง", "ตู้ข้างเตียง", "ตู้เสื้อผ้า", "โต๊ะเครื่องแป้ง"],
    reversed: false,
  },
  {
    id: "working",
    label: "Working Room",
    labelTh: "ห้องทำงาน",
    headline: "พื้นที่ทำงานที่สร้างแรงบันดาลใจ",
    desc: "โต๊ะทำงานและเก้าอี้สไตล์คลาสสิคที่เหมาะกับ Home Office ระดับสูง งานแกะสลักละเอียดจากช่างอิตาลี ผสมผสานความสง่างามแบบยุโรปกับการใช้งานจริง",
    image: `${BASE}/2014/10/leoAngelo-Zanaboni-006-w960-300x139.jpg`,
    items: ["โต๊ะทำงาน", "เก้าอี้ผู้บริหาร", "ชั้นวางหนังสือ", "ตู้เก็บเอกสาร"],
    reversed: true,
  },
];

function CategorySection({
  id,
  label,
  labelTh,
  headline,
  desc,
  image,
  items,
  reversed,
}: (typeof categories)[0]) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id={id} className="py-24 px-6 border-b border-border last:border-0">
      <div
        ref={ref}
        className={`max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${
          reversed ? "lg:grid-flow-dense" : ""
        }`}
      >
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? 30 : -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7 }}
          className={`relative aspect-[4/3] rounded-2xl overflow-hidden ${reversed ? "lg:col-start-2" : ""}`}
        >
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent" />
          <div className="absolute top-5 left-5">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs tracking-widest uppercase px-4 py-2 rounded-full border border-border/60">
              {label}
            </span>
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, x: reversed ? -30 : 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.15, duration: 0.7 }}
          className={reversed ? "lg:col-start-1 lg:row-start-1" : ""}
        >
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-1">
            {label}
          </p>
          <p className="text-muted-foreground text-sm mb-4">{labelTh}</p>
          <h2
            className="text-4xl md:text-5xl font-light mb-5 leading-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
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
              สอบถามข้อมูล <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default function CollectionsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const lightingRef = useRef(null);
  const lightingInView = useInView(lightingRef, { once: true, margin: "-60px" });

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6 linen-bg border-b border-border">
        <div ref={heroRef} className="max-w-3xl mx-auto text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          >
            คอลเลกชันของเรา
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-light mb-5 leading-tight text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            เฟอร์นิเจอร์{" "}
            <span className="gold-text font-semibold italic">Handmade จากอิตาลี</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-muted-foreground leading-relaxed max-w-xl mx-auto"
          >
            ทุกชิ้นผลิตโดยช่างมืออาชีพดั้งเดิมชาวอิตาลี เลือกสรรสไตล์คลาสสิคแท้
            เพื่อสร้างบ้านที่สวยงามและมีคุณค่าอย่างยั่งยืน
          </motion.p>
        </div>
      </section>

      {/* Furniture categories */}
      {categories.map((cat) => (
        <CategorySection key={cat.id} {...cat} />
      ))}

      {/* Lighting & Ornament */}
      <section className="py-24 px-6 linen-bg border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div ref={lightingRef} className="text-center mb-14">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={lightingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3"
            >
              สินค้าเพิ่มเติม
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={lightingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.08, duration: 0.6 }}
              className="text-4xl md:text-5xl font-light text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Lighting &{" "}
              <span className="gold-text font-semibold italic">Ornament</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Lighting",
                titleTh: "โคมไฟ",
                desc: "โคมไฟและหลอดไฟช่วยให้บ้านที่คุณรักเป็นสถานที่พิเศษ มีความอบอุ่นและสว่างไสวในยามค่ำคืน นำเข้าจากอิตาลีโดยตรง เพื่อกิจกรรมทุกอย่างที่คุณรัก",
                bg: "bg-accent/10",
              },
              {
                title: "Ornament",
                titleTh: "ของตกแต่ง",
                desc: "ดูผลงานเฟอร์นิเจอร์และการตกแต่งของเรา เพื่อสร้างสรรค์บ้านที่แสนสวยและเพียบพร้อมด้วยรสนิยมของคุณ ด้วยทีมงานมืออาชีพที่แนะนำการเลือกเฟอร์นิเจอร์อันงดงามและทรงคุณค่า",
                bg: "bg-primary/5",
              },
            ].map((item, i) => {
              const ref = useRef(null);
              const inView = useInView(ref, { once: true, margin: "-50px" });
              return (
                <motion.div
                  key={item.title}
                  ref={ref}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: i * 0.15, duration: 0.55 }}
                  className={`rounded-2xl border border-border p-10 ${item.bg}`}
                >
                  <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
                    {item.title}
                  </p>
                  <h3
                    className="text-3xl font-light text-foreground mb-4"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    {item.titleTh}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">{item.desc}</p>
                  <Link href="/contact">
                    <Button
                      variant="outline"
                      className="border-primary/30 text-primary hover:bg-primary/5"
                    >
                      สอบถามข้อมูล <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 damask-bg text-white border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-4xl font-light mb-4"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ต้องการเฟอร์นิเจอร์แบบ Custom?
          </h2>
          <p className="text-white/65 mb-3 leading-relaxed">
            เราพร้อมให้คำปรึกษาและจัดหาเฟอร์นิเจอร์ที่เหมาะกับพื้นที่และรสนิยมของคุณโดยเฉพาะ
          </p>
          <p className="text-primary font-semibold mb-8">
            โทร 02-561-4209 · จ.–ศ. 10:00–18:00 น.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 gold-glow tracking-wider"
            >
              ติดต่อเรา <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
