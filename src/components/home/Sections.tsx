import { ArrowLeft, ArrowRight, Bell, CalendarDays, Info } from "lucide-react";
import Link from "next/link";
import { Accordion } from "@/components/ui/Accordion";
import { Badge, DemoTag } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { CountUp } from "@/components/ui/CountUp";
import { Icon } from "@/components/ui/Icon";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { SectionHeading } from "@/components/ui/Section";
import { ANNOUNCEMENTS, FAQS, PROPOSED_NOTICE, SECTORS, SERVICES, STATS, WORKFLOW_STEPS } from "@/lib/data/content";
import { SEED_APPLICATIONS, SEED_FACILITIES, SEED_PRODUCTS } from "@/lib/data/seed";
import { bi, type Bi } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import { formatDate } from "@/lib/utils";

async function ctx() {
  const l = await getLocale();
  return { l, t: (v: Bi) => v[l], Arrow: l === "ar" ? ArrowLeft : ArrowRight };
}

/* ───────────────────────────── C. Quick service access ───────────────────────────── */
export async function ServicesSection() {
  const { t, Arrow } = await ctx();
  return (
    <section className="py-20 sm:py-24" aria-labelledby="services-h">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={t(bi("الخدمات الإلكترونية", "Electronic services"))}
            title={t(bi("كل ما تحتاجه لإدارة امتثال منتجاتك في مكان واحد", "Everything you need to manage product compliance, in one place"))}
            text={t(bi("ثماني خدمات رئيسية مصممة لتبسيط رحلتك من تسجيل المنتج حتى متابعة الطلب والمستندات.", "Eight core services designed to simplify your journey from registering a product to following requests and documents."))}
            action={
              <LinkButton href="/services" variant="outline" className="shrink-0">
                {t(bi("جميع الخدمات", "All services"))} <Arrow size={16} aria-hidden="true" />
              </LinkButton>
            }
          />
        </Reveal>
        <span id="services-h" className="sr-only">{t(bi("الخدمات", "Services"))}</span>
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {SERVICES.map((s) => (
            <StaggerItem key={s.slug}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-navy-900/20 hover:shadow-lift"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] origin-start scale-x-0 bg-gradient-to-l from-flag-green via-flag-green to-flag-red transition-transform duration-500 group-hover:scale-x-100 rtl:origin-right" />
                <span className="mb-5 grid size-12 place-items-center rounded-xl bg-navy-50 text-navy-800 transition-colors duration-300 group-hover:bg-navy-900 group-hover:text-white">
                  <Icon name={s.icon} size={24} />
                </span>
                <h3 className="text-[17px] font-bold text-navy-900">{t(s.title)}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted">{t(s.short)}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-flag-green">
                  {t(bi("ابدأ الآن", "Get started"))}
                  <Arrow size={15} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ───────────────────────────── D. Beneficiary sectors ───────────────────────────── */
export async function SectorsSection() {
  const { t, Arrow } = await ctx();
  return (
    <section className="pattern-lattice-light bg-surface py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={t(bi("القطاعات المستفيدة", "Beneficiary sectors"))}
            title={t(bi("مسار مخصص لكل فئة من المتعاملين", "A dedicated path for every type of user"))}
            text={t(bi("اختر نوع حسابك لتجد الخدمات والإرشادات الأنسب لدورك.", "Pick your account type to find the services and guidance that fit your role."))}
          />
        </Reveal>
        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {SECTORS.map((s) => (
            <StaggerItem key={s.slug}>
              <article className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:border-flag-green/40 hover:shadow-lift">
                <div className="flex items-start gap-4">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-flag-green-soft text-flag-green">
                    <Icon name={s.icon} size={24} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-navy-900">{t(s.title)}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-muted">{t(s.short)}</p>
                  </div>
                </div>
                <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink/80">
                  {s.can.slice(0, 3).map((c, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-flag-red" />
                      {t(c)}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
                  <Link href={`/register?type=${s.accountType}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-900 hover:text-flag-green">
                    {t(bi("سجّل كـ", "Register as"))} {t(s.title)}
                    <Arrow size={15} aria-hidden="true" className="transition-transform group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </Link>
                  <Link href={`/sectors/${s.slug}`} className="text-sm text-muted underline-offset-4 hover:text-navy-900 hover:underline">
                    {t(bi("التفاصيل", "Details"))}
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ───────────────────────────── E. How it works ───────────────────────────── */
export async function JourneySection() {
  const { t } = await ctx();
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            align="center"
            eyebrow={t(bi("كيف تعمل المنصة", "How it works"))}
            title={t(bi("رحلتك في ست خطوات واضحة", "Your journey in six clear steps"))}
            text={t(bi("تسلسل مقترح للرحلة الرقمية من إنشاء الحساب حتى استكمال الإجراءات.", "A proposed sequence for the digital journey, from creating an account to completing procedures."))}
          />
        </Reveal>

        <ol className="relative grid gap-0 lg:grid-cols-6 lg:gap-4">
          {WORKFLOW_STEPS.map((s, i) => {
            const last = i === WORKFLOW_STEPS.length - 1;
            return (
              <li key={s.n} className="relative pb-9 ps-16 last:pb-0 lg:pb-0 lg:ps-0 lg:text-center">
                {/* connectors: vertical on mobile, horizontal on desktop */}
                {!last && <span aria-hidden="true" className="absolute start-6 top-14 h-[calc(100%-2.5rem)] w-px bg-gradient-to-b from-navy-900/25 to-navy-900/5 lg:hidden" />}
                {!last && <span aria-hidden="true" className="absolute top-6 hidden h-px w-full start-1/2 bg-gradient-to-l from-navy-900/10 via-navy-900/25 to-navy-900/10 lg:block" />}
                <Reveal delay={i * 0.06}>
                  <span className="absolute start-0 top-0 grid size-12 place-items-center rounded-full border-2 border-navy-900 bg-white text-sm font-extrabold text-navy-900 shadow-card lg:relative lg:mx-auto lg:mb-5 lg:flex">
                    <span className="ltr-num">{s.n}</span>
                  </span>
                  <div className="lg:px-1">
                    <span className="mb-2 hidden size-9 place-items-center rounded-lg bg-navy-50 text-navy-700 lg:mx-auto lg:grid">
                      <Icon name={s.icon} size={18} />
                    </span>
                    <h3 className="text-[15.5px] font-bold leading-7 text-navy-900">{t(s.title)}</h3>
                    <p className="mt-1.5 text-sm leading-7 text-muted">{t(s.text)}</p>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 flex max-w-3xl items-start gap-3 rounded-xl border border-gold/30 bg-gold-soft px-5 py-4 text-sm leading-7 text-[#6b5116]">
            <Info size={18} className="mt-1 shrink-0" aria-hidden="true" />
            <span>
              <strong className="font-bold">{t(bi("مسار مقترح:", "Proposed workflow:"))}</strong> {t(PROPOSED_NOTICE)}
            </span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── F. Statistics ───────────────────────────── */
export async function StatsSection() {
  const { t } = await ctx();
  const values = [SEED_PRODUCTS.length, SEED_FACILITIES.length, SEED_APPLICATIONS.length, SEED_APPLICATIONS.filter((a) => a.status === "completed").length];
  return (
    <section className="pattern-lattice relative overflow-hidden bg-navy-900 py-20 sm:py-24">
      <div aria-hidden="true" className="absolute -top-32 start-1/3 size-96 rounded-full bg-flag-green/15 blur-[110px]" />
      <div className="container-x relative">
        <Reveal>
          <SectionHeading
            tone="light"
            eyebrow={t(bi("مؤشرات المنصة", "Platform indicators"))}
            title={t(bi("أرقام مساحة العرض التجريبية", "Demo workspace figures"))}
            text={t(bi("هذه الأرقام توضيحية من بيئة العرض ولا تمثل إحصاءات حقيقية. ستظهر المؤشرات الفعلية عند الربط بمصدر بيانات موثّق.", "These figures are illustrative, taken from the demo environment, and are not real statistics. Actual indicators will appear once connected to a verified data source."))}
          />
        </Reveal>
        <Stagger className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <StaggerItem key={i} className="bg-navy-900/95 p-6 sm:p-8">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-lg bg-white/8 text-[#ff6b79]">
                  <Icon name={s.icon} size={20} />
                </span>
                <DemoTag />
              </div>
              <CountUp value={values[i]} className="ltr-num mt-6 text-4xl font-bold text-white sm:text-5xl" />
              <p className="mt-2 text-sm text-white/65">{t(s.label)}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ───────────────────────────── G. Announcements ───────────────────────────── */
export async function AnnouncementsSection() {
  const { l, t, Arrow } = await ctx();
  return (
    <section className="py-20 sm:py-24">
      <div className="container-x">
        <Reveal>
          <SectionHeading
            eyebrow={t(bi("آخر المستجدات", "Latest updates"))}
            title={t(bi("إشعارات هامة", "Important notices"))}
            text={t(bi("أمثلة توضيحية لقسم الإعلانات — وليست إعلانات حكومية رسمية.", "Sample content for the announcements area — not official government announcements."))}
            action={
              <LinkButton href="/announcements" variant="outline">
                {t(bi("كل الإعلانات", "All announcements"))} <Arrow size={16} aria-hidden="true" />
              </LinkButton>
            }
          />
        </Reveal>
        <Stagger className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0">
          {ANNOUNCEMENTS.map((a) => (
            <StaggerItem key={a.id} className="w-[min(22rem,84vw)] shrink-0 snap-start">
              <article className="group flex h-full flex-col rounded-2xl border border-line border-t-4 border-t-flag-red bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2"><span className="grid size-9 place-items-center rounded-full bg-flag-red-soft text-flag-red"><Bell size={17} aria-hidden="true" /></span><Badge tone="navy" dot={false}>{t(a.category)}</Badge></span>
                  <DemoTag>{t(bi("نموذج", "SAMPLE"))}</DemoTag>
                </div>
                <h3 className="text-base font-bold leading-7 text-navy-900">{t(a.title)}</h3>
                <p className="mt-2 flex-1 text-sm leading-7 text-muted">{t(a.text)}</p>
                <div className="mt-5 flex items-center justify-between border-t border-line pt-4 text-sm">
                  <span className="flex items-center gap-1.5 text-muted">
                    <CalendarDays size={15} aria-hidden="true" /> <span className="ltr-num">{formatDate(a.date, l)}</span>
                  </span>
                  <Link href={`/announcements/${a.id}`} className="inline-flex items-center gap-1 font-semibold text-flag-green">
                    {t(bi("اقرأ المزيد", "Read more"))}
                    <Arrow size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ───────────────────────────── H. FAQ ───────────────────────────── */
export async function FaqSection() {
  const { t, Arrow } = await ctx();
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <div className="lg:sticky lg:top-28">
            <span className="eyebrow mb-3">{t(bi("الأسئلة الشائعة", "FAQ"))}</span>
            <h2 className="text-[1.7rem] font-bold leading-[1.35] text-navy-900 sm:text-[2.1rem]">{t(bi("إجابات سريعة عن أكثر الأسئلة تكراراً", "Quick answers to the most common questions"))}</h2>
            <p className="mt-3 text-base leading-8 text-muted">{t(bi("لم تجد ما تبحث عنه؟ يسعدنا مساعدتك عبر مركز المساعدة أو صفحة التواصل.", "Can't find what you need? We're happy to help through the help center or the contact page."))}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href="/faq" variant="primary">
                {t(bi("كل الأسئلة", "All questions"))} <Arrow size={16} aria-hidden="true" />
              </LinkButton>
              <LinkButton href="/contact" variant="outline">
                {t(bi("تواصل معنا", "Contact us"))}
              </LinkButton>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <Accordion items={FAQS.slice(0, 6)} defaultOpen="f1" />
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────────── CTA band ───────────────────────────── */
export async function CtaBand() {
  const { t, Arrow } = await ctx();
  return (
    <section className="py-16 sm:py-20">
      <div className="container-x">
        <Reveal>
          <div className="pattern-lattice relative overflow-hidden rounded-3xl bg-navy-900 px-6 py-12 text-center sm:px-14 sm:py-16">
            <div aria-hidden="true" className="absolute -top-24 start-10 size-72 rounded-full bg-flag-green/25 blur-[90px]" />
            <div aria-hidden="true" className="absolute -bottom-28 end-10 size-72 rounded-full bg-flag-red/25 blur-[90px]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold leading-[1.4] text-white sm:text-4xl">{t(bi("جاهز لتجربة رحلة المطابقة الرقمية؟", "Ready to try the digital compliance journey?"))}</h2>
              <p className="mt-4 text-base leading-8 text-white/70">{t(bi("أنشئ حساباً تجريبياً في دقيقة واحدة واستكشف لوحة التحكم وتسجيل المنتجات ومتابعة الطلبات.", "Create a demo account in a minute and explore the dashboard, product registration and request tracking."))}</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <LinkButton href="/register" variant="light" size="lg">
                  {t(bi("إنشاء حساب", "Create account"))} <Arrow size={18} aria-hidden="true" />
                </LinkButton>
                <LinkButton href="/login" variant="outline" size="lg" className="!border-white/25 !bg-white/5 !text-white hover:!bg-white/10">
                  {t(bi("تسجيل الدخول", "Sign in"))}
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
