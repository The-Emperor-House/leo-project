import { getTranslations } from "next-intl/server";
import { Link } from "@/navigation";

const SECTIONS_EN = [
  {
    title: "1. Data We Collect",
    body: "When you submit an inquiry through our contact form, we collect the following personal data:",
    items: ["Full name", "Email address", "Phone number (optional)", "Product category of interest (optional)", "Your message"],
  },
  {
    title: "2. Purpose of Collection",
    body: "We collect this information solely to:",
    items: [
      "Respond to your inquiry and provide product information",
      "Prepare quotations based on your requirements",
      "Follow up on your interest in our furniture",
    ],
    footer: "We do not use your personal data for marketing or advertising without your separate, explicit consent.",
  },
  {
    title: "3. Retention Period",
    body: "We retain your personal data for as long as necessary to fulfill the purposes stated above, or as required by law. You may request deletion of your data at any time — we will action verified requests within 30 days.",
  },
  {
    title: "4. Disclosure of Data",
    body: "We do not sell your personal data. We may share it only with:",
    items: [
      "Technology service providers who help us operate this website (under data processing agreements)",
      "Government authorities when required by law",
    ],
  },
  {
    title: "5. Your Rights Under PDPA",
    body: "Under Thailand's Personal Data Protection Act B.E. 2562, you have the right to:",
    items: [
      "Access your personal data held by us",
      "Request correction of inaccurate or incomplete data",
      "Request deletion or destruction of your data",
      "Withdraw your consent at any time (without affecting prior processing)",
      "Request restriction of processing",
      "File a complaint with the Personal Data Protection Committee (PDPC)",
    ],
  },
  {
    title: "6. Contact Us",
    body: "To exercise your rights, request data deletion, or for any privacy-related questions, please contact:",
    contact: {
      email: "hello@leoangelo.co.th",
      phone: "02-561-4209 (Mon–Fri 10:00–18:00)",
      address: "Leo Angelo Co., Ltd., Bangkok, Thailand",
    },
  },
];

const SECTIONS_TH = [
  {
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    body: "เมื่อท่านส่งแบบฟอร์มติดต่อผ่านเว็บไซต์ บริษัทฯ จะเก็บรวบรวมข้อมูลส่วนบุคคลดังต่อไปนี้:",
    items: ["ชื่อ-นามสกุล", "ที่อยู่อีเมล", "เบอร์โทรศัพท์ (ไม่บังคับ)", "ประเภทสินค้าที่สนใจ (ไม่บังคับ)", "ข้อความของท่าน"],
  },
  {
    title: "2. วัตถุประสงค์ของการเก็บรวบรวม",
    body: "บริษัทฯ เก็บรวบรวมข้อมูลดังกล่าวเพื่อวัตถุประสงค์ดังต่อไปนี้เท่านั้น:",
    items: [
      "ตอบกลับคำถามและให้ข้อมูลสินค้า",
      "จัดทำใบเสนอราคาตามความต้องการของท่าน",
      "ติดตามความสนใจของท่านในสินค้าของบริษัทฯ",
    ],
    footer: "บริษัทฯ จะไม่นำข้อมูลส่วนบุคคลไปใช้เพื่อการตลาดหรือโฆษณาโดยไม่ได้รับความยินยอมจากท่านอย่างชัดแจ้งเป็นการแยกต่างหาก",
  },
  {
    title: "3. ระยะเวลาการเก็บรักษาข้อมูล",
    body: "บริษัทฯ จะเก็บรักษาข้อมูลส่วนบุคคลของท่านตราบเท่าที่จำเป็นต่อวัตถุประสงค์ข้างต้น หรือตามที่กฎหมายกำหนด ท่านสามารถขอลบข้อมูลได้ตลอดเวลา และบริษัทฯ จะดำเนินการภายใน 30 วันหลังได้รับคำขอที่ผ่านการยืนยัน",
  },
  {
    title: "4. การเปิดเผยข้อมูล",
    body: "บริษัทฯ ไม่ขายข้อมูลส่วนบุคคลของท่าน และจะเปิดเผยเฉพาะในกรณีต่อไปนี้:",
    items: [
      "ผู้ให้บริการด้านเทคโนโลยีที่ช่วยดำเนินการเว็บไซต์ (ภายใต้ข้อตกลงประมวลผลข้อมูล)",
      "หน่วยงานราชการเมื่อกฎหมายกำหนด",
    ],
  },
  {
    title: "5. สิทธิของท่านตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562",
    body: "ภายใต้กฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) ท่านมีสิทธิดังต่อไปนี้:",
    items: [
      "เข้าถึงข้อมูลส่วนบุคคลที่บริษัทฯ ถือครอง",
      "ขอให้แก้ไขข้อมูลที่ไม่ถูกต้องหรือไม่ครบถ้วน",
      "ขอให้ลบหรือทำลายข้อมูลส่วนบุคคล",
      "ถอนความยินยอมเมื่อใดก็ได้ (โดยไม่กระทบการประมวลผลที่ผ่านมา)",
      "ขอจำกัดการประมวลผลข้อมูล",
      "ยื่นเรื่องร้องเรียนต่อสำนักงานคณะกรรมการคุ้มครองข้อมูลส่วนบุคคล (PDPC)",
    ],
  },
  {
    title: "6. ติดต่อเรา",
    body: "หากท่านต้องการใช้สิทธิ ขอลบข้อมูล หรือมีคำถามเกี่ยวกับนโยบายนี้ กรุณาติดต่อ:",
    contact: {
      email: "hello@leoangelo.co.th",
      phone: "02-561-4209 (จ.–ศ. 10:00–18:00 น.)",
      address: "บริษัท ลีโอ แอนเจลโล่ จำกัด กรุงเทพมหานคร ประเทศไทย",
    },
  },
];

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("privacy");
  const sections = locale === "th" ? SECTIONS_TH : SECTIONS_EN;

  return (
    <main className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.2em] mb-3">Legal</p>
          <h1 className="text-4xl font-light mb-2 font-display">{t("title")}</h1>
          <p className="text-sm text-muted-foreground">{t("updated")}</p>
        </div>

        <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed mb-10">
          {locale === "th" ? (
            <p>
              บริษัท ลีโอ แอนเจลโล่ จำกัด (&ldquo;บริษัทฯ&rdquo;) ดำเนินการเว็บไซต์{" "}
              <span className="text-foreground font-medium">leoangelo.co.th</span>{" "}
              นโยบายนี้อธิบายการเก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคลของท่าน ตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
            </p>
          ) : (
            <p>
              Leo Angelo Co., Ltd. (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) operates{" "}
              <span className="text-foreground font-medium">leoangelo.co.th</span>.
              This policy explains how we collect, use, and disclose personal data in accordance with Thailand&apos;s
              Personal Data Protection Act B.E. 2562 (PDPA).
            </p>
          )}
        </div>

        <div className="space-y-8">
          {sections.map((s) => (
            <section key={s.title} className="rounded-xl border border-border bg-card/50 p-6">
              <h2 className="text-base font-semibold mb-3">{s.title}</h2>
              {s.body && <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.body}</p>}
              {"items" in s && s.items && (
                <ul className="space-y-1.5 mb-3">
                  {s.items.map((item) => (
                    <li key={item} className="text-sm text-muted-foreground flex gap-2">
                      <span className="text-primary mt-1 shrink-0">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              {"footer" in s && s.footer && (
                <p className="text-sm text-muted-foreground leading-relaxed italic border-t border-border pt-3 mt-3">{s.footer}</p>
              )}
              {"contact" in s && s.contact && (
                <div className="space-y-2 mt-1">
                  <p className="text-sm flex gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">{locale === "th" ? "อีเมล" : "Email"}</span>
                    <a href={`mailto:${s.contact.email}`} className="text-primary hover:underline">{s.contact.email}</a>
                  </p>
                  <p className="text-sm flex gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">{locale === "th" ? "โทร" : "Tel"}</span>
                    <a href="tel:025614209" className="hover:text-primary transition-colors">{s.contact.phone}</a>
                  </p>
                  <p className="text-sm flex gap-2">
                    <span className="text-muted-foreground w-16 shrink-0">{locale === "th" ? "ที่อยู่" : "Address"}</span>
                    <span className="text-muted-foreground">{s.contact.address}</span>
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-border text-center">
          <Link href="/contact" className="text-sm text-primary hover:underline">
            {locale === "th" ? "← กลับไปหน้าติดต่อเรา" : "← Back to Contact"}
          </Link>
        </div>
      </div>
    </main>
  );
}
