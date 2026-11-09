"use client";

import { Check } from "lucide-react";
import type { Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/** Progress indicator for multi-step forms. Labels collapse to the current step on small screens. */
export function Stepper({ steps, current }: { steps: Bi[]; current: number }) {
  const { t, locale } = useI18n();
  const pct = (current / (steps.length - 1)) * 100;
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-navy-900 sm:hidden" aria-live="polite">
        <span className="ltr-num">
          {current + 1}/{steps.length}
        </span>{" "}
        — {t(steps[current])}
      </p>
      <div className="relative">
        <div className="absolute inset-x-4 top-4 hidden h-0.5 bg-line sm:block" aria-hidden="true">
          <div className="h-full bg-flag-red transition-[width] duration-500" style={{ width: `${pct}%` }} />
        </div>
        <ol className="relative flex items-start justify-between gap-1">
          {steps.map((s, i) => {
            const done = i < current;
            const active = i === current;
            return (
              <li key={i} aria-current={active ? "step" : undefined} className="flex flex-1 flex-col items-center gap-2 text-center sm:flex-none">
                <span
                  className={cn(
                    "relative z-10 grid size-8 place-items-center rounded-full border-2 text-xs font-bold transition-colors",
                    done && "border-flag-red bg-flag-red text-white",
                    active && "border-navy-900 bg-navy-900 text-white",
                    !done && !active && "border-line bg-white text-muted",
                  )}
                >
                  {done ? <Check size={15} aria-hidden="true" /> : <span className="ltr-num">{i + 1}</span>}
                </span>
                <span lang={locale} className={cn("hidden max-w-[7rem] text-xs font-medium sm:block", active ? "text-navy-900" : "text-muted")}>
                  {t(s)}
                </span>
                <span className="sr-only sm:hidden">{done ? "✓ " : ""}{t(s)}</span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
