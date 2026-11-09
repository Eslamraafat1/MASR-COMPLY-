import { CalendarDays } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Badge, DemoTag } from "@/components/ui/Badge";
import { PageHero } from "@/components/ui/Section";
import { ANNOUNCEMENTS } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "الإعلانات" };

export default async function AnnouncementsPage() {
  const { l, t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("الإعلانات والتحديثات", "Announcements & updates"))}
        text={t(bi("أمثلة توضيحية — ليست إعلانات حكومية رسمية.", "Sample content — not official government announcements."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("الإعلانات", "Announcements")) }]}
      />
      <section className="py-14 sm:py-20">
        <div className="container-x max-w-3xl space-y-5">
          {ANNOUNCEMENTS.map((a) => (
            <article key={a.id} className="rounded-2xl border border-line bg-white p-6 shadow-card">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge tone="navy" dot={false}>{t(a.category)}</Badge>
                <DemoTag>{t(bi("نموذج", "SAMPLE"))}</DemoTag>
                <span className="ms-auto flex items-center gap-1.5 text-sm text-muted"><CalendarDays size={15} aria-hidden="true" /><span className="ltr-num">{formatDate(a.date, l)}</span></span>
              </div>
              <h2 className="text-lg font-bold text-navy-900"><Link href={`/announcements/${a.id}`} className="hover:text-flag-green">{t(a.title)}</Link></h2>
              <p className="mt-2 text-sm leading-7 text-muted">{t(a.text)}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
