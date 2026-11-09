"use client";

import { FileImage, FileText } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { ApplicationStatusBadge, Info, PageHeader, Panel, ProductStatusBadge } from "@/components/dashboard/shared";
import { DemoTag } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { CardSkeleton, EmptyState } from "@/components/ui/States";
import { categoryLabel, countryLabel } from "@/lib/data/reference";
import { useQuery } from "@/lib/hooks/use-demo";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import { formatBytes, formatDate } from "@/lib/utils";

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const q = useQuery(async () => ({ product: await api.products.get(id), apps: await api.applications.list() }), [id]);

  const back = { href: "/dashboard/products", label: t(bi("منتجاتي", "My products")) };
  if (q.error)
    return (
      <div>
        <PageHeader title={t(bi("المنتج", "Product"))} back={back} />
        <EmptyState title={t(bi("المنتج غير موجود", "Product not found"))} action={<Link href="/dashboard/products" className={buttonClasses("outline")}>{t(bi("العودة", "Back"))}</Link>} />
      </div>
    );
  if (!q.data) return <CardSkeleton rows={6} />;
  const { product: p, apps } = q.data;
  const linked = apps.filter((a) => a.productId === p.id);
  const cat = categoryLabel(p.category);
  const country = countryLabel(p.origin);

  return (
    <div>
      <PageHeader
        back={back}
        title={locale === "ar" ? p.nameAr : p.nameEn}
        text={locale === "ar" ? p.nameEn : p.nameAr}
        actions={
          <Link href={`/dashboard/applications/new?product=${p.id}`} className={buttonClasses("primary")}>
            {t(bi("بدء طلب مطابقة", "Start conformity request"))}
          </Link>
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title={t(bi("بيانات المنتج", "Product details"))} action={<ProductStatusBadge status={p.status} />}>
          <dl className="grid gap-5 sm:grid-cols-2">
            <Info label={t(bi("المرجع", "Reference"))}><span dir="ltr">{p.ref}</span> <DemoTag /></Info>
            <Info label={t(bi("الفئة", "Category"))}>{cat ? t(cat) : "-"}</Info>
            <Info label={t(bi("العلامة التجارية", "Brand"))}>{p.brand}</Info>
            <Info label={t(bi("رقم الموديل", "Model"))}><span dir="ltr">{p.model}</span></Info>
            <Info label={t(bi("بلد المنشأ", "Country of origin"))}>{country ? t(country) : p.origin}</Info>
            <Info label={t(bi("المصنّع", "Manufacturer"))}>{p.manufacturer}</Info>
            <Info label={t(bi("رمز النظام المنسق", "HS code"))}><span dir="ltr">{p.hsCode ?? "—"}</span></Info>
            <Info label={t(bi("تاريخ الإضافة", "Added on"))}>{formatDate(p.createdAt, locale)}</Info>
          </dl>
          <p className="mt-5 border-t border-line pt-4 text-sm leading-7 text-muted">{p.description}</p>
        </Panel>

        <div className="space-y-6">
          <Panel title={t(bi("المرفقات", "Attachments"))} padded={false}>
            {p.attachments.length === 0 ? (
              <p className="p-5 text-sm text-muted">{t(bi("لا توجد مرفقات.", "No attachments."))}</p>
            ) : (
              <ul className="divide-y divide-line">
                {p.attachments.map((f) => (
                  <li key={f.id} className="flex items-center gap-3 px-5 py-3">
                    {f.type.startsWith("image/") ? <FileImage size={18} aria-hidden="true" className="text-navy-600" /> : <FileText size={18} aria-hidden="true" className="text-navy-600" />}
                    <span className="min-w-0 flex-1">
                      <span dir="ltr" className="block truncate text-start text-sm font-medium text-navy-900">{f.name}</span>
                      <span className="text-xs text-muted">{formatBytes(f.size)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
          <Panel title={t(bi("الطلبات المرتبطة", "Linked requests"))} padded={false}>
            {linked.length === 0 ? (
              <p className="p-5 text-sm text-muted">{t(bi("لا توجد طلبات لهذا المنتج بعد.", "No requests for this product yet."))}</p>
            ) : (
              <ul className="divide-y divide-line">
                {linked.map((a) => (
                  <li key={a.id}>
                    <Link href={`/dashboard/applications/${a.id}`} className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-surface">
                      <span dir="ltr" className="text-xs font-semibold text-navy-900">{a.ref}</span>
                      <ApplicationStatusBadge status={a.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
