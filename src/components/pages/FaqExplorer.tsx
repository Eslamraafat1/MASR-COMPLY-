"use client";

import { useMemo, useState } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/States";
import { FAQS } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { SearchBox } from "./Catalogues";

export function FaqExplorer() {
  const { t, locale } = useI18n();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const topics = useMemo(() => Array.from(new Map(FAQS.map((f) => [f.topic.en, f.topic])).entries()), []);
  const items = useMemo(
    () => FAQS.filter((f) => (topic === "all" || f.topic.en === topic) && (!q.trim() || (f.q[locale] + f.a[locale]).toLowerCase().includes(q.trim().toLowerCase()))),
    [q, topic, locale],
  );
  return (
    <div className="mx-auto max-w-3xl">
      <SearchBox value={q} onChange={setQ} placeholder={t(bi("ابحث في الأسئلة…", "Search questions…"))} />
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label={t(bi("الموضوع", "Topic"))}>
        {[["all", bi("الكل", "All")] as const, ...topics].map(([k, label]) => (
          <button key={k} type="button" aria-pressed={topic === k} onClick={() => setTopic(k)} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium", topic === k ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white hover:border-navy-900/40")}>
            {t(label)}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {items.length ? <Accordion items={items} /> : <EmptyState title={t(bi("لا توجد أسئلة مطابقة", "No matching questions"))} text={t(bi("جرّب كلمات أخرى أو تواصل معنا مباشرة.", "Try other words or contact us directly."))} />}
      </div>
    </div>
  );
}
