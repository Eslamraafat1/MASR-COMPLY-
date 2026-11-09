import { ArrowLeft, ArrowRight, Gauge, ShieldCheck, Ship } from "lucide-react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export async function WhySection() {
  const { t } = await getT();
  const items = [
    { icon: ShieldCheck, title: bi("رفع مستوى سلامة المنتجات", "Raising product safety"), text: bi("بيانات منظمة ومستندات مكتملة تسهّل التحقق من المنتج قبل وصوله للسوق.", "Organised data and complete documents make it easier to verify a product before it reaches the market.") },
    { icon: Gauge, title: bi("تقليل الوقت", "Saving time"), text: bi("نماذج مبسطة وتتبّع لحظي للحالة بدل المتابعة بين قنوات متعددة.", "Simple forms and live status tracking instead of following up across many channels.") },
    { icon: Ship, title: bi("تحسين تجربة الاستيراد", "A better import experience"), text: bi("مكان واحد لإدارة المنتجات والشهادات ومستندات الشحنات.", "One place to manage products, certificates and shipment documents.") },
  ];
  return (
    <section className="bg-navy-900 py-20 text-white sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading tone="light" eyebrow={t(bi("لماذا؟", "Why?"))} title={t(bi("لماذا MASR COMPLY؟", "Why MASR COMPLY?"))} />
        </Reveal>
        <Stagger className="grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <StaggerItem key={i}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7">
                <span className="mb-5 grid size-14 place-items-center rounded-xl bg-flag-red text-white">
                  <it.icon size={26} aria-hidden="true" />
                </span>
                <h3 className="text-xl font-bold">{t(it.title)}</h3>
                <p className="mt-2 text-sm leading-7 text-white/70">{t(it.text)}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export async function LearnSection() {
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  const tiles = [
    { href: "/assessment-bodies", icon: "Landmark", title: bi("جهات تقييم المطابقة", "Conformity assessment bodies") },
    { href: "/assessment-bodies", icon: "ScanSearch", title: bi("جهات التفتيش", "Inspection bodies") },
    { href: "/regulations", icon: "Scale", title: bi("اللوائح الفنية", "Technical regulations") },
    { href: "/search", icon: "PackageSearch", title: bi("المنتجات والفئات", "Products & categories") },
    { href: "/hs-codes", icon: "Boxes", title: bi("رموز النظام المنسق", "HS codes") },
  ];
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading eyebrow={t(bi("تعرّف على", "Learn about"))} title={t(bi("تعرّف على المحتوى المرجعي", "Explore the reference content"))} />
        </Reveal>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {tiles.map((x, i) => (
            <StaggerItem key={i}>
              <Link href={x.href} className="group flex h-full flex-col items-start gap-5 rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-flag-red/40 hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-900 transition-colors group-hover:bg-flag-red group-hover:text-white">
                  <Icon name={x.icon} size={22} />
                </span>
                <span className="flex-1 text-base font-bold leading-7 text-navy-900">{t(x.title)}</span>
                <Arrow size={18} aria-hidden="true" className="text-flag-red" />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
