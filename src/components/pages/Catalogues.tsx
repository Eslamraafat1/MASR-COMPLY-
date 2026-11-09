"use client";

import { Building2, Mail, MapPin, Scale, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { ASSESSMENT_BODIES, HS_CODES, REGULATIONS } from "@/lib/data/reference";
import { PROPOSED_NOTICE } from "@/lib/data/content";
import { bi, type Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

export function Notice({ children }: { children?: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <p className="mb-6 flex items-start gap-3 rounded-xl border border-gold/30 bg-gold-soft px-4 py-3 text-sm leading-7 text-[#6b5116]">
      <ShieldCheck size={18} className="mt-1 shrink-0" aria-hidden="true" />
      <span>{children ?? t(PROPOSED_NOTICE)}</span>
    </p>
  );
}

export function SearchBox({ value, onChange, placeholder, suggestions = [] }: { value: string; onChange: (v: string) => void; placeholder: string; suggestions?: string[] }) {
  const { t } = useI18n();
  return (
    <div>
      <div className="relative">
        <Search size={19} aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="field !min-h-12 !ps-12 text-base" />
      </div>
      {suggestions.length > 0 && !value && (
        <p className="mt-2.5 flex flex-wrap items-center gap-2 text-sm text-muted">
          <span>{t(bi("اقتراحات:", "Try:"))}</span>
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => onChange(s)} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy-800 hover:border-navy-900/40 hover:bg-surface">
              {s}
            </button>
          ))}
        </p>
      )}
    </div>
  );
}

function Chips<T extends string>({ options, value, onChange, label }: { options: { value: T; label: Bi }[]; value: T; onChange: (v: T) => void; label: string }) {
  const { t } = useI18n();
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button key={o.value} type="button" aria-pressed={value === o.value} onClick={() => onChange(o.value)} className={cn("rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", value === o.value ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white text-ink/80 hover:border-navy-900/40")}>
          {t(o.label)}
        </button>
      ))}
    </div>
  );
}

const match = (q: string, ...xs: string[]) => !q.trim() || xs.some((x) => x.toLowerCase().includes(q.trim().toLowerCase()));

/* ───────── Technical regulations & standards ───────── */
export function RegulationsExplorer() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const [kind, setKind] = useState<"all" | "regulation" | "standard">("all");
  const rows = useMemo(() => REGULATIONS.filter((r) => (kind === "all" || r.kind === kind) && match(q, r.title.ar, r.title.en, r.code, r.sector.ar, r.sector.en)), [q, kind]);
  return (
    <div>
      <Notice />
      <SearchBox value={q} onChange={setQ} placeholder={t(bi("ابحث بالاسم أو الرمز أو القطاع…", "Search by name, code or sector…"))} suggestions={[t(bi("كهربائية", "Electrical")), "IEC", t(bi("ألعاب", "Toys"))]} />
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <Chips label={t(bi("النوع", "Type"))} value={kind} onChange={setKind} options={[{ value: "all", label: bi("الكل", "All") }, { value: "regulation", label: bi("لوائح فنية", "Regulations") }, { value: "standard", label: bi("مواصفات", "Standards") }]} />
        <p className="text-sm text-muted" aria-live="polite">
          <span className="ltr-num font-semibold text-navy-900">{rows.length}</span> {t(bi("نتيجة", "results"))}
        </p>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-col rounded-xl border border-line bg-white p-5 shadow-card">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span dir="ltr" className="rounded-md bg-navy-50 px-2 py-0.5 text-xs font-bold tracking-wide text-navy-800">{r.code}</span>
              <Badge tone={r.kind === "regulation" ? "info" : "navy"} dot={false}>{r.kind === "regulation" ? t(bi("لائحة فنية", "Regulation")) : t(bi("مواصفة", "Standard"))}</Badge>
              <Badge tone="warning" dot={false}>{t(bi("بانتظار التحقق", "Pending verification"))}</Badge>
            </div>
            <h3 className="text-base font-bold leading-7 text-navy-900">{t(r.title)}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-7 text-muted">{t(r.summary)}</p>
            <p className="mt-3 flex items-center gap-1.5 border-t border-line pt-3 text-xs text-muted">
              <Scale size={14} aria-hidden="true" /> {t(r.sector)}
            </p>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <EmptyState title={t(bi("لا توجد نتائج", "No results"))} text={t(bi("جرّب كلمة أخرى أو غيّر النوع.", "Try another keyword or change the type."))} />}
    </div>
  );
}

/* ───────── HS codes ───────── */
export function HsExplorer() {
  const { t } = useI18n();
  const [q, setQ] = useState("");
  const rows = useMemo(() => HS_CODES.filter((h) => match(q, h.code, h.title.ar, h.title.en, h.chapter.ar, h.chapter.en)), [q]);
  return (
    <div>
      <Notice>
        {t(bi("رموز النظام المنسق هنا عناوين عامة على مستوى 4 أرقام لأغراض الإرشاد فقط. التصنيف الجمركي الملزم يُحدده الجهات المختصة.", "HS entries here are general 4-digit headings for guidance only. Binding customs classification is determined by the competent authorities."))}
      </Notice>
      <SearchBox value={q} onChange={setQ} placeholder={t(bi("ابحث برمز أو وصف المنتج…", "Search by code or product description…"))} suggestions={["8516", t(bi("ثلاجات", "refrigerators")), "LED"]} />
      <div className="mt-6 overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <ul className="divide-y divide-line">
          {rows.map((h) => (
            <li key={h.code} className="flex flex-col gap-1.5 px-5 py-4 sm:flex-row sm:items-center sm:gap-6">
              <span dir="ltr" className="w-fit rounded-lg bg-navy-900 px-3 py-1.5 text-center text-sm font-bold tracking-widest text-white sm:w-24">{h.code}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy-900">{t(h.title)}</p>
                <p className="text-sm text-muted">{t(h.chapter)}</p>
              </div>
              <Link href={`/dashboard/products/new?hs=${h.code}`} className="text-sm font-semibold text-flag-green hover:underline">
                {t(bi("استخدمه في تسجيل منتج", "Use in product registration"))}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {rows.length === 0 && <div className="mt-6"><EmptyState title={t(bi("لا توجد رموز مطابقة", "No matching codes"))} text={t(bi("جرّب رمزاً من 4 أرقام أو كلمة وصفية.", "Try a 4-digit code or a descriptive word."))} /></div>}
    </div>
  );
}

/* ───────── Assessment bodies ───────── */
export function BodiesExplorer() {
  const { t, locale } = useI18n();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("all");
  const cities = useMemo(() => Array.from(new Set(ASSESSMENT_BODIES.map((b) => b.city.en))), []);
  const rows = useMemo(
    () => ASSESSMENT_BODIES.filter((b) => (city === "all" || b.city.en === city) && match(q, b.name.ar, b.name.en, b.city.ar, b.city.en, ...b.scopes.flatMap((s) => [s.ar, s.en]))),
    [q, city],
  );
  return (
    <div>
      <Notice>{t(bi("جميع الجهات الظاهرة أسماء تجريبية (DEMO) لتوضيح التجربة، ولا تمثل جهات حقيقية أو معتمدة.", "All bodies shown are illustrative (DEMO) names and do not represent real or accredited bodies."))}</Notice>
      <div className="grid gap-3 sm:grid-cols-[1fr_14rem]">
        <SearchBox value={q} onChange={setQ} placeholder={t(bi("ابحث باسم الجهة أو المجال أو المدينة…", "Search by name, scope or city…"))} suggestions={[t(bi("كهربائية", "Electrical")), t(bi("منسوجات", "Textiles")), t(bi("القاهرة", "Cairo"))]} />
        <select className="field !min-h-12" value={city} onChange={(e) => setCity(e.target.value)} aria-label={t(bi("المدينة", "City"))}>
          <option value="all">{t(bi("كل المدن", "All cities"))}</option>
          {cities.map((c) => (
            <option key={c} value={c}>{ASSESSMENT_BODIES.find((b) => b.city.en === c)!.city[locale]}</option>
          ))}
        </select>
      </div>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {rows.map((b) => (
          <li key={b.id} className="rounded-xl border border-line bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-800"><Building2 size={22} aria-hidden="true" /></span>
              <div className="min-w-0">
                <h3 className="text-base font-bold leading-7 text-navy-900">{t(b.name)}</h3>
                <p className="flex items-center gap-1.5 text-sm text-muted"><MapPin size={14} aria-hidden="true" /> {t(b.city)}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {b.scopes.map((s, i) => <Badge key={i} tone="success" dot={false}>{t(s)}</Badge>)}
            </div>
            <p className="mt-3 text-xs text-muted">{t(b.accreditation)}</p>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
              <span dir="ltr" className="flex items-center gap-1.5 text-xs text-muted"><Mail size={13} aria-hidden="true" /> {b.email}</span>
              <LinkButton href={`/dashboard/applications/new?body=${b.id}`} size="sm" variant="secondary">{t(bi("اختر عند تقديم طلب", "Select when applying"))}</LinkButton>
            </div>
          </li>
        ))}
      </ul>
      {rows.length === 0 && <EmptyState title={t(bi("لا توجد جهات مطابقة", "No matching bodies"))} text={t(bi("جرّب مجالاً أو مدينة أخرى.", "Try another scope or city."))} />}
    </div>
  );
}
