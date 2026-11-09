"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { APPLICATION_STATUS, CERTIFICATE_STATUS, PRODUCT_STATUS, SHIPMENT_STATUS } from "@/lib/data/status";
import { useI18n } from "@/lib/i18n/provider";
import type { ApplicationStatus, CertificateStatus, ProductStatus, ShipmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PageHeader({ title, text, actions, back }: { title: string; text?: string; actions?: ReactNode; back?: { href: string; label: string } }) {
  const { isRtl } = useI18n();
  const Arrow = isRtl ? ArrowRight : ArrowLeft;
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link href={back.href} className="mb-2 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-navy-900">
            <Arrow size={15} aria-hidden="true" /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold text-navy-900 sm:text-[1.65rem]">{title}</h1>
        {text && <p className="mt-1 max-w-2xl text-sm leading-7 text-muted">{text}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </div>
  );
}

export function Panel({ title, action, children, className, padded = true }: { title?: string; action?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cn("rounded-xl border border-line bg-white shadow-card", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
          {title && <h2 className="text-[15px] font-bold text-navy-900">{title}</h2>}
          {action}
        </header>
      )}
      <div className={cn(padded && "p-5")}>{children}</div>
    </section>
  );
}

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const { t } = useI18n();
  const m = APPLICATION_STATUS[status];
  return <Badge tone={m.tone}>{t(m.label)}</Badge>;
}
export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const { t } = useI18n();
  const m = PRODUCT_STATUS[status];
  return <Badge tone={m.tone}>{t(m.label)}</Badge>;
}
export function CertificateStatusBadge({ status }: { status: CertificateStatus }) {
  const { t } = useI18n();
  const m = CERTIFICATE_STATUS[status];
  return <Badge tone={m.tone}>{t(m.label)}</Badge>;
}
export function ShipmentStatusBadge({ status }: { status: ShipmentStatus }) {
  const { t } = useI18n();
  const m = SHIPMENT_STATUS[status];
  return <Badge tone={m.tone}>{t(m.label)}</Badge>;
}

/** Key/value row used in detail views. */
export function Info({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs font-medium text-muted">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-navy-900">{children}</dd>
    </div>
  );
}
