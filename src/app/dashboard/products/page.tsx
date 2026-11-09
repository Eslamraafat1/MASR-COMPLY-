"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader, ProductStatusBadge } from "@/components/dashboard/shared";
import { buttonClasses } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { CATEGORIES, categoryLabel, countryLabel } from "@/lib/data/reference";
import { PRODUCT_STATUS } from "@/lib/data/status";
import { useQuery } from "@/lib/hooks/use-demo";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import type { Product } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function ProductsPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.products.list(), []);

  const name = (p: Product) => (locale === "ar" ? p.nameAr : p.nameEn);
  const columns: Column<Product>[] = [
    {
      key: "name",
      header: bi("المنتج", "Product"),
      primary: true,
      sort: (p) => name(p),
      cell: (p) => (
        <Link href={`/dashboard/products/${p.id}`} className="font-semibold text-navy-900 underline-offset-4 hover:underline">
          {name(p)}
        </Link>
      ),
    },
    { key: "ref", header: bi("المرجع", "Reference"), cell: (p) => <span dir="ltr" className="text-xs">{p.ref}</span> },
    { key: "cat", header: bi("الفئة", "Category"), sort: (p) => t(categoryLabel(p.category) ?? bi("-", "-")), cell: (p) => t(categoryLabel(p.category) ?? bi("-", "-")) },
    { key: "brand", header: bi("العلامة", "Brand"), sort: (p) => p.brand, cell: (p) => p.brand },
    { key: "origin", header: bi("المنشأ", "Origin"), cell: (p) => t(countryLabel(p.origin) ?? bi(p.origin, p.origin)) },
    { key: "date", header: bi("تاريخ الإضافة", "Added"), sort: (p) => p.createdAt, cell: (p) => formatDate(p.createdAt, locale) },
    { key: "status", header: bi("الحالة", "Status"), cell: (p) => <ProductStatusBadge status={p.status} /> },
  ];

  return (
    <div>
      <PageHeader
        title={t(bi("منتجاتي", "My products"))}
        text={t(bi("سجل المنتجات الخاص بك (بيانات تجريبية).", "Your product register (demo data)."))}
        actions={
          <Link href="/dashboard/products/new" className={buttonClasses("primary")}>
            <Plus size={17} aria-hidden="true" /> {t(bi("تسجيل منتج جديد", "Register product"))}
          </Link>
        }
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : !q.data ? (
        <CardSkeleton rows={6} />
      ) : q.data.length === 0 ? (
        <EmptyState title={t(bi("لا توجد منتجات بعد", "No products yet"))} text={t(bi("ابدأ بتسجيل أول منتج.", "Start by registering your first product."))} action={<Link href="/dashboard/products/new" className={buttonClasses("primary")}>{t(bi("تسجيل منتج", "Register product"))}</Link>} />
      ) : (
        <DataTable
          rows={q.data}
          columns={columns}
          rowId={(p) => p.id}
          rowHref={(p) => `/dashboard/products/${p.id}`}
          caption={bi("جدول المنتجات", "Products table")}
          searchText={(p) => `${p.nameAr} ${p.nameEn} ${p.brand} ${p.model} ${p.ref}`}
          filters={[
            { key: "cat", label: bi("الفئة", "Category"), options: CATEGORIES.map((c) => ({ value: c.id, label: c.title })), match: (p, v) => p.category === v },
            { key: "status", label: bi("الحالة", "Status"), options: (Object.keys(PRODUCT_STATUS) as (keyof typeof PRODUCT_STATUS)[]).map((k) => ({ value: k, label: PRODUCT_STATUS[k].label })), match: (p, v) => p.status === v },
          ]}
        />
      )}
    </div>
  );
}
