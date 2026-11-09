"use client";

import { motion } from "framer-motion";
import { BadgeCheck, CheckCircle2, Clock3, FileCheck2, ShieldCheck } from "lucide-react";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Original CSS/SVG composition: a layered "certificate" card over concentric rings and a pyramid
 * outline (Egyptian geometry), with floating status chips. Purely decorative → aria-hidden.
 */
export function HeroVisual() {
  const { t } = useI18n();
  return (
    <div className="relative mx-auto aspect-[1/1.02] w-full max-w-[520px]" aria-hidden="true">
      {/* rings */}
      <svg viewBox="0 0 520 530" className="absolute inset-0 size-full" fill="none">
        <defs>
          <linearGradient id="hv-g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ff4d5e" stopOpacity=".55" />
            <stop offset="1" stopColor="#ff4d5e" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hv-g2" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#CE1126" stopOpacity=".7" />
            <stop offset="1" stopColor="#CE1126" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle cx="260" cy="270" r="238" stroke="#fff" strokeOpacity=".08" />
        <circle cx="260" cy="270" r="188" stroke="#fff" strokeOpacity=".1" strokeDasharray="2 7" />
        <circle cx="260" cy="270" r="138" stroke="#fff" strokeOpacity=".12" />
        <path d="M260 38 478 420H42L260 38Z" stroke="url(#hv-g1)" strokeWidth="1.5" />
        <path d="M260 96 428 392H92L260 96Z" stroke="url(#hv-g2)" strokeWidth="1" />
        <path d="M42 420H478" stroke="#fff" strokeOpacity=".2" />
      </svg>

      {/* main card */}
      <motion.div
        initial={{ opacity: 0, y: 28, rotate: -2 }}
        animate={{ opacity: 1, y: 0, rotate: -2 }}
        transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
        className="absolute start-[15%] top-[13%] w-[66%] overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgb(0_0_0/.6)]"
      >
        <div className="flex items-center justify-between bg-navy-800 px-5 py-3.5">
          <span className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] text-white/90">
            <ShieldCheck size={15} className="text-[#ff6b79]" /> CONFORMITY FILE
          </span>
          <span className="rounded border border-gold/50 px-1.5 text-[9px] font-bold tracking-widest text-gold">DEMO</span>
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-xl bg-flag-green-soft text-flag-green">
              <BadgeCheck size={26} />
            </span>
            <div className="flex-1 space-y-2">
              <div className="h-2.5 w-3/4 rounded-full bg-navy-900/85" />
              <div className="h-2 w-1/2 rounded-full bg-navy-900/15" />
            </div>
          </div>
          <div className="space-y-2.5">
            {[88, 64, 76].map((w, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="shrink-0 text-flag-green" />
                <div className="h-2 rounded-full bg-navy-900/10" style={{ width: `${w}%` }} />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[0, 1, 2].map((i) => (
              <div key={i} className="rounded-lg bg-surface p-2.5">
                <div className="mb-1.5 h-1.5 w-2/3 rounded-full bg-navy-900/15" />
                <div className="h-2.5 w-full rounded-full bg-navy-900/70" />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3.5">
            <div className="flex gap-1">
              <span className="h-1 w-6 rounded-full bg-flag-red" />
              <span className="h-1 w-6 rounded-full bg-line" />
              <span className="h-1 w-6 rounded-full bg-navy-900" />
            </div>
            <span dir="ltr" className="text-[10px] font-semibold tracking-wider text-muted">DEMO-APP-2026-0001</span>
          </div>
        </div>
      </motion.div>

      {/* floating chips */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.7, ease: EASE }}
        className="absolute end-[2%] top-[34%]"
      >
        <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="flex items-center gap-3 rounded-xl bg-white/95 px-4 py-3 shadow-[0_20px_40px_-18px_rgb(0_0_0/.5)] backdrop-blur">
          <span className="grid size-9 place-items-center rounded-lg bg-flag-green-soft text-flag-green">
            <FileCheck2 size={19} />
          </span>
          <span className="leading-tight">
            <span className="block text-[11px] text-muted">{t(bi("المستندات", "Documents"))}</span>
            <span className="block text-sm font-bold text-navy-900">
              <span className="ltr-num">4/4</span> {t(bi("مكتملة", "complete"))}
            </span>
          </span>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.9, ease: EASE }}
        className="absolute bottom-[10%] start-[2%]"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="w-56 rounded-xl bg-white/95 p-4 shadow-[0_20px_40px_-18px_rgb(0_0_0/.5)] backdrop-blur">
          <div className="mb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-navy-800">
              <Clock3 size={13} /> {t(bi("حالة الطلب", "Request status"))}
            </span>
            <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-800">{t(bi("قيد التقييم", "In assessment"))}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-navy-900/10">
            <motion.div initial={{ width: 0 }} animate={{ width: "68%" }} transition={{ duration: 1.2, delay: 1.2, ease: EASE }} className="h-full rounded-full bg-gradient-to-l from-flag-red to-[#ff4d5e]" />
          </div>
          <div className="mt-2 flex justify-between text-[10px] text-muted">
            <span>{t(bi("تم التقديم", "Submitted"))}</span>
            <span>{t(bi("مكتمل", "Done"))}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
