"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SearchCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ApplicationStatusBadge } from "@/components/dashboard/shared";
import { Timeline } from "@/components/dashboard/Timeline";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Skeleton, EmptyState } from "@/components/ui/States";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import type { Application } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const schema = z.object({ ref: z.string().trim().min(1, "required").regex(/^[A-Za-z0-9-]{6,30}$/, "invalidRef") });
type Input = z.infer<typeof schema>;
const SAMPLES = ["DEMO-APP-2026-0001", "DEMO-APP-2026-0005", "DEMO-APP-2026-0007"];

export function TrackForm() {
  const { t, locale } = useI18n();
  const [state, setState] = useState<{ kind: "idle" } | { kind: "loading" } | { kind: "found"; app: Application } | { kind: "missing"; ref: string }>({ kind: "idle" });
  const { register, handleSubmit, formState, setValue } = useForm<Input>({ resolver: zodResolver(schema), defaultValues: { ref: "" } });
  const errKey = formState.errors.ref?.message;
  const error = errKey === "required" ? t(bi("أدخل الرقم المرجعي.", "Enter a reference.")) : errKey ? t(bi("صيغة الرقم المرجعي غير صحيحة، مثل DEMO-APP-2026-0001.", "Invalid reference format, e.g. DEMO-APP-2026-0001.")) : undefined;

  const lookup = async ({ ref }: Input) => {
    setState({ kind: "loading" });
    const app = await api.applications.track(ref);
    setState(app ? { kind: "found", app } : { kind: "missing", ref });
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form noValidate onSubmit={handleSubmit(lookup)} className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <Field label={bi("الرقم المرجعي للطلب", "Request reference")} required error={error} className="flex-1">
            <input dir="ltr" className="field text-start" placeholder="DEMO-APP-2026-0001" autoComplete="off" {...register("ref")} />
          </Field>
          <Button type="submit" variant="primary" size="lg" loading={state.kind === "loading"}>
            <SearchCheck size={18} aria-hidden="true" /> {t(bi("تتبّع", "Track"))}
          </Button>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span>{t(bi("جرّب مرجعاً تجريبياً:", "Try a demo reference:"))}</span>
          {SAMPLES.map((s) => (
            <button key={s} type="button" dir="ltr" onClick={() => setValue("ref", s, { shouldValidate: true })} className="rounded-full border border-line bg-surface px-3 py-1 font-semibold text-navy-800 hover:border-navy-600">
              {s}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs leading-6 text-muted">{t(bi("تعمل هذه الصفحة مع المراجع التجريبية فقط (DEMO) ولا تُظهر أي سجلات حكومية حقيقية.", "This page only works with demo (DEMO) references and shows no real government records."))}</p>
      </form>

      <div aria-live="polite" className="mt-6">
        {state.kind === "loading" && (
          <div className="space-y-3 rounded-2xl border border-line bg-white p-6" role="status">
            <Skeleton className="h-6 w-1/3" /><Skeleton /><Skeleton className="w-4/5" /><span className="sr-only">Loading…</span>
          </div>
        )}
        {state.kind === "missing" && (
          <EmptyState title={t(bi("لم يتم العثور على الطلب", "Request not found"))} text={`${t(bi("لا يوجد طلب تجريبي بالرقم", "No demo request matches"))} ${state.ref}`} />
        )}
        {state.kind === "found" && (
          <div className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
              <div>
                <p dir="ltr" className="text-start text-lg font-bold text-navy-900">{state.app.ref}</p>
                <p className="text-sm text-muted">{t(state.app.productName)}</p>
              </div>
              <ApplicationStatusBadge status={state.app.status} />
            </div>
            <p className="mt-4 text-sm text-muted">
              {t(bi("آخر تحديث:", "Last updated:"))} <span className="ltr-num font-semibold text-navy-900">{formatDate(state.app.updatedAt, locale)}</span>
            </p>
            <h2 className="mb-4 mt-6 text-sm font-bold text-navy-900">{t(bi("مراحل الطلب", "Request stages"))}</h2>
            <Timeline events={state.app.timeline} />
          </div>
        )}
      </div>
    </div>
  );
}
