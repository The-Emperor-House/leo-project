"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { useTransition } from "react";

const locales = [
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "th", flag: "🇹🇭", label: "TH" },
];

export default function LangSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  function switchLocale(next: string) {
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-1">
      {locales.map((l, i) => (
        <span key={l.code} className="flex items-center gap-1">
          {i > 0 && <span className="text-border text-xs">|</span>}
          <button
            onClick={() => switchLocale(l.code)}
            className={`flex items-center gap-0.5 text-xs px-1 py-0.5 rounded transition-colors ${
              locale === l.code
                ? "text-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        </span>
      ))}
    </div>
  );
}
