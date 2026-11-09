import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Bi, type Locale } from "./config";

/** Convenience for server components: locale + a bound translator. */
export async function getT() {
  const l = await getLocale();
  return { l, t: (v: Bi) => v[l] };
}

/** Locale is stored in a cookie so server components render the right language/direction on first paint. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get(LOCALE_COOKIE)?.value;
  return isLocale(v) ? v : DEFAULT_LOCALE;
}
