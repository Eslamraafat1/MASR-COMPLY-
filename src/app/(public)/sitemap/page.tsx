import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/Section";
import { SECTORS, SERVICES } from "@/lib/data/content";
import { bi, type Bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "خريطة الموقع" };

export default async function SitemapPage() {
  const { t } = await getT();
  const groups: { title: Bi; links: { href: string; label: Bi }[] }[] = [
    { title: bi("الصفحات الرئيسية", "Main pages"), links: [
      { href: "/", label: bi("الرئيسية", "Home") }, { href: "/about", label: bi("عن المنصة", "About") }, { href: "/services", label: bi("الخدمات", "Services") },
      { href: "/sectors", label: bi("القطاعات المستفيدة", "Sectors") }, { href: "/announcements", label: bi("الإشعارات", "Notices") }, { href: "/contact", label: bi("تواصل معنا", "Contact") } ] },
    { title: bi("الخدمات", "Services"), links: SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.title })) },
    { title: bi("القطاعات", "Sectors"), links: SECTORS.map((s) => ({ href: `/sectors/${s.slug}`, label: s.title })) },
    { title: bi("مركز المعرفة", "Knowledge center"), links: [
      { href: "/help", label: bi("مركز المساعدة", "Help center") }, { href: "/faq", label: bi("الأسئلة الشائعة", "FAQ") }, { href: "/regulations", label: bi("اللوائح والمواصفات", "Regulations") },
      { href: "/hs-codes", label: bi("رموز النظام المنسق", "HS codes") }, { href: "/assessment-bodies", label: bi("جهات التقييم", "Assessment bodies") }, { href: "/search", label: bi("البحث المتقدم", "Advanced search") }, { href: "/track", label: bi("متابعة طلب", "Track a request") } ] },
    { title: bi("الحساب", "Account"), links: [
      { href: "/login", label: bi("تسجيل الدخول", "Sign in") }, { href: "/register", label: bi("إنشاء حساب", "Create account") }, { href: "/dashboard", label: bi("لوحة التحكم", "Dashboard") },
      { href: "/privacy", label: bi("سياسة الخصوصية", "Privacy policy") }, { href: "/terms", label: bi("الشروط والأحكام", "Terms") } ] },
  ];
  return (
    <>
      <PageHero title={t(bi("خريطة الموقع", "Site map"))} crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("خريطة الموقع", "Site map")) }]} />
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, i) => (
            <div key={i} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <h2 className="mb-3 border-b-2 border-flag-red pb-2 text-lg font-bold text-navy-900">{t(g.title)}</h2>
              <ul className="space-y-2 text-sm">
                {g.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="text-ink/80 hover:text-flag-red">{t(l.label)}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
