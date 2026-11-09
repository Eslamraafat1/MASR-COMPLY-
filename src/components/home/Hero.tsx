"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Compass, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { bi, type Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { HeroVisual } from "./HeroVisual";

type Slide = { tag: Bi; lead: Bi; accent: Bi; text: Bi; cta: { href: string; label: Bi }; ghost: { href: string; label: Bi } };

const SLIDES: Slide[] = [
  {
    tag: bi("نموذج أولي لمنصة رقمية موحدة", "Prototype of a unified digital platform"),
    lead: bi("منصة رقمية موحدة لمنتجات أكثر أماناً", "One unified digital platform for safer products and"),
    accent: bi("وسوق أكثر ثقة", "a more trusted market"),
    text: bi("اكتشف تجربة رقمية متكاملة لإدارة تسجيل المنتجات ومتابعة إجراءات المطابقة والوثائق ذات الصلة، من خلال بيئة سهلة وآمنة.", "Discover an integrated digital experience for managing product registration and following conformity procedures and related documents, in an easy and secure environment."),
    cta: { href: "/register", label: bi("ابدأ رحلتك", "Start your journey") },
    ghost: { href: "/services", label: bi("استكشف الخدمات", "Explore services") },
  },
  {
    tag: bi("تسجيل المنتجات", "Product registration"),
    lead: bi("سجّل منتجاتك ومستنداتها", "Register your products and documents"),
    accent: bi("في ملف واحد منظم", "in one organised file"),
    text: bi("نموذج متعدد الخطوات مع رفع المستندات وحفظ المسودة ومعاينة قبل التقديم.", "A multi-step form with document upload, draft saving and a preview before submission."),
    cta: { href: "/services/product-registration", label: bi("شرح الخدمة", "Service details") },
    ghost: { href: "/hs-codes", label: bi("رموز النظام المنسق", "HS codes") },
  },
  {
    tag: bi("متابعة الطلبات", "Request tracking"),
    lead: bi("تابع كل طلب", "Follow every request"),
    accent: bi("من التقديم حتى الاكتمال", "from submission to completion"),
    text: bi("سجل زمني واضح وإجراءات مطلوبة ومستندات مرتبطة — جرّب برقم تجريبي.", "A clear timeline, required actions and linked documents — try it with a demo reference."),
    cta: { href: "/track", label: bi("تتبّع طلباً", "Track a request") },
    ghost: { href: "/sectors", label: bi("القطاعات المستفيدة", "Beneficiary sectors") },
  },
];

export function Hero() {
  const { t, isRtl } = useI18n();
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;
  const go = useCallback((n: number) => setI((n + SLIDES.length) % SLIDES.length), []);

  // Autoplay only when the user hasn't paused, isn't hovering/focusing, and allows motion.
  useEffect(() => {
    if (paused || hover || reduce) return;
    const id = setInterval(() => setI((x) => (x + 1) % SLIDES.length), 8000);
    return () => clearInterval(id);
  }, [paused, hover, reduce]);

  const s = SLIDES[i];
  return (
    <section
      aria-roledescription="carousel"
      aria-label={t(bi("البانر الرئيسي", "Main banner"))}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="pattern-lattice relative isolate overflow-hidden bg-navy-900"
    >
      <div aria-hidden="true" className="absolute -start-40 -top-40 -z-10 size-[560px] rounded-full bg-flag-red/20 blur-[120px]" />
      <div aria-hidden="true" className="absolute -bottom-52 -end-32 -z-10 size-[520px] rounded-full bg-white/[0.06] blur-[130px]" />

      <div className="container-x grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:py-24">
        <div className="min-h-[26rem] sm:min-h-[27rem]" aria-live={paused || hover ? "polite" : "off"}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${SLIDES.length}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-white/85 backdrop-blur">
                <span className="size-1.5 rounded-full bg-[#ff4d5e]" aria-hidden="true" />
                {t(s.tag)}
              </span>
              <h1 className="mt-6 text-balance text-[2.1rem] font-bold leading-[1.28] text-white sm:text-5xl lg:text-[3.2rem]">
                {t(s.lead)} <span className="text-[#ff6b79]">{t(s.accent)}</span>
              </h1>
              <p className="mt-6 max-w-xl text-pretty text-base leading-8 text-white/75 sm:text-lg sm:leading-9">{t(s.text)}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <LinkButton href={s.cta.href} variant="light" size="lg">
                  {t(s.cta.label)} <Arrow size={18} aria-hidden="true" />
                </LinkButton>
                <LinkButton href={s.ghost.href} variant="outline" size="lg" className="!border-white/25 !bg-white/5 !text-white hover:!bg-white/10">
                  <Compass size={18} aria-hidden="true" />
                  {t(s.ghost.label)}
                </LinkButton>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
            <button type="button" onClick={() => go(i - 1)} aria-label={t(bi("الشريحة السابقة", "Previous slide"))} className="grid size-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10">
              <Prev size={18} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label={t(bi("الشريحة التالية", "Next slide"))} className="grid size-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10">
              <Next size={18} aria-hidden="true" />
            </button>
            <div className="mx-2 flex items-center gap-2" role="tablist" aria-label={t(bi("اختيار الشريحة", "Choose slide"))}>
              {SLIDES.map((_, n) => (
                <button key={n} type="button" role="tab" aria-selected={n === i} aria-label={`${t(bi("الشريحة", "Slide"))} ${n + 1}`} onClick={() => go(n)} className="grid h-6 place-items-center px-0.5">
                  <span className={cn("block h-1.5 rounded-full transition-all duration-300", n === i ? "w-8 bg-flag-red" : "w-3 bg-white/35 hover:bg-white/60")} />
                </button>
              ))}
            </div>
            {!reduce && (
              <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? t(bi("تشغيل التبديل التلقائي", "Play automatic rotation")) : t(bi("إيقاف التبديل التلقائي", "Pause automatic rotation"))} className="ms-auto grid size-10 place-items-center rounded-full border border-white/20 text-white hover:bg-white/10">
                {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
              </button>
            )}
          </div>
        </div>
        <HeroVisual />
      </div>
      <div className="flag-rule" aria-hidden="true" />
    </section>
  );
}
