"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/components/ui/Icon";
import { SERVICES } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type Aud = "individuals" | "importers" | "government" | "factories";
const ALL: Aud[] = ["individuals", "importers", "government", "factories"];

const AUD: Record<Aud, ReturnType<typeof bi>> = {
  individuals: bi("الأفراد", "Individuals"),
  importers: bi("المستوردون", "Importers"),
  government: bi("الجهات الحكومية", "Government"),
  factories: bi("المصانع المحلية", "Local factories"),
};

/** Which beneficiary groups each service is relevant to (proposed mapping). */
const AUDIENCE: Record<string, Aud[]> = {
  "product-registration": ["importers", "factories"],
  "conformity-request": ["importers", "factories", "government"],
  certificates: ["importers", "factories", "government"],
  "shipment-documents": ["importers", "individuals", "government"],
  "application-tracking": ALL,
  "assessment-bodies": ALL,
  regulations: ALL,
  facilities: ["importers", "factories"],
};

export function ServicesList() {
  const { t, isRtl } = useI18n();
  const [tab, setTab] = useState<"all" | Aud>("all");
  const Arrow = isRtl ? ArrowLeft : ArrowRight;
  const items = SERVICES.filter((s) => tab === "all" || AUDIENCE[s.slug]?.includes(tab));
  const count = (a: "all" | Aud) => SERVICES.filter((s) => a === "all" || AUDIENCE[s.slug]?.includes(a)).length;
  const tabs: ("all" | Aud)[] = ["all", ...ALL];

  return (
    <div>
      <div role="tablist" aria-label={t(bi("الفئة", "Audience"))} className="mb-8 flex gap-2 overflow-x-auto border-b border-line pb-px">
        {tabs.map((k) => (
          <button
            key={k}
            role="tab"
            type="button"
            aria-selected={tab === k}
            onClick={() => setTab(k)}
            className={cn("-mb-px shrink-0 border-b-[3px] px-4 py-3 text-[15px] font-semibold transition-colors", tab === k ? "border-flag-red text-navy-900" : "border-transparent text-muted hover:text-navy-900")}
          >
            {k === "all" ? t(bi("الكل", "All")) : t(AUD[k])} <span className="ltr-num text-xs text-muted">({count(k)})</span>
          </button>
        ))}
      </div>
      <ul className="space-y-4">
        {items.map((s) => (
          <li key={s.slug} className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 shadow-card sm:flex-row sm:items-center">
            <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-navy-900 text-white">
              <Icon name={s.icon} size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-navy-900 underline decoration-flag-red decoration-2 underline-offset-8">{t(s.title)}</h2>
              <p className="mt-3 text-sm leading-7 text-muted">{t(s.short)}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {AUDIENCE[s.slug]?.map((a) => (
                  <Badge key={a} tone="navy" dot={false}>{t(AUD[a])}</Badge>
                ))}
              </div>
            </div>
            <Link href={`/services/${s.slug}`} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-navy-900 px-5 py-2.5 text-sm font-semibold text-navy-900 transition-colors hover:bg-navy-900 hover:text-white">
              {t(bi("شرح الخدمة", "Service details"))} <Arrow size={16} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
