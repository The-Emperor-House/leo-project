"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Gem, Hammer, Heart, Leaf } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const BASE = "http://www.leoangelo.co.th/wp-content/uploads";

const milestones = [
  {
    year: "2002",
    title: "ก่อตั้งบริษัท ลีโอ แอนเจลโล่ จำกัด",
    desc: "เริ่มต้นด้วยความมุ่งมั่นนำเข้าเฟอร์นิเจอร์คลาสสิคแท้จากอิตาลีมาสู่ตลาดไทย",
  },
  {
    year: "2005",
    title: "เปิดโชว์รูมแห่งแรก",
    desc: "โชว์รูมแรกในกรุงเทพฯ จัดแสดงเฟอร์นิเจอร์ Handmade จากช่างอิตาลีมืออาชีพ",
  },
  {
    year: "2008",
    title: "ขยายสินค้า Lighting & Ornament",
    desc: "เพิ่มสินค้าโคมไฟและของตกแต่งนำเข้าจากอิตาลี เพื่อบริการครบวงจรสำหรับการตกแต่งบ้าน",
  },
  {
    year: "2012",
    title: "Working Room Collection",
    desc: "เปิดตัวคอลเลกชันห้องทำงานสไตล์คลาสสิค ตอบรับความต้องการ Home Office ระดับสูง",
  },
  {
    year: "ปัจจุบัน",
    title: "กว่า 12 ปีแห่งความเชื่อมั่น",
    desc: "ให้บริการลูกค้าระดับสูงทั้งบ้านพักอาศัยและโรงแรมด้วยเฟอร์นิเจอร์ Handmade คุณภาพสูงจากอิตาลี",
  },
];

const craftValues = [
  {
    icon: Gem,
    title: "นำเข้าจากอิตาลีโดยตรง",
    desc: "คัดสรรจากแบรนด์ผู้ผลิตชั้นนำของอิตาลี ที่มีประวัติการผลิตยาวนานและได้รับการยอมรับในระดับสากล",
  },
  {
    icon: Hammer,
    title: "งานทำมือ (Handmade) แท้",
    desc: "ช่างมืออาชีพดั้งเดิมชาวอิตาลีผลิตทุกชิ้นด้วยมือ ไม่มีการใช้สายการผลิตแบบโรงงาน",
  },
  {
    icon: Heart,
    title: "สไตล์คลาสสิคไม่ตกยุค",
    desc: "ดีไซน์ที่ผ่านการทดสอบของกาลเวลา สวยงามวันนี้และยังคงงดงามอีก 20 ปีข้างหน้า",
  },
  {
    icon: Leaf,
    title: "วัสดุคุณภาพสูง",
    desc: "ไม้แข็งคัดสรร ผ้าและหนังเกรดพรีเมียม งานลงสีและขัดมือเพื่อความสวยงามที่ยั่งยืน",
  },
];

function CraftCard({
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
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.55 }}
      className="flex gap-5"
    >
      <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3
          className="text-lg font-medium mb-2 text-foreground"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </motion.div>
  );
}

export default function AboutPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const storyRef = useRef(null);
  const storyInView = useInView(storyRef, { once: true, margin: "-80px" });
  const craftRef = useRef(null);
  const craftInView = useInView(craftRef, { once: true, margin: "-80px" });

  return (
    <main>
      {/* Hero */}
      <section className="relative py-28 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={`${BASE}/2014/10/leoAngelo-05_Wiriya-004-w960.jpg`}
            alt="LeoAngelo Showroom"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/65" />
        </div>
        <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto text-center text-white">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4"
          >
            เกี่ยวกับเรา
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-5xl md:text-6xl font-light mb-5 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            ผู้นำเข้าเฟอร์นิเจอร์{" "}
            <span className="gold-text font-semibold italic">Real Italy Furniture</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.55 }}
            className="text-white/65 leading-relaxed max-w-xl mx-auto"
          >
            บริษัท ลีโอ แอนเจลโล่ จำกัด ผู้นำเข้าเฟอร์นิเจอร์สไตล์คลาสสิคแท้จากอิตาลี
            งานทำมือคุณภาพสูงที่คุณเชื่อมั่นได้
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 px-6">
        <div
          ref={storyRef}
          className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="relative aspect-[3/4] rounded-2xl overflow-hidden"
          >
            <Image
              src={`${BASE}/2014/10/leoAngelo-02_PreeDee003-w960.jpg`}
              alt="LeoAngelo Classic Furniture"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p
                className="text-xl italic font-light leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                &ldquo;ห้องหับภายในบ้านเป็นสถานที่ซึ่งบอกเล่าความเป็นตัวตนของคุณ&rdquo;
              </p>
              <p className="text-sm mt-2 text-white/70">— LeoAngelo, Founder</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={storyInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4">
              เรื่องราวของเรา
            </p>
            <h2
              className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              กว่า 12 ปีแห่ง{" "}
              <span className="gold-text font-semibold italic">ความเชื่อมั่น</span>
            </h2>
            <div className="w-10 h-0.5 bg-primary/50 rounded mb-6" />
            <p className="text-muted-foreground leading-relaxed mb-5">
              บริษัท ลีโอ แอนเจลโล่ จำกัด ผู้นำเข้าเฟอร์นิเจอร์จากอิตาลี
              ให้บริการจัดหาเฟอร์นิเจอร์สไตล์คลาสสิคแท้ ที่มีความหรูหราเป็นงานทำมือ (Handmade)
              คุณภาพสูงจากช่างมืออาชีพดั้งเดิมชาวอิตาลี
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              ลูกค้าทุกรายจึงเชื่อมั่นได้ในคุณภาพของเฟอร์นิเจอร์และงานตกแต่ง
              ที่เป็นมืออาชีพอย่างแท้จริง เราเชื่อว่าเฟอร์นิเจอร์ที่ดีช่วยเล่าเรื่องราวของคุณ
              และสร้างความทรงจำที่ดีร่วมกับคนที่รัก
            </p>
            <p className="text-muted-foreground leading-relaxed">
              ทีมงานผู้เชี่ยวชาญของเราพร้อมให้คำแนะนำในการเลือกเฟอร์นิเจอร์ที่เหมาะสม
              ทั้งสอดคล้องกับการตกแต่งแต่ละห้องของบ้านที่คุณรัก
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-6 linen-bg border-y border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">
              เส้นทางของเรา
            </p>
            <h2
              className="text-4xl md:text-5xl font-light text-foreground"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              กว่า 12 ปี{" "}
              <span className="gold-text font-semibold italic">หนึ่งพันธสัญญา</span>
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
            <div className="space-y-10">
              {milestones.map((m, i) => {
                const ref = useRef(null);
                const inView = useInView(ref, { once: true, margin: "-40px" });
                return (
                  <motion.div
                    key={m.year}
                    ref={ref}
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: i * 0.08, duration: 0.55 }}
                    className="relative pl-16"
                  >
                    <div className="absolute left-0 w-12 h-12 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center">
                      <span
                        className="text-[10px] font-bold text-primary text-center leading-tight px-1"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {m.year}
                      </span>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-6">
                      <h3
                        className="text-xl font-medium text-foreground mb-2"
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {m.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{m.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Craftsmanship Values */}
      <section id="craftsmanship" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div ref={craftRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={craftInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-4"
              >
                มาตรฐานของเรา
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={craftInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="text-4xl md:text-5xl font-light mb-6 leading-tight text-foreground"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                คุณภาพที่{" "}
                <span className="gold-text font-semibold italic">ไม่มีการประนีประนอม</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={craftInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="text-muted-foreground leading-relaxed"
              >
                เราเชื่อว่าเฟอร์นิเจอร์ที่แท้จริงไม่ได้แค่ตกแต่งบ้าน
                แต่สร้างคุณค่าที่ส่งต่อให้คนรุ่นต่อไปได้
              </motion.p>
            </div>

            <div className="flex flex-col gap-8">
              {craftValues.map((cv, i) => (
                <CraftCard key={cv.title} icon={cv.icon} title={cv.title} desc={cv.desc} delay={i * 0.1} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-secondary/40 border-t border-border">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-4xl font-light mb-4 text-foreground"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            พร้อมสร้างบ้านในฝันของคุณหรือยัง?
          </h2>
          <p className="text-muted-foreground mb-3 leading-relaxed">
            มาเยี่ยมชมโชว์รูมและให้ทีมงานของเราช่วยคุณเลือกเฟอร์นิเจอร์ที่เหมาะสมที่สุด
          </p>
          <p className="text-primary font-semibold mb-8">
            โทร 02-561-4209 · จ.–ศ. 10:00–18:00 น.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 gold-glow tracking-wider"
              >
                ติดต่อเรา <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/collections">
              <Button
                size="lg"
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/5 px-8"
              >
                ดูคอลเลกชัน
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
