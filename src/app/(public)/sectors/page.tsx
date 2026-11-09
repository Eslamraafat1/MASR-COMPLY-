import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/Section";
import { SECTORS } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "القطاعات المستفيدة" };

export default async function SectorsPage() {
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  return (
    <>
      <PageHero
        title={t(bi("القطاعات المستفيدة", "Beneficiary sectors"))}
        text={t(bi("ست فئات من المتعاملين، لكل منها مسار وخدمات تناسب دورها.", "Six types of users, each with a path and services that fit their role."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("القطاعات", "Sectors")) }]}
      />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SECTORS.map((s) => (
              <StaggerItem key={s.slug}>
                <Link href={`/sectors/${s.slug}`} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                  <span className="mb-5 grid size-14 place-items-center rounded-xl bg-flag-green-soft text-flag-green"><Icon name={s.icon} size={28} /></span>
                  <h2 className="text-lg font-bold text-navy-900">{t(s.title)}</h2>
                  <p className="mt-2 flex-1 text-sm leading-7 text-muted">{t(s.long)}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-flag-green">{t(bi("التفاصيل", "Details"))} <Arrow size={15} aria-hidden="true" /></span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </>
  );
}
