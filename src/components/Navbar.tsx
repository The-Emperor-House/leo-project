"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, LogIn, LayoutDashboard } from "lucide-react";
import { Link } from "@/navigation";
import Image from "next/image";
import LangSwitcher from "./LangSwitcher";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const t = useTranslations("nav");

  const links = [
    { label: t("collections"), href: "/collections" },
    { label: t("about"), href: "/about" },
    { label: t("contact"), href: "/contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Top announcement bar ──────────────────────────────── */}
      <div className="w-full bg-accent text-accent-foreground text-xs py-2 px-6 flex items-center justify-center gap-4 z-50 relative">
        <Phone className="w-3 h-3 shrink-0" />
        <span className="tracking-wider">
          {t("bar_phone")}&nbsp;
          <a href="tel:025614209" className="font-semibold hover:underline">
            02-561-4209
          </a>
          &nbsp;·&nbsp;{t("bar_hours")}
        </span>
        <span className="hidden sm:inline text-accent-foreground/60">|</span>
        <span className="hidden sm:inline tracking-wider">{t("bar_tag")}</span>
      </div>

      {/* ── Main Navbar ───────────────────────────────────────── */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-card/92 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-card/80 backdrop-blur-md border-b border-border/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border/60 shrink-0 shadow-sm">
              <Image src="/logo.jpg" alt="LeoAngelo" fill className="object-cover" sizes="40px" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-lg font-bold tracking-wide gold-text" style={{ fontFamily: "var(--font-heading)" }}>
                LeoAngelo
              </span>
              <span className="text-[9px] tracking-[0.22em] text-muted-foreground uppercase font-normal mt-0.5">
                Real Italy Furniture
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-9">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                style={{ letterSpacing: "0.12em", fontFamily: "var(--font-body)" }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <LangSwitcher />
            {session ? (
              <a href="/admin" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" />
                {t("admin")}
              </a>
            ) : (
              <a href="/login" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5">
                <LogIn className="w-3.5 h-3.5" />
                {t("login")}
              </a>
            )}
            <Link href="/contact">
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 tracking-wider gold-glow text-xs" style={{ letterSpacing: "0.08em" }}>
                {t("visit_showroom")}
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-foreground" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-card/97 backdrop-blur-xl border-b border-border px-6 pb-6"
            >
              <nav className="flex flex-col gap-5 pt-4">
                {links.map((link) => (
                  <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-foreground transition-colors tracking-widest uppercase text-sm" onClick={() => setMenuOpen(false)}>
                    {link.label}
                  </Link>
                ))}
                <div className="pt-2 border-t border-border space-y-3">
                  <div className="flex justify-center py-1"><LangSwitcher /></div>
                  <Link href="/contact" onClick={() => setMenuOpen(false)}>
                    <Button className="bg-primary hover:bg-primary/90 w-full tracking-wider">{t("visit_showroom")}</Button>
                  </Link>
                  <a href="tel:025614209" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Phone className="w-3.5 h-3.5" /> 02-561-4209
                  </a>
                  {session ? (
                    <a href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <LayoutDashboard className="w-3.5 h-3.5" /> {t("admin")}
                    </a>
                  ) : (
                    <a href="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      <LogIn className="w-3.5 h-3.5" /> {t("login")}
                    </a>
                  )}
                </div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
