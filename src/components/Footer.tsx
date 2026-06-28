"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");

  const collections = [
    { label: "Dining Room", href: "/collections#dining" },
    { label: "Living Room", href: "/collections#living" },
    { label: "Bedroom", href: "/collections#bedroom" },
    { label: "Working Room", href: "/collections#working" },
  ];

  const company = [
    { label: "About Us", href: "/about" },
    { label: t("craftsmanship"), href: "/about#craftsmanship" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <footer className="border-t border-border bg-card/40 px-6 pt-16 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <Image src="/logo.jpg" alt="LeoAngelo" width={32} height={32} className="rounded-lg object-cover" />
              <span className="text-xl font-semibold tracking-wider gold-text font-display">LeoAngelo</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-xs">{t("desc")}</p>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 shrink-0 text-primary" />
                <a href="tel:025614209" className="hover:text-foreground transition-colors">02-561-4209</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary" />
                <span>Mon–Fri 10:00–18:00</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 shrink-0 text-primary" />
                <a href="mailto:hello@leoangelo.co.th" className="hover:text-foreground transition-colors">hello@leoangelo.co.th</a>
              </li>
            </ul>
            <div className="flex gap-3 mt-5">
              <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] mb-5 text-foreground">{t("collections")}</h4>
            <ul className="space-y-3">
              {collections.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] mb-5 text-foreground">{t("company")}</h4>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-4 rounded-xl bg-secondary/60 border border-border">
              <p className="text-xs text-muted-foreground italic leading-relaxed font-display">
                &ldquo;{t("quote")}&rdquo;
              </p>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>{t("copyright")}</p>
          <p className="tracking-wider">{t("crafted")}</p>
        </div>
      </div>
    </footer>
  );
}
