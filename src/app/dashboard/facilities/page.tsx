"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader } from "@/components/dashboard/shared";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { CardSkeleton, ErrorState } from "@/components/ui/States";
import { useQuery } from "@/lib/hooks/use-demo";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { facilitySchema, type FacilityInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import type { Facility } from "@/lib/types";

export default function FacilitiesPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.facilities.list(), []);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FacilityInput>({ resolver: zodResolver(facilitySchema) });
  const e = (k: keyof FacilityInput) => msg(errors[k]?.message, locale);

  const onSubmit = handleSubmit(async (v) => {
    setSaving(true);
    await api.facilities.create(v);
    setSaving(false);
    reset();
    setOpen(false);
  });

  const columns: Column<Facility>[] = [
    { key: "name", header: bi("المنشأة", "Facility"), primary: true, sort: (r) => t(r.name), cell: (r) => <span className="font-semibold text-navy-900">{t(r.name)}</span> },
    { key: "cr", header: bi("السجل التجاري", "Commercial reg."), cell: (r) => <span dir="ltr" className="text-xs">{r.commercialReg}</span> },
    { key: "activity", header: bi("النشاط", "Activity"), cell: (r) => t(r.activity) },
    { key: "city", header: bi("المدينة", "City"), sort: (r) => t(r.city), cell: (r) => t(r.city) },
    { key: "products", header: bi("المنتجات", "Products"), sort: (r) => r.products, cell: (r) => <span className="ltr-num">{r.products}</span> },
    {
      key: "status",
      header: bi("الحالة", "Status"),
      cell: (r) => <Badge tone={r.status === "verified" ? "success" : "warning"}>{r.status === "verified" ? t(bi("موثّقة (تجريبي)", "Verified (demo)")) : t(bi("قيد التحقق", "Pending"))}</Badge>,
    },
  ];

  return (
    <div>
      <PageHeader
        title={t(bi("منشآتي", "My facilities"))}
        text={t(bi("أدر بيانات منشآتك وجهات الاتصال. جميع البيانات تجريبية.", "Manage your facilities and contacts. All data is demo data."))}
        actions={
          <Button onClick={() => setOpen(true)}>
            <Plus size={17} aria-hidden="true" /> {t(bi("إضافة منشأة", "Add facility"))}
          </Button>
        }
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : !q.data ? (
        <CardSkeleton rows={5} />
      ) : (
        <DataTable
          rows={q.data}
          columns={columns}
          rowId={(r) => r.id}
          caption={bi("جدول المنشآت", "Facilities table")}
          searchText={(r) => `${r.name.ar} ${r.name.en} ${r.commercialReg} ${r.city.ar} ${r.city.en}`}
          filters={[
            {
              key: "status",
              label: bi("الحالة", "Status"),
              options: [
                { value: "verified", label: bi("موثّقة", "Verified") },
                { value: "pending", label: bi("قيد التحقق", "Pending") },
              ],
              match: (r, v) => r.status === v,
            },
          ]}
        />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={t(bi("إضافة منشأة", "Add facility"))}
        description={t(bi("لا تُدخل بيانات حقيقية حساسة.", "Do not enter real sensitive data."))}
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t(bi("إلغاء", "Cancel"))}
            </Button>
            <Button loading={saving} onClick={onSubmit}>
              {t(bi("حفظ", "Save"))}
            </Button>
          </>
        }
      >
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <Field label={bi("اسم المنشأة", "Facility name")} required error={e("name")}>
            <input className="field" {...register("name")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={bi("رقم السجل التجاري", "Commercial registration")} required error={e("commercialReg")}>
              <input className="field" dir="ltr" {...register("commercialReg")} />
            </Field>
            <Field label={bi("رقم التسجيل الضريبي", "Tax registration no.")} required error={e("taxId")}>
              <input className="field" dir="ltr" {...register("taxId")} />
            </Field>
          </div>
          <Field label={bi("النشاط", "Business activity")} required error={e("activity")}>
            <input className="field" {...register("activity")} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label={bi("المدينة", "City")} required error={e("city")}>
              <input className="field" {...register("city")} />
            </Field>
            <Field label={bi("مسؤول الاتصال", "Contact person")} required error={e("contact")}>
              <input className="field" {...register("contact")} />
            </Field>
          </div>
          <button type="submit" className="sr-only" tabIndex={-1}>
            submit
          </button>
        </form>
      </Dialog>
    </div>
  );
}
