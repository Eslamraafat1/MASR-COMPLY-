"use client";

import Link from "next/link";
import { CertificateStatusBadge, PageHeader } from "@/components/dashboard/shared";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { DemoTag } from "@/components/ui/Badge";
import { CardSkeleton, ErrorState } from "@/components/ui/States";
import { CERTIFICATE_STATUS } from "@/lib/data/status";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { api } from "@/lib/services/api";
import type { Certificate, CertificateStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function CertificatesPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.certificates.list(), []);

  const columns: Column<Certificate>[] = [
    {
      key: "ref",
      header: bi("رقم الشهادة", "Certificate no."),
      primary: true,
      sort: (c) => c.ref,
      cell: (c) => (
        <Link href={`/dashboard/certificates/${c.id}`} className="inline-flex items-center gap-2 font-semibold text-navy-900 underline-offset-4 hover:underline">
          <span dir="ltr" className="ltr-num">{c.ref}</span> <DemoTag />
        </Link>
      ),
    },
    { key: "product", header: bi("المنتج", "Product"), sort: (c) => t(c.productName), cell: (c) => t(c.productName) },
    { key: "issued", header: bi("تاريخ الإصدار", "Issued"), sort: (c) => c.issuedAt, cell: (c) => <span className="ltr-num">{formatDate(c.issuedAt, locale)}</span> },
    { key: "expires", header: bi("تاريخ الانتهاء", "Expires"), sort: (c) => c.expiresAt, cell: (c) => <span className="ltr-num">{formatDate(c.expiresAt, locale)}</span> },
    { key: "status", header: bi("الحالة", "Status"), sort: (c) => c.status, cell: (c) => <CertificateStatusBadge status={c.status} /> },
  ];
  const filters: TableFilter<Certificate>[] = [
    {
      key: "status",
      label: bi("الحالة", "Status"),
      options: (Object.keys(CERTIFICATE_STATUS) as CertificateStatus[]).map((k) => ({ value: k, label: CERTIFICATE_STATUS[k].label })),
      match: (c, v) => c.status === v,
    },
  ];

  return (
    <>
      <PageHeader
        title={t(bi("الشهادات", "Certificates"))}
        text={t(bi("شهادات تجريبية للمعاينة فقط وليست ذات حجية قانونية.", "Demonstration certificates for preview only, with no legal validity."))}
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : q.loading || !q.data ? (
        <CardSkeleton rows={5} />
      ) : (
        <DataTable
          rows={q.data}
          columns={columns}
          rowId={(c) => c.id}
          rowHref={(c) => `/dashboard/certificates/${c.id}`}
          searchText={(c) => `${c.ref} ${c.productName.ar} ${c.productName.en}`}
          filters={filters}
          caption={bi("جدول الشهادات", "Certificates table")}
        />
      )}
    </>
  );
}
