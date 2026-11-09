"use client";

import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/dashboard/shared";
import { DemoTag } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { ASSESSMENT_BODIES } from "@/lib/data/reference";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

export default function BodiesPage() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const [scope, setScope] = useState("all");

  const cities = useMemo(() => Array.from(new Set(ASSESSMENT_BODIES.map((b) => b.city.en))).map((en) => ASSESSMENT_BODIES.find((b) => b.city.en === en)!.city), []);
  const scopes = useMemo(() => {
    const m = new Map<string, ReturnType<typeof bi>>();
    ASSESSMENT_BODIES.forEach((b) => b.scopes.forEach((s) => m.set(s.en, s)));
    return Array.from(m.values());
  }, []);

  const list = ASSESSMENT_BODIES.filter((b) => {
    const text = `${b.name.ar} ${b.name.en} ${b.city.ar} ${b.city.en}`.toLowerCase();
    return (!q.trim() || text.includes(q.trim().toLowerCase())) && (city === "all" || b.city.en === city) && (scope === "all" || b.scopes.some((s) => s.en === scope));
  });

  return (
    <>
      <PageHeader
        title={t(bi("جهات التقييم", "Assessment bodies"))}
        text={t(bi("دليل تجريبي لجهات التقييم — البيانات توضيحية وتنتظر التحقق الرسمي.", "Illustrative directory of assessment bodies — data is demonstration content pending official verification."))}
      />
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 shadow-card sm:flex-row">
        <div className="relative flex-1">
          <Search size={17} aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} className="field !ps-10" placeholder={t(bi("ابحث بالاسم أو المدينة…", "Search by name or city…"))} aria-label={t(bi("بحث", "Search"))} />
        </div>
        <select className="field sm:!w-48" value={city} onChange={(e) => setCity(e.target.value)} aria-label={t(bi("المدينة", "City"))}>
          <option value="all">{t(bi("كل المدن", "All cities"))}</option>
          {cities.map((c) => <option key={c.en} value={c.en}>{t(c)}</option>)}
        </select>
        <select className="field sm:!w-52" value={scope} onChange={(e) => setScope(e.target.value)} aria-label={t(bi("النطاق", "Scope"))}>
          <option value="all">{t(bi("كل النطاقات", "All scopes"))}</option>
          {scopes.map((s) => <option key={s.en} value={s.en}>{t(s)}</option>)}
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title={t(bi("لا توجد جهات مطابقة", "No matching bodies"))} text={t(bi("جرّب تغيير عوامل التصفية.", "Try changing the filters."))} />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {list.map((b) => (
            <li key={b.id} className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-card transition-shadow hover:shadow-lift">
              <div className="mb-3 flex items-start justify-between gap-3">
                <h2 className="text-[15.5px] font-bold leading-7 text-navy-900">{t(b.name)}</h2>
                <DemoTag />
              </div>
              <p className="mb-3 flex items-center gap-1.5 text-sm text-muted"><MapPin size={15} aria-hidden="true" /> {t(b.city)}</p>
              <ul className="mb-3 flex flex-wrap gap-1.5">
                {b.scopes.map((s) => <li key={s.en} className="rounded-full bg-navy-50 px-2.5 py-0.5 text-xs font-semibold text-navy-800">{t(s)}</li>)}
              </ul>
              <p className="mb-5 text-xs text-muted">{t(b.accreditation)}</p>
              <LinkButton href={`/dashboard/applications/new?body=${b.id}`} variant="outline" size="sm" className="mt-auto">
                {t(bi("بدء طلب مع هذه الجهة", "Start a request with this body"))}
              </LinkButton>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
