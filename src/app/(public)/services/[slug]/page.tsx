import { ArrowLeft, ArrowRight, FileText, Info } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Motion";
import { PageHero } from "@/components/ui/Section";
import { PROPOSED_NOTICE, SERVICES } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = SERVICES.find((x) => x.slug === slug);
  return { title: s ? s.title.ar : "الخدمات" };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  const others = SERVICES.filter((s) => s.slug !== slug);

  return (
    <>
      <PageHero
        title={t(service.title)}
        text={t(service.short)}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("الخدمات", "Services")), href: "/services" }, { label: t(service.title) }]}
      >
        <LinkButton href={service.href} variant="light" size="lg">
          {t(bi("ابدأ الخدمة", "Start this service"))} <Arrow size={18} aria-hidden="true" />
        </LinkButton>
      </PageHero>
      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_20rem] lg:gap-14">
          <div>
            <Reveal>
              <h2 className="text-2xl font-bold text-navy-900">{t(bi("نبذة عن الخدمة", "About this service"))}</h2>
              <p className="mt-3 text-base leading-9 text-muted">{t(service.long)}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2 className="mb-5 mt-12 text-2xl font-bold text-navy-900">{t(bi("خطوات الاستخدام", "How it works"))}</h2>
              <ol className="space-y-4">
                {service.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-4 rounded-xl border border-line bg-white p-4 shadow-card">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-900 text-sm font-bold text-white"><span className="ltr-num">{i + 1}</span></span>
                    <span className="pt-1 text-[15px] font-medium text-navy-900">{t(s)}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {service.docs.length > 0 && (
              <Reveal delay={0.05}>
                <h2 className="mb-5 mt-12 text-2xl font-bold text-navy-900">{t(bi("مستندات قد تحتاجها", "Documents you may need"))}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {service.docs.map((d, i) => (
                    <li key={i} className="flex items-center gap-3 rounded-xl bg-surface px-4 py-3 text-sm"><FileText size={18} className="text-flag-green" aria-hidden="true" />{t(d)}</li>
                  ))}
                </ul>
              </Reveal>
            )}

            <p className="mt-10 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold-soft px-5 py-4 text-sm leading-7 text-[#6b5116]">
              <Info size={18} className="mt-1 shrink-0" aria-hidden="true" /> {t(PROPOSED_NOTICE)}
            </p>
          </div>

          <aside aria-label={t(bi("خدمات أخرى", "Other services"))}>
            <div className="rounded-2xl border border-line bg-white p-3 shadow-card lg:sticky lg:top-28">
              <h2 className="px-3 pb-2 pt-3 text-sm font-bold text-navy-900">{t(bi("خدمات أخرى", "Other services"))}</h2>
              <ul>
                {others.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/85 transition-colors hover:bg-surface hover:text-navy-900">
                      <Icon name={s.icon} size={18} className="text-navy-600" /> {t(s.title)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
