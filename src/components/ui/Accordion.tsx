"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import type { Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export type AccordionItem = { id: string; q: Bi; a: Bi; topic?: Bi };

export function Accordion({ items, defaultOpen }: { items: AccordionItem[]; defaultOpen?: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState<string | null>(defaultOpen ?? null);
  const base = useId();

  return (
    <div className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
      {items.map((it) => {
        const isOpen = open === it.id;
        const panelId = `${base}-${it.id}-panel`;
        const btnId = `${base}-${it.id}-btn`;
        return (
          <div key={it.id} id={it.id}>
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : it.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start transition-colors hover:bg-surface sm:px-6"
              >
                <span className="flex flex-col gap-0.5">
                  {it.topic && <span className="text-xs font-semibold text-flag-green">{t(it.topic)}</span>}
                  <span className="text-[15.5px] font-semibold text-navy-900">{t(it.q)}</span>
                </span>
                <span className={cn("grid size-8 shrink-0 place-items-center rounded-full border border-line text-navy-700 transition-all duration-300", isOpen && "rotate-180 border-navy-900 bg-navy-900 text-white")}>
                  <ChevronDown size={16} aria-hidden="true" />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pe-12 text-[15px] leading-8 text-muted sm:px-6">{t(it.a)}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
