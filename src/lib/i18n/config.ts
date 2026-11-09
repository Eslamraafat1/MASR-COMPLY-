export const LOCALES = ["ar", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ar";
export const LOCALE_COOKIE = "masr-locale";

export type Bi = { ar: string; en: string };
export const bi = (ar: string, en: string): Bi => ({ ar, en });

export const dirOf = (l: Locale): "rtl" | "ltr" => (l === "ar" ? "rtl" : "ltr");
export const isLocale = (v: unknown): v is Locale => v === "ar" || v === "en";

/** Pick the string for a locale from a bilingual pair. */
export const pick = (v: Bi, l: Locale): string => v[l];
