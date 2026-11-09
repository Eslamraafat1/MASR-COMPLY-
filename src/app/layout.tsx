import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import type { ReactNode } from "react";
import { MotionProvider } from "@/components/ui/Motion";
import { dirOf } from "@/lib/i18n/config";
import { I18nProvider } from "@/lib/i18n/provider";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ar",
  display: "swap",
});
const latin = Inter({ subsets: ["latin"], variable: "--font-en", display: "swap" });

export const metadata: Metadata = {
  title: { default: "MASR COMPLY — منصة مصر للمطابقة وسلامة المنتجات", template: "%s | MASR COMPLY" },
  description:
    "نموذج أولي مستقل لمنصة رقمية موحدة لتسجيل المنتجات ومتابعة إجراءات المطابقة والوثائق. An independent prototype of a unified product compliance platform for Egypt.",
  applicationName: "MASR COMPLY",
  robots: { index: false, follow: false },
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = { themeColor: "#101D32", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const skip = locale === "ar" ? "تخطَّ إلى المحتوى" : "Skip to content";
  return (
    <html lang={locale} dir={dirOf(locale)} className={`${arabic.variable} ${latin.variable}`}>
      <body>
        <I18nProvider locale={locale}>
          <MotionProvider>
            <a href="#main" className="sr-only z-[100] rounded-lg bg-white px-4 py-2 font-semibold text-navy-900 shadow-pop focus:not-sr-only focus:fixed focus:start-4 focus:top-4">
              {skip}
            </a>
            {children}
          </MotionProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
