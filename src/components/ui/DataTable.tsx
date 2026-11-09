"use client";

import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsUpDown, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { bi, type Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn, formatNumber } from "@/lib/utils";
import { EmptyState } from "./States";

export type Column<T> = {
  key: string;
  header: Bi;
  cell: (row: T) => ReactNode;
  /** Provide to make the column sortable. */
  sort?: (row: T) => string | number;
  className?: string;
  /** Primary column becomes the card title on mobile. */
  primary?: boolean;
};

export type TableFilter<T> = {
  key: string;
  label: Bi;
  options: { value: string; label: Bi }[];
  match: (row: T, value: string) => boolean;
};

type Props<T> = {
  rows: T[];
  columns: Column<T>[];
  rowId: (row: T) => string;
  /** Text used by the search box. */
  searchText?: (row: T) => string;
  filters?: TableFilter<T>[];
  pageSize?: number;
  rowHref?: (row: T) => string;
  rowAction?: (row: T) => ReactNode;
  caption: Bi;
  emptyTitle?: Bi;
  toolbar?: ReactNode;
};

export function DataTable<T>({ rows, columns, rowId, searchText, filters = [], pageSize = 8, rowHref, rowAction, caption, emptyTitle, toolbar }: Props<T>) {
  const { t, locale, isRtl } = useI18n();
  const [q, setQ] = useState("");
  const [fv, setFv] = useState<Record<string, string>>({});
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let out = rows;
    if (q.trim() && searchText) out = out.filter((r) => searchText(r).toLowerCase().includes(q.trim().toLowerCase()));
    for (const f of filters) {
      const v = fv[f.key];
      if (v && v !== "all") out = out.filter((r) => f.match(r, v));
    }
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sort) {
        const get = col.sort;
        out = [...out].sort((a, b) => {
          const x = get(a);
          const y = get(b);
          const r = typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), locale);
          return sort.dir === "asc" ? r : -r;
        });
      }
    }
    return out;
  }, [rows, q, fv, sort, columns, filters, searchText, locale]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const cur = Math.min(page, pages);
  const slice = filtered.slice((cur - 1) * pageSize, cur * pageSize);
  const from = filtered.length === 0 ? 0 : (cur - 1) * pageSize + 1;
  const to = Math.min(cur * pageSize, filtered.length);
  const Prev = isRtl ? ChevronRight : ChevronLeft;
  const Next = isRtl ? ChevronLeft : ChevronRight;

  const toggleSort = (key: string) => {
    setPage(1);
    setSort((s) => (s?.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null));
  };
  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary);

  return (
    <div className="rounded-xl border border-line bg-white shadow-card">
      {(searchText || filters.length > 0 || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:flex-wrap sm:items-center">
          {searchText && (
            <div className="relative min-w-0 flex-1 sm:min-w-[220px]">
              <Search aria-hidden="true" size={17} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                placeholder={t(bi("ابحث…", "Search…"))}
                aria-label={t(bi("بحث في الجدول", "Search table"))}
                className="field !ps-10"
              />
            </div>
          )}
          {filters.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm text-muted">
              <span className="sr-only sm:not-sr-only">{t(f.label)}</span>
              <select
                className="field !w-auto min-w-[9.5rem]"
                value={fv[f.key] ?? "all"}
                onChange={(e) => {
                  setFv((s) => ({ ...s, [f.key]: e.target.value }));
                  setPage(1);
                }}
              >
                <option value="all">{t(bi("الكل", "All"))}</option>
                {f.options.map((o) => (
                  <option key={o.value} value={o.value}>
                    {t(o.label)}
                  </option>
                ))}
              </select>
            </label>
          ))}
          {toolbar && <div className="sm:ms-auto">{toolbar}</div>}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="p-6">
          <EmptyState title={t(emptyTitle ?? bi("لا توجد نتائج مطابقة", "No matching results"))} text={t(bi("جرّب تعديل البحث أو إزالة عوامل التصفية.", "Try changing your search or clearing the filters."))} />
        </div>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[640px] border-collapse text-start text-sm">
              <caption className="sr-only">{t(caption)}</caption>
              <thead>
                <tr className="bg-surface text-xs font-semibold uppercase tracking-wide text-muted">
                  {columns.map((c) => {
                    const active = sort?.key === c.key;
                    return (
                      <th key={c.key} scope="col" aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : c.sort ? "none" : undefined} className={cn("px-4 py-3 text-start font-semibold", c.className)}>
                        {c.sort ? (
                          <button type="button" onClick={() => toggleSort(c.key)} className="inline-flex items-center gap-1.5 rounded hover:text-navy-900">
                            {t(c.header)}
                            {active ? sort!.dir === "asc" ? <ArrowUp size={13} aria-hidden="true" /> : <ArrowDown size={13} aria-hidden="true" /> : <ChevronsUpDown size={13} aria-hidden="true" className="opacity-50" />}
                          </button>
                        ) : (
                          t(c.header)
                        )}
                      </th>
                    );
                  })}
                  {rowAction && (
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">{t(bi("إجراءات", "Actions"))}</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {slice.map((r) => (
                  <tr key={rowId(r)} className="transition-colors hover:bg-surface/70">
                    {columns.map((c) => (
                      <td key={c.key} className={cn("px-4 py-3.5 align-middle text-ink", c.className)}>
                        {c.cell(r)}
                      </td>
                    ))}
                    {rowAction && <td className="px-4 py-3.5 text-end">{rowAction(r)}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-line md:hidden">
            {slice.map((r) => {
              const href = rowHref?.(r);
              const head = <span className="text-[15px] font-semibold text-navy-900">{primary.cell(r)}</span>;
              return (
                <li key={rowId(r)} className="p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    {href ? (
                      <Link href={href} className="min-w-0 underline-offset-4 hover:underline">
                        {head}
                      </Link>
                    ) : (
                      head
                    )}
                    {rowAction && <div className="shrink-0">{rowAction(r)}</div>}
                  </div>
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
                    {rest.map((c) => (
                      <div key={c.key} className="min-w-0">
                        <dt className="text-xs text-muted">{t(c.header)}</dt>
                        <dd className="mt-0.5 break-words text-ink">{c.cell(r)}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-col items-center justify-between gap-3 border-t border-line px-4 py-3 text-sm text-muted sm:flex-row">
            <p aria-live="polite">
              {t(bi("عرض", "Showing"))} <span className="ltr-num font-semibold text-navy-900">{formatNumber(from, locale)}–{formatNumber(to, locale)}</span> {t(bi("من", "of"))}{" "}
              <span className="ltr-num font-semibold text-navy-900">{formatNumber(filtered.length, locale)}</span>
            </p>
            {pages > 1 && (
              <nav aria-label={t(bi("ترقيم الصفحات", "Pagination"))} className="flex items-center gap-1">
                <button type="button" disabled={cur === 1} onClick={() => setPage(cur - 1)} aria-label={t(bi("السابق", "Previous"))} className="grid size-9 place-items-center rounded-lg border border-line enabled:hover:bg-surface disabled:opacity-40">
                  <Prev size={16} aria-hidden="true" />
                </button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button key={i} type="button" onClick={() => setPage(i + 1)} aria-current={cur === i + 1 ? "page" : undefined} className={cn("grid size-9 place-items-center rounded-lg text-sm font-semibold", cur === i + 1 ? "bg-navy-900 text-white" : "hover:bg-surface")}>
                    <span className="ltr-num">{i + 1}</span>
                  </button>
                ))}
                <button type="button" disabled={cur === pages} onClick={() => setPage(cur + 1)} aria-label={t(bi("التالي", "Next"))} className="grid size-9 place-items-center rounded-lg border border-line enabled:hover:bg-surface disabled:opacity-40">
                  <Next size={16} aria-hidden="true" />
                </button>
              </nav>
            )}
          </div>
        </>
      )}
    </div>
  );
}
