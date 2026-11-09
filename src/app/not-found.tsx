import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getT();
  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-surface px-6 py-16 text-center">
      <div className="max-w-md">
        <LogoMark size={56} className="mx-auto" />
        <p dir="ltr" className="mt-8 text-7xl font-extrabold tracking-tight text-navy-900">4<span className="text-flag-red">0</span>4</p>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">{t(bi("الصفحة غير موجودة", "Page not found"))}</h1>
        <p className="mt-2 text-base leading-8 text-muted">{t(bi("ربما تغيّر الرابط أو لم تعد الصفحة متاحة. يمكنك العودة إلى الرئيسية أو تصفح الخدمات.", "The link may have changed or the page is no longer available. Return home or browse the services."))}</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className={buttonClasses("primary", "lg")}>{t(bi("الصفحة الرئيسية", "Go home"))}</Link>
          <Link href="/services" className={buttonClasses("outline", "lg")}>{t(bi("الخدمات", "Services"))}</Link>
        </div>
      </div>
    </main>
  );
}
