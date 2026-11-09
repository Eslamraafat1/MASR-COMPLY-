import { CheckCircle2, Eye, Languages, PlugZap, ShieldCheck, XCircle } from "lucide-react";
import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/Button";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { PageHero, SectionHeading } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "عن المنصة" };

export default async function AboutPage() {
  const { t } = await getT();
  const values = [
    { icon: Eye, title: bi("وضوح", "Clarity"), text: bi("خطوات مباشرة وحالات مفهومة لكل طلب، دون تعقيد أو غموض.", "Straightforward steps and understandable statuses for every request.") },
    { icon: ShieldCheck, title: bi("ثقة", "Trust"), text: bi("شفافية كاملة حول ما هو تجريبي وما هو مقترح وما سيتم التحقق منه.", "Full transparency about what is demo, what is proposed, and what remains to be verified.") },
    { icon: Languages, title: bi("إتاحة", "Accessibility"), text: bi("عربية وإنجليزية بالكامل، مع دعم لوحة المفاتيح وقارئات الشاشة.", "Full Arabic and English, with keyboard and screen-reader support.") },
    { icon: PlugZap, title: bi("جاهزية للربط", "Integration-ready"), text: bi("طبقة خدمات منفصلة تسهّل استبدال البيانات التجريبية بواجهات برمجية حقيقية.", "A separate service layer that makes swapping demo data for real APIs straightforward.") },
  ];
  const is = [
    bi("نموذج أولي مستقل لتجربة مستخدم متكاملة", "An independent prototype of a complete user experience"),
    bi("بيئة لتجربة رحلة تسجيل المنتج وتقديم الطلب ومتابعته", "A sandbox to explore product registration, request submission and tracking"),
    bi("أساس قابل للتطوير والربط بخلفية برمجية لاحقاً", "A foundation that can later be connected to a real backend"),
  ];
  const isnt = [
    bi("ليست منصة حكومية رسمية ولا تابعة لأي وزارة أو جهة تنظيمية", "Not an official government platform, nor affiliated with any ministry or regulator"),
    bi("لا تُصدر موافقات أو شهادات أو رسوماً ذات حجية قانونية", "Does not issue legally valid approvals, certificates or fees"),
    bi("لا تتضمن تكاملات رسمية أو بيانات حقيقية", "Contains no official integrations or real records"),
  ];

  return (
    <>
      <PageHero
        title={t(bi("عن منصة MASR COMPLY", "About MASR COMPLY"))}
        text={t(bi("تصور لمنصة رقمية موحدة تجمع تسجيل المنتجات ومتابعة إجراءات المطابقة والمستندات في تجربة واحدة واضحة وآمنة.", "A concept for a unified digital platform bringing product registration, conformity procedures and documents into one clear, secure experience."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("عن المنصة", "About")) }]}
      />
      <section className="py-20">
        <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <span className="eyebrow mb-3">{t(bi("رؤيتنا", "Our vision"))}</span>
            <h2 className="text-3xl font-bold leading-[1.4] text-navy-900">{t(bi("نحو سوق مصري أكثر أماناً وجودة", "Toward a safer, higher-quality Egyptian market"))}</h2>
            <p className="mt-4 text-base leading-9 text-muted">
              {t(bi("تعتمد رحلات المطابقة غالباً على مستندات متفرقة وقنوات متعددة. تقترح MASR COMPLY بيئة رقمية واحدة تُنظّم بيانات المنتجات والمنشآت والطلبات والمستندات، وتجعل حالة كل طلب واضحة لصاحبه في أي وقت.", "Conformity journeys often rely on scattered documents and multiple channels. MASR COMPLY proposes a single digital environment that organises product, facility, request and document data and keeps every request's status visible to its owner at any time."))}
            </p>
            <p className="mt-4 text-base leading-9 text-muted">
              {t(bi("صُمّمت التجربة لتكون هادئة وسهلة وموثوقة: نماذج مبسطة، رسائل خطأ مفهومة، وتتبّع زمني لكل طلب.", "The experience is designed to be calm, simple and dependable: streamlined forms, understandable error messages, and a timeline for every request."))}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-flag-green/25 bg-flag-green-soft/60 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-flag-green-dark"><CheckCircle2 size={20} aria-hidden="true" /> {t(bi("ما هي المنصة", "What it is"))}</h3>
                <ul className="space-y-3 text-sm leading-7 text-ink/85">{is.map((x, i) => <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-flag-green" />{t(x)}</li>)}</ul>
              </div>
              <div className="rounded-2xl border border-flag-red/20 bg-flag-red-soft/60 p-6">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-flag-red-dark"><XCircle size={20} aria-hidden="true" /> {t(bi("ما ليست عليه", "What it is not"))}</h3>
                <ul className="space-y-3 text-sm leading-7 text-ink/85">{isnt.map((x, i) => <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="mt-3 size-1.5 shrink-0 rounded-full bg-flag-red" />{t(x)}</li>)}</ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="bg-surface py-20">
        <div className="container-x">
          <Reveal><SectionHeading align="center" eyebrow={t(bi("مبادئنا", "Principles"))} title={t(bi("أربعة مبادئ تقود التصميم", "Four principles that guide the design"))} /></Reveal>
          <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <StaggerItem key={i}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-card">
                  <span className="mb-4 grid size-12 place-items-center rounded-xl bg-navy-900 text-white"><v.icon size={22} aria-hidden="true" /></span>
                  <h3 className="text-lg font-bold text-navy-900">{t(v.title)}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted">{t(v.text)}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <LinkButton href="/register" size="lg">{t(bi("جرّب المنصة", "Try the platform"))}</LinkButton>
            <LinkButton href="/contact" variant="outline" size="lg">{t(bi("تواصل معنا", "Contact us"))}</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
