"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { LOCALE_COOKIE, dirOf, type Bi, type Locale } from "./config";

type Ctx = {
  locale: Locale;
  dir: "rtl" | "ltr";
  isRtl: boolean;
  /** Pick the string for the active locale. */
  t: (v: Bi) => string;
  setLocale: (l: Locale) => void;
};

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const router = useRouter();

  const setLocale = useCallback(
    (l: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${l}; path=/; max-age=31536000; samesite=lax`;
      try {
        localStorage.setItem(LOCALE_COOKIE, l);
      } catch {
        /* storage may be unavailable */
      }
      // Re-render server components with the new cookie, then flip document direction immediately.
      document.documentElement.lang = l;
      document.documentElement.dir = dirOf(l);
      router.refresh();
    },
    [router],
  );

  const value = useMemo<Ctx>(
    () => ({
      locale,
      dir: dirOf(locale),
      isRtl: locale === "ar",
      t: (v) => v[locale],
      setLocale,
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}
