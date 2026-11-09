import type { ReactNode } from "react";
import type { Tone } from "@/lib/data/status";
import { cn } from "@/lib/utils";

const TONES: Record<Tone, { box: string; dot: string }> = {
  neutral: { box: "bg-slate-100 text-slate-700 ring-slate-200", dot: "bg-slate-400" },
  info: { box: "bg-sky-50 text-sky-800 ring-sky-200", dot: "bg-sky-500" },
  navy: { box: "bg-navy-50 text-navy-800 ring-navy-100", dot: "bg-navy-600" },
  warning: { box: "bg-amber-50 text-amber-900 ring-amber-200", dot: "bg-amber-500" },
  success: { box: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-600" },
  danger: { box: "bg-flag-red-soft text-flag-red-dark ring-red-200", dot: "bg-flag-red" },
};

export function Badge({ tone = "neutral", dot = true, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  const t = TONES[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset", t.box, className)}>
      {dot && <span className={cn("size-1.5 rounded-full", t.dot)} aria-hidden="true" />}
      {children}
    </span>
  );
}

export function DemoTag({ className, children = "DEMO" }: { className?: string; children?: ReactNode }) {
  return (
    <span dir="ltr" className={cn("inline-flex items-center rounded border border-gold/40 bg-gold-soft px-1.5 py-px text-[10px] font-bold tracking-widest text-[#7a5d1c]", className)}>
      {children}
    </span>
  );
}
