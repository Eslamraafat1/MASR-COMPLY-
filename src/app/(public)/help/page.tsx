import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { FAQS, HELP_CATEGORIES } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "مركز المساعدة" };

export default async function HelpPage() {
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  return (
    <>
      <PageHero
        title={t(bi("مركز المساعدة", "Help center"))}
        text={t(bi("أدلة مختصرة وإجابات سريعة لتبدأ بثقة.", "Short guides and quick answers to get you started with confidence."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("مركز المساعدة", "Help center")) }]}
      />
      <section className="py-16 sm:py-20">
        <div className="container-x">
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HELP_CATEGORIES.map((c, i) => (
              <StaggerItem key={i}>
                <Link href={c.href} className="group flex h-full gap-4 rounded-2xl border border-line bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800 transition-colors group-hover:bg-navy-900 group-hover:text-white"><Icon name={c.icon} size={22} /></span>
                  <span>
                    <span className="flex items-center gap-2 text-base font-bold text-navy-900">{t(c.title)} <Arrow size={14} aria-hidden="true" className="opacity-0 transition-opacity group-hover:opacity-100" /></span>
                    <span className="mt-1 block text-sm leading-7 text-muted">{t(c.text)}</span>
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
      <section className="bg-surface py-16 sm:py-20">
        <div className="container-x max-w-3xl">
          <Reveal>
            <SectionHeading eyebrow={t(bi("الأكثر طلباً", "Most asked"))} title={t(bi("أسئلة سريعة", "Quick questions"))} />
            <Accordion items={FAQS.slice(0, 4)} />
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/faq" variant="outline">{t(bi("كل الأسئلة", "All questions"))}</LinkButton>
              <LinkButton href="/contact">{t(bi("تواصل مع الدعم", "Contact support"))}</LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
