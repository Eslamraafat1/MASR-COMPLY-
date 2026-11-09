"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader, ShipmentStatusBadge } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column, type TableFilter } from "@/components/ui/DataTable";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { CardSkeleton, ErrorState } from "@/components/ui/States";
import { COUNTRIES, countryLabel } from "@/lib/data/reference";
import { SHIPMENT_STATUS } from "@/lib/data/status";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { shipmentSchema, type ShipmentInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import type { Shipment, ShipmentStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function NewShipmentDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, locale } = useI18n();
  const [busy, setBusy] = useState<"draft" | "submit" | null>(null);
  const { register, handleSubmit, formState, reset, trigger, getValues } = useForm<ShipmentInput>({
    // z.coerce makes the input type `unknown`, hence the cast
    resolver: zodResolver(shipmentSchema) as never,
    defaultValues: { description: "", origin: "", port: "", items: 1 },
  });
  const err = (k: keyof ShipmentInput) => msg(formState.errors[k]?.message, locale);

  const save = async (v: ShipmentInput, draft: boolean) => {
    setBusy(draft ? "draft" : "submit");
    try {
      await api.shipments.create(v, draft);
      reset();
      onClose();
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={t(bi("ملف شحنة جديد", "New shipment file"))}
      description={t(bi("DEMO — لن يُرسل أي ملف إلى جهة حقيقية.", "DEMO — nothing is sent to a real body."))}
      footer={
        <>
          <Button variant="outline" loading={busy === "draft"} disabled={busy === "submit"} onClick={async () => { if (await trigger()) await save(getValues(), true); }}>
            {t(bi("حفظ كمسودة", "Save draft"))}
          </Button>
          <Button variant="accent" loading={busy === "submit"} disabled={busy === "draft"} onClick={handleSubmit((v) => save(v, false))}>
            {t(bi("تقديم", "Submit"))}
          </Button>
        </>
      }
    >
      <form noValidate onSubmit={(e) => e.preventDefault()} className="grid gap-4">
        <Field label={bi("وصف الشحنة", "Shipment description")} required error={err("description")}>
          <input className="field" {...register("description")} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={bi("بلد المنشأ", "Origin country")} required error={err("origin")}>
            <select className="field" {...register("origin")}>
              <option value="">{t(bi("اختر…", "Select…"))}</option>
              {COUNTRIES.filter((c) => c.id !== "EG").map((c) => <option key={c.id} value={c.id}>{t(c.title)}</option>)}
            </select>
          </Field>
          <Field label={bi("ميناء الوصول", "Port of arrival")} required error={err("port")}>
            <select className="field" {...register("port")}>
              <option value="">{t(bi("اختر…", "Select…"))}</option>
              {["الإسكندرية|Alexandria", "بورسعيد|Port Said", "دمياط|Damietta", "السخنة|Sokhna"].map((p) => {
                const [ar, en] = p.split("|");
                return <option key={en} value={locale === "ar" ? `ميناء ${ar}` : `${en} Port`}>{locale === "ar" ? `ميناء ${ar}` : `${en} Port`}</option>;
              })}
            </select>
          </Field>
        </div>
        <Field label={bi("عدد الأصناف", "Number of items")} required error={err("items")}>
          <input type="number" min={1} className="field" {...register("items")} />
        </Field>
      </form>
    </Dialog>
  );
}

export default function ShipmentsPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.shipments.list(), []);
  const [open, setOpen] = useState(false);

  const columns: Column<Shipment>[] = [
    { key: "ref", header: bi("الرقم المرجعي", "Reference"), primary: true, sort: (s) => s.ref, cell: (s) => <span dir="ltr" className="ltr-num font-semibold text-navy-900">{s.ref}</span> },
    { key: "desc", header: bi("الوصف", "Description"), sort: (s) => t(s.description), cell: (s) => t(s.description) },
    { key: "origin", header: bi("المنشأ", "Origin"), cell: (s) => { const c = countryLabel(s.origin); return c ? t(c) : s.origin; } },
    { key: "port", header: bi("الميناء", "Port"), cell: (s) => t(s.port) },
    { key: "docs", header: bi("المستندات", "Documents"), sort: (s) => s.documents, cell: (s) => <span className="ltr-num">{s.documents}</span> },
    { key: "status", header: bi("الحالة", "Status"), sort: (s) => s.status, cell: (s) => <ShipmentStatusBadge status={s.status} /> },
    { key: "date", header: bi("التاريخ", "Date"), sort: (s) => s.createdAt, cell: (s) => <span className="ltr-num">{formatDate(s.createdAt, locale)}</span> },
  ];
  const filters: TableFilter<Shipment>[] = [
    {
      key: "status",
      label: bi("الحالة", "Status"),
      options: (Object.keys(SHIPMENT_STATUS) as ShipmentStatus[]).map((k) => ({ value: k, label: SHIPMENT_STATUS[k].label })),
      match: (s, v) => s.status === v,
    },
  ];

  return (
    <>
      <PageHeader
        title={t(bi("مستندات الشحنات", "Shipment documents"))}
        text={t(bi("نظّم ملفات الشحنات ومستنداتها وتابع حالتها.", "Organise shipment files and documents and follow their status."))}
        actions={
          <Button variant="accent" onClick={() => setOpen(true)}>
            <Plus size={17} aria-hidden="true" /> {t(bi("ملف شحنة جديد", "New shipment file"))}
          </Button>
        }
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : q.loading || !q.data ? (
        <CardSkeleton rows={5} />
      ) : (
        <DataTable rows={q.data} columns={columns} rowId={(s) => s.id} searchText={(s) => `${s.ref} ${s.description.ar} ${s.description.en}`} filters={filters} caption={bi("جدول الشحنات", "Shipments table")} />
      )}
      <NewShipmentDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
