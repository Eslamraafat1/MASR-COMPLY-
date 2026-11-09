"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { ApplicationStatusBadge, PageHeader } from "@/components/dashboard/shared";
import { LinkButton } from "@/components/ui/Button";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { ErrorState, CardSkeleton } from "@/components/ui/States";
import { APPLICATION_STATUS } from "@/lib/data/status";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { api } from "@/lib/services/api";
import type { Application, ApplicationStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const TYPES = {
  conformity: bi("طلب مطابقة", "Conformity"),
  assessment: bi("طلب تقييم", "Assessment"),
  renewal: bi("تجديد", "Renewal"),
};

export default function ApplicationsPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.applications.list(), []);

  const columns: Column<Application>[] = [
    {
      key: "ref",
      header: bi("الرقم المرجعي", "Reference"),
      primary: true,
      sort: (a) => a.ref,
      cell: (a) => (
        <Link href={`/dashboard/applications/${a.id}`} className="font-semibold text-navy-900 underline-offset-4 hover:underline">
          <span dir="ltr" className="ltr-num">{a.ref}</span>
        </Link>
      ),
    },
    { key: "product", header: bi("المنتج", "Product"), sort: (a) => t(a.productName), cell: (a) => t(a.productName) },
    { key: "type", header: bi("النوع", "Type"), sort: (a) => t(TYPES[a.type]), cell: (a) => t(TYPES[a.type]) },
    { key: "status", header: bi("الحالة", "Status"), sort: (a) => APPLICATION_STATUS[a.status].order, cell: (a) => <ApplicationStatusBadge status={a.status} /> },
    { key: "date", header: bi("آخر تحديث", "Last updated"), sort: (a) => a.updatedAt, cell: (a) => <span className="ltr-num">{formatDate(a.updatedAt, locale)}</span> },
  ];

  const filters: TableFilter<Application>[] = [
    {
      key: "status",
      label: bi("الحالة", "Status"),
      options: (Object.keys(APPLICATION_STATUS) as ApplicationStatus[]).map((k) => ({ value: k, label: APPLICATION_STATUS[k].label })),
      match: (a, v) => a.status === v,
    },
    {
      key: "type",
      label: bi("النوع", "Type"),
      options: Object.entries(TYPES).map(([value, label]) => ({ value, label })),
      match: (a, v) => a.type === v,
    },
  ];

  return (
    <>
      <PageHeader
        title={t(bi("طلبات تقييم المطابقة", "Conformity requests"))}
        text={t(bi("تابع جميع طلباتك التجريبية وحالاتها في مكان واحد.", "Follow all your demo requests and their statuses in one place."))}
        actions={
          <LinkButton href="/dashboard/applications/new" variant="accent">
            <Plus size={17} aria-hidden="true" /> {t(bi("طلب جديد", "New request"))}
          </LinkButton>
        }
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : q.loading || !q.data ? (
        <CardSkeleton rows={6} />
      ) : (
        <DataTable
          rows={q.data}
          columns={columns}
          rowId={(a) => a.id}
          rowHref={(a) => `/dashboard/applications/${a.id}`}
          searchText={(a) => `${a.ref} ${a.productName.ar} ${a.productName.en}`}
          filters={filters}
          caption={bi("جدول طلبات المطابقة", "Conformity requests table")}
        />
      )}
    </>
  );
}
