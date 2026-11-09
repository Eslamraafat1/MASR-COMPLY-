import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge, DemoTag } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/Section";
import { ANNOUNCEMENTS, DEMO_NOTICE } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return ANNOUNCEMENTS.map((a) => ({ id: a.id }));
}
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return { title: ANNOUNCEMENTS.find((a) => a.id === id)?.title.ar ?? "الإعلانات" };
}

export default async function AnnouncementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const a = ANNOUNCEMENTS.find((x) => x.id === id);
  if (!a) notFound();
  const { l, t } = await getT();
  return (
    <>
      <PageHero
        title={t(a.title)}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("الإعلانات", "Announcements")), href: "/announcements" }, { label: t(a.category) }]}
      />
      <section className="py-14 sm:py-20">
        <div className="container-x max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Badge tone="navy" dot={false}>{t(a.category)}</Badge>
            <DemoTag>{t(bi("نموذج", "SAMPLE"))}</DemoTag>
            <span className="ltr-num text-sm text-muted">{formatDate(a.date, l)}</span>
          </div>
          <p className="text-lg leading-10 text-ink/90">{t(a.body)}</p>
          <p className="mt-8 rounded-xl bg-surface px-5 py-4 text-sm leading-7 text-muted">{t(DEMO_NOTICE)}</p>
          <LinkButton href="/announcements" variant="outline" className="mt-8">{t(bi("كل الإعلانات", "All announcements"))}</LinkButton>
        </div>
      </section>
    </>
  );
}
