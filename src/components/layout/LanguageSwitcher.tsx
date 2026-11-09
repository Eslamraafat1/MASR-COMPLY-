"use client";

import { Languages } from "lucide-react";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const { locale, setLocale } = useI18n();
  const next = locale === "ar" ? "en" : "ar";
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      lang={next}
      aria-label={next === "en" ? "Switch language to English" : "تغيير اللغة إلى العربية"}
      className={cn(
        "inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors",
        tone === "dark" ? "text-navy-900 hover:bg-navy-50" : "text-white hover:bg-white/10",
        className,
      )}
    >
      <Languages size={17} aria-hidden="true" />
      {next === "en" ? "English" : "العربية"}
    </button>
  );
}
