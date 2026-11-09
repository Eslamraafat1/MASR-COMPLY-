"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader, Panel } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { Field } from "@/components/ui/Field";
import { ACCOUNT_TYPE_LABEL } from "@/lib/data/content";
import { useSession } from "@/lib/hooks/use-session";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { settingsSchema, type SettingsInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { t, locale, setLocale } = useI18n();
  const { user } = useSession();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SettingsInput>({ resolver: zodResolver(settingsSchema), defaultValues: { name: "", email: "", organization: "" } });
  const e = (k: keyof SettingsInput) => msg(errors[k]?.message, locale);

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, organization: user.organization });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (v) => {
    setSaving(true);
    await api.auth.updateProfile(v);
    setSaving(false);
    setSaved(true);
  });

  return (
    <div>
      <PageHeader title={t(bi("إعدادات الحساب", "Account settings"))} text={t(bi("حدّث بيانات الملف الشخصي وتفضيلات اللغة.", "Update your profile details and language preference."))} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title={t(bi("الملف الشخصي", "Profile"))}>
          <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2" onChange={() => setSaved(false)}>
            <Field label={bi("الاسم", "Name")} required error={e("name")}>
              <input className="field" {...register("name")} />
            </Field>
            <Field label={bi("البريد الإلكتروني", "Email")} required error={e("email")}>
              <input className="field" type="email" dir="ltr" {...register("email")} />
            </Field>
            <Field className="sm:col-span-2" label={bi("المنشأة / الجهة", "Organization")} required error={e("organization")}>
              <input className="field" {...register("organization")} />
            </Field>
            <div className="text-sm text-muted sm:col-span-2">
              {t(bi("نوع الحساب", "Account type"))}: <span className="font-semibold text-navy-900">{user && t(ACCOUNT_TYPE_LABEL[user.accountType])}</span>
            </div>
            <div className="flex items-center gap-4 sm:col-span-2">
              <Button type="submit" loading={saving}>{t(bi("حفظ التغييرات", "Save changes"))}</Button>
              <span aria-live="polite" className="text-sm text-emerald-800">{saved && t(bi("تم الحفظ.", "Saved."))}</span>
            </div>
          </form>
        </Panel>

        <div className="space-y-6">
          <Panel title={t(bi("اللغة", "Language"))}>
            <div role="radiogroup" aria-label={t(bi("اللغة", "Language"))} className="grid grid-cols-2 gap-2">
              {(["ar", "en"] as const).map((l) => (
                <button key={l} type="button" role="radio" aria-checked={locale === l} lang={l} onClick={() => locale !== l && setLocale(l)} className={cn("rounded-lg border px-3 py-3 text-sm font-semibold transition-colors", locale === l ? "border-navy-900 bg-navy-900 text-white" : "border-line hover:bg-surface")}>
                  {l === "ar" ? "العربية" : "English"}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title={t(bi("بيانات العرض التجريبي", "Demo data"))}>
            <p className="mb-4 text-sm leading-6 text-muted">{t(bi("تُحفظ البيانات في متصفحك فقط. يمكنك إعادتها إلى حالتها الأصلية وإنهاء الجلسة.", "Data is stored in your browser only. You can restore it to its original state, which also ends the session."))}</p>
            <Button variant="danger" onClick={() => setConfirm(true)}>{t(bi("إعادة ضبط بيانات العرض", "Reset demo data"))}</Button>
          </Panel>
        </div>
      </div>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title={t(bi("تأكيد إعادة الضبط", "Confirm reset"))}
        footer={
          <>
            <Button variant="outline" onClick={() => setConfirm(false)}>{t(bi("إلغاء", "Cancel"))}</Button>
            <Button
              variant="danger"
              onClick={async () => {
                await api.auth.resetDemo();
                setConfirm(false);
              }}
            >
              {t(bi("نعم، أعد الضبط", "Yes, reset"))}
            </Button>
          </>
        }
      >
        <p className="text-sm leading-7 text-muted">{t(bi("سيتم حذف كل ما أضفته في هذه المساحة التجريبية واستعادة البيانات الأصلية، وستنتهي الجلسة الحالية.", "Everything you added in this demo workspace will be removed and the original data restored. Your current session will end."))}</p>
      </Dialog>
    </div>
  );
}
