"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("contact");
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) setSubmitted(true);
    } catch {
      setSubmitted(true);
    }
  }

  const contactInfo = [
    { icon: Phone, label: t("phone_label"), value: "02-561-4209", href: "tel:025614209" },
    { icon: Clock, label: t("hours_label"), value: t("hours_value") },
    { icon: Mail, label: t("email_label"), value: "hello@leoangelo.co.th", href: "mailto:hello@leoangelo.co.th" },
    { icon: MapPin, label: t("map_label"), value: "www.leoangelo.co.th", href: "http://www.leoangelo.co.th" },
  ];

  return (
    <main>
      {/* Hero */}
      <section className="py-20 px-6 linen-bg border-b border-border">
        <div ref={heroRef} className="max-w-2xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-primary text-xs font-semibold uppercase tracking-[0.25em] mb-4">
            {t("label")}
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.1, duration: 0.6 }} className="text-5xl md:text-6xl font-light mb-5 leading-tight text-foreground">
            {t("heading")}{" "}
            <span className="gold-text font-semibold italic">{t("heading2")}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={heroInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.2, duration: 0.55 }} className="text-muted-foreground leading-relaxed">
            {t("sub")}
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 px-6">
        <div ref={formRef} className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-14">
          {/* Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={formInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.7 }} className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-light mb-2 text-foreground">{t("info_heading")}</h2>
              <div className="w-8 h-0.5 bg-primary/50 rounded mb-5" />
              <p className="text-sm text-muted-foreground leading-relaxed">{t("info_desc")}</p>
            </div>
            <div className="flex flex-col gap-5 mt-2">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-foreground hover:text-primary transition-colors">{item.value}</a>
                    ) : (
                      <p className="text-sm text-foreground">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border border-border bg-secondary/40 h-52 flex items-center justify-center mt-2">
              <div className="text-center">
                <MapPin className="w-8 h-8 text-primary/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">{t("map_city")}</p>
                <a href="http://www.leoangelo.co.th" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-1 block">www.leoangelo.co.th →</a>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={formInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.15, duration: 0.7 }} className="lg:col-span-3">
            <div className="rounded-2xl border border-border bg-card p-8">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-primary mb-5" />
                  <h3 className="text-3xl font-light mb-3 text-foreground">{t("success_heading")}</h3>
                  <p className="text-muted-foreground leading-relaxed max-w-sm">{t("success_desc")}</p>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-light mb-1 text-foreground">{t("form_heading")}</h3>
                  <p className="text-sm text-muted-foreground mb-7">{t("form_sub")}</p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("name_label")} *</label>
                        <input name="name" value={form.name} onChange={handleChange} required placeholder={t("name_ph")} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("email_field_label")} *</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="you@example.com" className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("phone_field_label")}</label>
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder={t("phone_ph")} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("interest_label")}</label>
                      <select name="interest" value={form.interest} onChange={handleChange} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors">
                        <option value="">{t("interest_default")}</option>
                        <option value="living">{t("interest_living")}</option>
                        <option value="dining">{t("interest_dining")}</option>
                        <option value="bedroom">{t("interest_bedroom")}</option>
                        <option value="working">{t("interest_working")}</option>
                        <option value="lighting">{t("interest_lighting")}</option>
                        <option value="ornament">{t("interest_ornament")}</option>
                        <option value="custom">{t("interest_custom")}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">{t("message_label")} *</label>
                      <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder={t("message_ph")} className="w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-colors resize-none" />
                    </div>
                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground w-full h-12 tracking-wider gold-glow">
                      {t("submit")} <Send className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
