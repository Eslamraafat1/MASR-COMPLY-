"use client";

import Link from "next/link";
import { use, useState } from "react";
import { BadgeCheck, CheckCircle2, Circle, FileText, FlaskConical } from "lucide-react";
import { ApplicationStatusBadge, Info, PageHeader, Panel } from "@/components/dashboard/shared";
import { Timeline } from "@/components/dashboard/Timeline";
import { Button, LinkButton } from "@/components/ui/Button";
import { DemoTag } from "@/components/ui/Badge";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { APPLICATION_FLOW } from "@/lib/data/status";
import { bodyById } from "@/lib/data/reference";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { ApiError, api } from "@/lib/services/api";
import { cn, formatBytes, formatDate, formatDateTime, uid } from "@/lib/utils";

const TYPES = { conformity: bi("طلب مطابقة", "Conformity request"), assessment: bi("طلب تقييم", "Assessment request"), renewal: bi("تجديد", "Renewal") };

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const app = useQuery(() => api.applications.get(id), [id]);
  const certs = useQuery(() => api.certificates.list(), []);
  const [busy, setBusy] = useState<string | null>(null);

  const back = { href: "/dashboard/applications", label: t(bi("طلبات المطابقة", "Conformity requests")) };

  if (app.error) {
    if (app.error instanceof ApiError && app.error.code === "not_found") {
      return (
        <EmptyState
          title={t(bi("الطلب غير موجود", "Request not found"))}
          text={t(bi("ربما حُذف الطلب أو أُعيد ضبط بيانات العرض.", "The request may have been removed or demo data was reset."))}
          action={<LinkButton href="/dashboard/applications" variant="primary">{t(bi("العودة إلى الطلبات", "Back to requests"))}</LinkButton>}
        />
      );
    }
    return <ErrorState onRetry={app.refetch} />;
  }
  if (app.loading || !app.data) return <CardSkeleton rows={8} />;

  const a = app.data;
  const body = bodyById(a.bodyId);
  const cert = certs.data?.find((c) => c.applicationRef === a.ref);
  const canAdvance = a.status !== "completed" && a.status !== "rejected";
  const openActions = a.actions.filter((x) => !x.done);

  const doAdvance = async () => {
    setBusy("advance");
    try {
      await api.applications.advance(a.id);
    } finally {
      setBusy(null);
    }
  };
  const complete = async (actionId: string) => {
    setBusy(actionId);
    try {
      await api.applications.completeAction(a.id, actionId, {
        id: uid("file"),
        name: "supplementary-document.pdf",
        size: 310000,
        type: "application/pdf",
        uploadedAt: new Date().toISOString(),
      });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      <PageHeader
        back={back}
        title={a.ref}
        text={t(a.productName)}
        actions={
          <>
            {cert && (
              <LinkButton href={`/dashboard/certificates/${cert.id}`} variant="primary">
                <BadgeCheck size={17} aria-hidden="true" /> {t(bi("عرض الشهادة", "View certificate"))}
              </LinkButton>
            )}
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          <Panel title={t(bi("ملخص الطلب", "Request summary"))} action={<ApplicationStatusBadge status={a.status} />}>
            <dl className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              <Info label={t(bi("الرقم المرجعي", "Reference"))}><span dir="ltr" className="ltr-num">{a.ref}</span></Info>
              <Info label={t(bi("النوع", "Type"))}>{t(TYPES[a.type])}</Info>
              <Info label={t(bi("تاريخ التقديم", "Submitted"))}>{a.submittedAt ? <span className="ltr-num">{formatDate(a.submittedAt, locale)}</span> : t(bi("لم يُقدَّم بعد", "Not submitted yet"))}</Info>
              <Info label={t(bi("المنتج", "Product"))}>
                <Link href={`/dashboard/products/${a.productId}`} className="text-flag-green underline-offset-4 hover:underline">{t(a.productName)}</Link>
              </Info>
              <Info label={t(bi("جهة التقييم", "Assessment body"))}>
                {body ? <span className="inline-flex items-center gap-1.5"><FlaskConical size={14} aria-hidden="true" />{t(body.name)}</span> : "—"}
              </Info>
              <Info label={t(bi("آخر تحديث", "Last updated"))}><span className="ltr-num">{formatDateTime(a.updatedAt, locale)}</span></Info>
            </dl>
            {a.notes && <p className="mt-5 rounded-lg bg-surface p-3 text-sm text-muted">{a.notes}</p>}
          </Panel>

          <Panel title={t(bi("الإجراءات المطلوبة", "Required actions"))}>
            {a.actions.length === 0 ? (
              <p className="text-sm text-muted">{t(bi("لا توجد إجراءات مطلوبة حالياً.", "No actions are required right now."))}</p>
            ) : (
              <ul className="space-y-3">
                {a.actions.map((x) => (
                  <li key={x.id} className={cn("flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center", x.done ? "border-green-200 bg-emerald-50/50" : "border-amber-200 bg-amber-50/60")}>
                    {x.done ? <CheckCircle2 className="shrink-0 text-emerald-600" size={22} aria-hidden="true" /> : <Circle className="shrink-0 text-amber-600" size={22} aria-hidden="true" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-navy-900">{t(x.title)}</p>
                      <p className="text-sm text-muted">{t(x.detail)}</p>
                    </div>
                    {!x.done && (
                      <Button size="sm" variant="outline" loading={busy === x.id} onClick={() => complete(x.id)}>
                        {t(bi("رفع المستند وإتمام", "Upload & mark done"))}
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {openActions.length > 0 && <p className="mt-3 text-xs text-muted">{t(bi("المحاكاة: يُرفق مستند تجريبي تلقائياً.", "Simulation: a placeholder document is attached automatically."))}</p>}
          </Panel>

          <Panel title={t(bi("المستندات المرفوعة وسجلها", "Uploaded documents & history"))} padded={false}>
            {a.documents.length === 0 ? (
              <p className="p-5 text-sm text-muted">{t(bi("لم تُرفع مستندات بعد.", "No documents uploaded yet."))}</p>
            ) : (
              <ul className="divide-y divide-line">
                {[...a.documents].reverse().map((d) => (
                  <li key={d.id} className="flex items-center gap-3 px-5 py-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700"><FileText size={18} aria-hidden="true" /></span>
                    <div className="min-w-0 flex-1">
                      <p dir="ltr" className="truncate text-start text-sm font-medium text-navy-900">{d.name}</p>
                      <p className="text-xs text-muted"><span className="ltr-num">{formatBytes(d.size)} · {formatDateTime(d.uploadedAt, locale)}</span></p>
                    </div>
                    <DemoTag />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title={t(bi("السجل الزمني", "Activity timeline"))}>
            <Timeline events={a.timeline} />
          </Panel>
          <Panel title={t(bi("محاكاة العرض", "Demo simulation"))}>
            <div className="mb-3 flex items-center gap-2"><DemoTag /><span className="text-xs text-muted">{t(bi("ليست إجراءً حقيقياً", "Not a real action"))}</span></div>
            <p className="mb-4 text-sm leading-7 text-muted">
              {t(bi("انقل الطلب إلى المرحلة التالية لاستكشاف مسار العمل المقترح.", "Move the request to its next stage to explore the proposed workflow."))}
            </p>
            <p className="mb-4 text-xs text-muted">{APPLICATION_FLOW.length > 0 && t(bi("المراحل: تقديم ← مراجعة ← تقييم ← اكتمال", "Stages: submitted → review → assessment → completed"))}</p>
            <Button className="w-full" variant="secondary" disabled={!canAdvance} loading={busy === "advance"} onClick={doAdvance}>
              {t(bi("DEMO: تقدّم إلى المرحلة التالية", "DEMO: advance to next stage"))}
            </Button>
          </Panel>
        </div>
      </div>
    </>
  );
}
