"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Info } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader, Panel } from "@/components/dashboard/shared";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { ASSESSMENT_BODIES } from "@/lib/data/reference";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { applicationSchema, type ApplicationInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import type { Application, DocumentFile } from "@/lib/types";

function NewApplicationForm() {
  const { t, locale } = useI18n();
  const sp = useSearchParams();
  const products = useQuery(() => api.products.list(), []);
  const [docs, setDocs] = useState<DocumentFile[]>([]);
  const [done, setDone] = useState<{ app: Application; draft: boolean } | null>(null);
  const [busy, setBusy] = useState<"draft" | "submit" | null>(null);
  const [failed, setFailed] = useState(false);

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { productId: sp.get("product") ?? "", type: "conformity", bodyId: sp.get("body") ?? "", notes: "" },
  });
  const { register, handleSubmit, formState, getValues, trigger } = form;
  const err = (k: keyof ApplicationInput) => msg(formState.errors[k]?.message, locale);

  const run = async (input: ApplicationInput, asDraft: boolean) => {
    setBusy(asDraft ? "draft" : "submit");
    setFailed(false);
    try {
      const app = await api.applications.create(input, docs, asDraft);
      setDone({ app, draft: asDraft });
    } catch {
      setFailed(true);
    } finally {
      setBusy(null);
    }
  };

  if (done) {
    return (
      <Panel className="mx-auto max-w-xl text-center">
        <div className="mx-auto mb-4 grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={34} aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-navy-900">{done.draft ? t(bi("تم حفظ المسودة", "Draft saved")) : t(bi("تم تسجيل الطلب (محاكاة)", "Request recorded (simulated)"))}</h2>
        <p className="mt-2 text-sm text-muted">{t(bi("الرقم المرجعي", "Reference"))}</p>
        <p dir="ltr" className="mt-1 text-lg font-bold tracking-wide text-navy-900">{done.app.ref}</p>
        <p className="mx-auto mt-5 flex max-w-md items-start gap-2 rounded-lg bg-gold-soft px-4 py-3 text-start text-xs leading-6 text-[#7a5d1c]">
          <Info size={15} className="mt-1 shrink-0" aria-hidden="true" />
          {t(bi("هذا إجراء محاكى لأغراض العرض فقط؛ لم يُرسل أي طلب حقيقي إلى أي جهة حكومية.", "This is a simulated action for demonstration only; no real request was sent to any government body."))}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <LinkButton href={`/dashboard/applications/${done.app.id}`} variant="primary">{t(bi("عرض الطلب", "View request"))}</LinkButton>
          <LinkButton href="/dashboard/applications" variant="outline">{t(bi("كل الطلبات", "All requests"))}</LinkButton>
        </div>
      </Panel>
    );
  }

  if (products.error) return <ErrorState onRetry={products.refetch} />;
  if (products.loading || !products.data) return <CardSkeleton rows={6} />;
  const usable = products.data.filter((p) => p.status !== "draft");
  if (usable.length === 0) {
    return (
      <EmptyState
        title={t(bi("لا توجد منتجات مسجلة", "No registered products"))}
        text={t(bi("سجّل منتجاً أولاً لتتمكن من تقديم طلب.", "Register a product first so you can submit a request."))}
        action={<LinkButton href="/dashboard/products/new" variant="accent">{t(bi("تسجيل منتج", "Register product"))}</LinkButton>}
      />
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit((v) => run(v, false))} className="grid gap-6 lg:grid-cols-[1fr_20rem]">
      <Panel title={t(bi("بيانات الطلب", "Request details"))}>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={bi("المنتج", "Product")} required error={err("productId")} className="sm:col-span-2">
            <select className="field" {...register("productId")}>
              <option value="">{t(bi("اختر منتجاً…", "Select a product…"))}</option>
              {usable.map((p) => (
                <option key={p.id} value={p.id}>{locale === "ar" ? p.nameAr : p.nameEn} — {p.ref}</option>
              ))}
            </select>
          </Field>
          <Field label={bi("نوع الطلب", "Request type")} required error={err("type")}>
            <select className="field" {...register("type")}>
              <option value="conformity">{t(bi("طلب مطابقة", "Conformity request"))}</option>
              <option value="assessment">{t(bi("طلب تقييم", "Assessment request"))}</option>
              <option value="renewal">{t(bi("تجديد", "Renewal"))}</option>
            </select>
          </Field>
          <Field label={bi("جهة التقييم", "Assessment body")} required error={err("bodyId")}>
            <select className="field" {...register("bodyId")}>
              <option value="">{t(bi("اختر جهة…", "Select a body…"))}</option>
              {ASSESSMENT_BODIES.map((b) => (
                <option key={b.id} value={b.id}>{t(b.name)}</option>
              ))}
            </select>
          </Field>
          <Field label={bi("ملاحظات", "Notes")} optional error={err("notes")} className="sm:col-span-2">
            <textarea rows={3} className="field" {...register("notes")} />
          </Field>
          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold text-navy-900">{t(bi("المستندات الداعمة", "Supporting documents"))}</p>
            <FileDropzone files={docs} onChange={setDocs} label={t(bi("أرفق المستندات المطلوبة", "Attach required documents"))} />
          </div>
        </div>
        {failed && <p role="alert" className="mt-4 text-sm font-medium text-flag-red-dark">{t(bi("تعذر إتمام العملية. حاول مرة أخرى.", "Couldn't complete the action. Please try again."))}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-line pt-5">
          <Button
            variant="outline"
            loading={busy === "draft"}
            disabled={busy === "submit"}
            onClick={async () => {
              if (await trigger(["productId", "bodyId"])) await run(getValues(), true);
            }}
          >
            {t(bi("حفظ كمسودة", "Save draft"))}
          </Button>
          <Button type="submit" variant="accent" loading={busy === "submit"} disabled={busy === "draft"}>
            {t(bi("تقديم الطلب", "Submit request"))}
          </Button>
        </div>
      </Panel>
      <aside className="space-y-4">
        <Panel title={t(bi("قبل التقديم", "Before you submit"))}>
          <ul className="list-disc space-y-2 ps-5 text-sm leading-7 text-muted">
            <li>{t(bi("تأكد من اكتمال بيانات المنتج.", "Make sure the product record is complete."))}</li>
            <li>{t(bi("أرفق تقارير الاختبار إن وجدت.", "Attach test reports if available."))}</li>
            <li>{t(bi("المتطلبات النهائية تحددها الجهات المختصة.", "Final requirements are set by the competent authorities."))}</li>
          </ul>
        </Panel>
        <p className="rounded-lg bg-gold-soft px-4 py-3 text-xs leading-6 text-[#7a5d1c]">
          DEMO — {t(bi("لا يتم إرسال أي بيانات إلى جهة حقيقية.", "No data is sent to any real body."))}
        </p>
      </aside>
    </form>
  );
}

export default function NewApplicationPage() {
  const { t } = useI18n();
  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/applications", label: t(bi("طلبات المطابقة", "Conformity requests")) }}
        title={t(bi("طلب تقييم مطابقة جديد", "New conformity request"))}
        text={t(bi("اختر المنتج وجهة التقييم وأرفق المستندات.", "Choose the product and body, then attach documents."))}
      />
      <Suspense fallback={<CardSkeleton rows={6} />}>
        <NewApplicationForm />
      </Suspense>
    </>
  );
}
