import { Headset, Mail, MessageSquareWarning, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";
import { FlagMark } from "./TrustBar";

/** Footer follows the reference portal: contact columns → link row → copyright/legal → provenance row. */
export async function Footer() {
  const { t } = await getT();
  const link = "transition-colors hover:text-white";
  const cols = [
    { icon: Phone, title: bi("رقم الهاتف", "Phone"), value: t(bi("قريباً (رقم تجريبي غير مفعّل)", "Coming soon (demo, not active)")), ltr: false },
    { icon: Headset, title: bi("للخدمات التقنية", "Technical services"), value: "ecare@masrcomply.example", ltr: true },
    { icon: MessageSquareWarning, title: bi("للشكاوى والمقترحات", "Complaints & suggestions"), value: "feedback@masrcomply.example", ltr: true },
    { icon: Mail, title: bi("البريد العام", "General email"), value: "support@masrcomply.example", ltr: true },
  ];
  return (
    <footer className="pattern-lattice relative mt-auto bg-navy-950 text-white">
      <div className="flag-rule" aria-hidden="true" />
      <div className="container-x py-12">
        <div className="grid gap-8 border-b border-white/10 pb-10 sm:grid-cols-2 lg:grid-cols-4">
          {cols.map((c, i) => (
            <div key={i} className="flex items-start gap-3.5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-flag-red text-white">
                <c.icon size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold">{t(c.title)}</p>
                <p dir={c.ltr ? "ltr" : undefined} className="mt-1 break-words text-start text-sm text-white/65">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-8 py-10 lg:grid-cols-[1.3fr_1fr]">
          <div className="max-w-md">
            <Logo tone="light" subtitle={t(bi("مصر للمطابقة وسلامة المنتجات", "Product compliance & safety"))} />
            <p className="mt-4 text-sm leading-7 text-white/60">
              {t(bi("نموذج أولي مستقل لمنصة رقمية موحدة. غير تابع لأي وزارة أو جهة تنظيمية، ولا يُصدر موافقات أو شهادات ذات حجية قانونية.", "An independent prototype of a unified digital platform. Not affiliated with any ministry or regulator, and does not issue legally valid approvals or certificates."))}
            </p>
          </div>
          <nav aria-label={t(bi("روابط الفوتر", "Footer links"))}>
            <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/70 lg:justify-end">
              {[
                ["/faq", bi("الأسئلة الشائعة", "FAQ")],
                ["/sitemap", bi("خريطة الموقع", "Site map")],
                ["/contact", bi("تواصل معنا", "Contact us")],
                ["/help", bi("مركز المساعدة", "Help center")],
                ["/track", bi("متابعة طلب", "Track a request")],
              ].map(([href, label]) => (
                <li key={href as string}><Link href={href as string} className={link}>{t(label as ReturnType<typeof bi>)}</Link></li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2.5">
            <FlagMark />
            <span>
              MASR COMPLY (V <span className="ltr-num">0.1.0</span>) <span className="ltr-num">2026</span> — {t(bi("نموذج أولي، جميع الحقوق محفوظة", "prototype, all rights reserved"))}
            </span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/terms" className={link}>{t(bi("الشروط والأحكام", "Terms & conditions"))}</Link></li>
            <li><Link href="/privacy" className={link}>{t(bi("سياسة الخصوصية", "Privacy policy"))}</Link></li>
          </ul>
        </div>
        <p className="mt-4 text-xs text-white/40">
          {t(bi("تطوير وتشغيل: لا توجد جهة مشرفة — هذا مشروع تجريبي.", "Developed & operated: no supervising body — this is a demo project."))}
        </p>
      </div>
    </footer>
  );
}
