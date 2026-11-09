import { PageHero } from "@/components/ui/Section";
import { bi, type Bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export type LegalSection = { title: Bi; body: Bi[] };

export async function LegalPage({ title, intro, sections, updated }: { title: Bi; intro: Bi; sections: LegalSection[]; updated: string }) {
  const { t } = await getT();
  return (
    <>
      <PageHero title={t(title)} text={t(intro)} crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(title) }]} />
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[16rem_1fr] lg:gap-16">
          <nav aria-label={t(bi("المحتويات", "Contents"))} className="hidden lg:block">
            <ol className="sticky top-28 space-y-1 border-s border-line ps-4 text-sm">
              {sections.map((s, i) => (
                <li key={i}><a href={`#s${i}`} className="block rounded py-1.5 text-muted hover:text-navy-900">{t(s.title)}</a></li>
              ))}
            </ol>
          </nav>
          <article className="max-w-3xl">
            <p className="mb-8 rounded-xl border border-gold/30 bg-gold-soft px-5 py-3.5 text-sm leading-7 text-[#6b5116]">
              {t(bi("هذه الصفحة جزء من نموذج أولي، وصياغتها توضيحية وليست مشورة قانونية، وتُراجع قانونياً قبل أي إطلاق فعلي.", "This page is part of a prototype. Its wording is illustrative, not legal advice, and must be legally reviewed before any real launch."))}
            </p>
            {sections.map((s, i) => (
              <section key={i} id={`s${i}`} className="mb-9 scroll-mt-28">
                <h2 className="mb-3 text-xl font-bold text-navy-900">{t(s.title)}</h2>
                {s.body.map((p, j) => <p key={j} className="mb-3 text-base leading-9 text-ink/85">{t(p)}</p>)}
              </section>
            ))}
            <p className="text-sm text-muted">{t(bi("آخر تحديث:", "Last updated:"))} <span className="ltr-num">{updated}</span></p>
          </article>
        </div>
      </section>
    </>
  );
}
