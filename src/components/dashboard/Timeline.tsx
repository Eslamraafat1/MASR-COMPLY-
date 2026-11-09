"use client";

import { APPLICATION_STATUS, type Tone } from "@/lib/data/status";
import { useI18n } from "@/lib/i18n/provider";
import type { TimelineEvent } from "@/lib/types";
import { cn, formatDateTime } from "@/lib/utils";

const DOT: Record<Tone, string> = {
  neutral: "bg-slate-400",
  info: "bg-sky-500",
  navy: "bg-navy-600",
  warning: "bg-amber-500",
  success: "bg-emerald-600",
  danger: "bg-flag-red",
};

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const { t, locale } = useI18n();
  const list = [...events].reverse();
  return (
    <ol className="relative">
      {list.map((e, i) => (
        <li key={e.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < list.length - 1 && <span aria-hidden="true" className="absolute start-[7px] top-4 h-full w-px bg-line" />}
          <span aria-hidden="true" className={cn("relative z-10 mt-1.5 size-[15px] shrink-0 rounded-full ring-4 ring-white", DOT[APPLICATION_STATUS[e.status].tone])} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy-900">{t(e.title)}</p>
            {e.note && <p className="mt-0.5 text-sm text-muted">{t(e.note)}</p>}
            <p className="mt-1 text-xs text-muted">
              <span className="ltr-num">{formatDateTime(e.at, locale)}</span>
              {e.actor && <> · {t(e.actor)}</>}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
