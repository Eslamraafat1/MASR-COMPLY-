"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Boxes, Building2, ClipboardList, FolderTree, Package, Scale, Search } from "lucide-react";
import { Badge, DemoTag } from "@/components/ui/Badge";
import { EmptyState, Skeleton } from "@/components/ui/States";
import { APPLICATION_STATUS } from "@/lib/data/status";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import { Notice } from "./Catalogues";

type Result = Awaited<ReturnType<typeof api.search.all>>;
type Tab = keyof Result | "all";

const TABS: { id: Tab; label: ReturnType<typeof bi> }[] = [
  { id: "all", label: bi("الكل", "All") },
  { id: "products", label: bi("المنتجات", "Products") },
  { id: "categories", label: bi("الفئات", "Categories") },
  { id: "regulations", label: bi("اللوائح", "Regulations") },
  { id: "standards", label: bi("المواصفات", "Standards") },
  { id: "bodies", label: bi("جهات التقييم", "Bodies") },
  { id: "applications", label: bi("الطلبات", "Applications") },
];

function Group({ title, icon: I, children }: { title: string; icon: typeof Package; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-navy-900">
        <I size={17} className="text-flag-green" aria-hidden="true" /> {title}
      </h3>
      <ul className="grid gap-3 md:grid-cols-2">{children}</ul>
    </section>
  );
}
const Row = ({ href, children }: { href?: string; children: React.ReactNode }) => (
  <li>
    {href ? (
      <Link href={href} className="block h-full rounded-xl border border-line bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-navy-900/25 hover:shadow-card">
        {children}
      </Link>
    ) : (
      <div className="h-full rounded-xl border border-line bg-white p-4">{children}</div>
    )}
  </li>
);

export function SearchExplorer({ initial = "" }: { initial?: string }) {
  const { t, locale } = useI18n();
  const [q, setQ] = useState(initial);
  const [tab, setTab] = useState<Tab>("all");
  const [res, setRes] = useState<{ q: string; data: Result }>();
  const data = res?.data;
  const loading = res?.q !== q;

  useEffect(() => {
    let alive = true;
    const id = setTimeout(() => {
      api.search.all(q).then((r) => {
        if (alive) setRes({ q, data: r });
      });
    }, 200);
    return () => {
      alive = false;
      clearTimeout(id);
    };
  }, [q]);

  const count = (k: keyof Result) => data?.[k].length ?? 0;
  const total = data ? (Object.keys(data) as (keyof Result)[]).reduce((n, k) => n + data[k].length, 0) : 0;
  const show = (k: keyof Result) => tab === "all" || tab === k;

  return (
    <div>
      <Notice />
      <div className="relative">
        <Search size={20} aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(bi("ابحث عن منتج أو لائحة أو مواصفة أو جهة تقييم أو طلب…", "Search products, regulations, standards, bodies or requests…"))} aria-label={t(bi("بحث", "Search"))} className="field !min-h-14 !ps-12 text-base" />
      </div>
      {!q && (
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted">
          {t(bi("اقتراحات:", "Try:"))}
          {["غلاية", "8516", "IEC 60335", "DEMO-APP-2026-0005", t(bi("ألعاب", "Toys"))].map((s) => (
            <button key={s} type="button" onClick={() => setQ(s)} className="rounded-full border border-line bg-white px-3 py-1 text-xs font-medium text-navy-800 hover:bg-surface">
              {s}
            </button>
          ))}
        </p>
      )}

      <div role="tablist" aria-label={t(bi("نوع النتائج", "Result type"))} className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {TABS.map((x) => {
          const n = x.id === "all" ? total : count(x.id);
          return (
            <button key={x.id} role="tab" aria-selected={tab === x.id} type="button" onClick={() => setTab(x.id)} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors", tab === x.id ? "border-navy-900 bg-navy-900 text-white" : "border-line bg-white hover:border-navy-900/40")}>
              {t(x.label)}
              <span className={cn("ltr-num rounded-full px-1.5 text-xs font-bold", tab === x.id ? "bg-white/20" : "bg-navy-50 text-navy-800")}>{n}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-6" aria-live="polite">
        {loading && !data ? (
          <div className="space-y-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        ) : data && (tab === "all" ? total : count(tab as keyof Result)) === 0 ? (
          <EmptyState title={t(bi("لا توجد نتائج مطابقة", "No matching results"))} text={t(bi("تحقق من الكتابة أو جرّب كلمة أعم، أو اختر نوع نتائج آخر.", "Check the spelling, try a broader word, or choose another result type."))} />
        ) : (
          data && (
            <div className={cn(loading && "opacity-60 transition-opacity")}>
              {show("products") && count("products") > 0 && (
                <Group title={t(bi("المنتجات (بيانات تجريبية)", "Products (demo data)"))} icon={Package}>
                  {data.products.map((p) => (
                    <Row key={p.id} href={`/dashboard/products/${p.id}`}>
                      <div className="flex items-center justify-between gap-2"><p className="font-semibold text-navy-900">{locale === "ar" ? p.nameAr : p.nameEn}</p><DemoTag /></div>
                      <p dir="ltr" className="mt-1 text-start text-xs text-muted">{p.ref} · {p.brand} {p.model}</p>
                    </Row>
                  ))}
                </Group>
              )}
              {show("categories") && count("categories") > 0 && (
                <Group title={t(bi("فئات المنتجات", "Product categories"))} icon={FolderTree}>
                  {data.categories.map((c) => <Row key={c.id}><p className="font-semibold text-navy-900">{t(c.title)}</p></Row>)}
                </Group>
              )}
              {show("regulations") && count("regulations") > 0 && (
                <Group title={t(bi("اللوائح الفنية (مقترحة)", "Technical regulations (proposed)"))} icon={Scale}>
                  {data.regulations.map((r) => <Row key={r.id} href="/regulations"><span dir="ltr" className="text-xs font-bold text-navy-700">{r.code}</span><p className="mt-1 font-semibold text-navy-900">{t(r.title)}</p></Row>)}
                </Group>
              )}
              {show("standards") && count("standards") > 0 && (
                <Group title={t(bi("المواصفات", "Standards"))} icon={Boxes}>
                  {data.standards.map((r) => <Row key={r.id} href="/regulations"><span dir="ltr" className="text-xs font-bold text-navy-700">{r.code}</span><p className="mt-1 font-semibold text-navy-900">{t(r.title)}</p></Row>)}
                </Group>
              )}
              {show("bodies") && count("bodies") > 0 && (
                <Group title={t(bi("جهات التقييم (تجريبية)", "Assessment bodies (demo)"))} icon={Building2}>
                  {data.bodies.map((b) => <Row key={b.id} href="/assessment-bodies"><p className="font-semibold text-navy-900">{t(b.name)}</p><p className="mt-1 text-xs text-muted">{t(b.city)} · {b.scopes.map((s) => t(s)).join("، ")}</p></Row>)}
                </Group>
              )}
              {show("applications") && count("applications") > 0 && (
                <Group title={t(bi("الطلبات (بيانات تجريبية)", "Applications (demo data)"))} icon={ClipboardList}>
                  {data.applications.map((a) => (
                    <Row key={a.id} href={`/track?ref=${a.ref}`}>
                      <div className="flex items-center justify-between gap-2"><span dir="ltr" className="text-xs font-bold text-navy-700">{a.ref}</span><Badge tone={APPLICATION_STATUS[a.status].tone}>{t(APPLICATION_STATUS[a.status].label)}</Badge></div>
                      <p className="mt-1 font-semibold text-navy-900">{t(a.productName)}</p>
                    </Row>
                  ))}
                </Group>
              )}
              {tab === "all" && !q && <p className="text-xs text-muted">{t(bi("اكتب كلمة للبدء — النتائج أعلاه عينة من المحتوى المتاح.", "Type to start — results above are a sample of the available content."))}</p>}
            </div>
          )
        )}
      </div>
    </div>
  );
}
