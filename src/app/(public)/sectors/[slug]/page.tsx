import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/Section";
import { SECTORS, SERVICES } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export function generateStaticParams() {
  return SECTORS.map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: SECTORS.find((s) => s.slug === slug)?.title.ar ?? "القطاعات" };
}

export default async function SectorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sector = SECTORS.find((s) => s.slug === slug);
  if (!sector) notFound();
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  return (
    <>
      <PageHero
        title={t(sector.title)}
        text={t(sector.short)}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("القطاعات", "Sectors")), href: "/sectors" }, { label: t(sector.title) }]}
      >
        <LinkButton href={`/register?type=${sector.accountType}`} variant="light" size="lg">
          {t(bi("سجّل كـ", "Register as"))} {t(sector.title)} <Arrow size={18} aria-hidden="true" />
        </LinkButton>
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy-900">{t(bi("لمن هذا المسار؟", "Who is this path for?"))}</h2>
            <p className="mt-3 text-base leading-9 text-muted">{t(sector.long)}</p>
            <h2 className="mb-4 mt-10 text-2xl font-bold text-navy-900">{t(bi("ما الذي يمكنك فعله", "What you can do"))}</h2>
            <ul className="space-y-3">
              {sector.can.map((c, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-line bg-white px-4 py-3 shadow-card">
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-flag-green-soft text-flag-green"><Check size={15} aria-hidden="true" /></span>
                  <span className="text-[15px] font-medium text-navy-900">{t(c)}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mb-4 text-2xl font-bold text-navy-900">{t(bi("خدمات ذات صلة", "Related services"))}</h2>
            <ul className="grid gap-3">
              {SERVICES.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="flex items-center gap-4 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-navy-900/25 hover:bg-white">
                    <Icon name={s.icon} size={22} className="text-navy-700" />
                    <span className="flex-1 text-[15px] font-semibold text-navy-900">{t(s.title)}</span>
                    <Arrow size={16} className="text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </>
  );
}
