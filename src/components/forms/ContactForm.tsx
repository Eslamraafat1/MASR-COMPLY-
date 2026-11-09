"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import { msg } from "./messages";

const TOPICS = [
  bi("استفسار عام", "General inquiry"),
  bi("مشكلة في الحساب", "Account issue"),
  bi("تسجيل المنتجات", "Product registration"),
  bi("طلبات المطابقة", "Conformity requests"),
  bi("اقتراح أو ملاحظة", "Suggestion or feedback"),
];

export function ContactForm() {
  const { t, locale } = useI18n();
  const [sent, setSent] = useState<string | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactInput>({ resolver: zodResolver(contactSchema), defaultValues: { name: "", email: "", topic: "", message: "" } });

  if (sent)
    return (
      <div role="status" className="rounded-2xl border border-emerald-300/50 bg-emerald-50/60 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 text-emerald-600" size={44} aria-hidden="true" />
        <h2 className="text-xl font-bold text-navy-900">{t(bi("تم استلام رسالتك (محاكاة)", "Message received (simulated)"))}</h2>
        <p className="mt-2 text-sm leading-7 text-muted">
          {t(bi("هذا نموذج أولي: لم تُرسل الرسالة إلى أي جهة. الرقم المرجعي التجريبي:", "This is a prototype: the message was not sent to anyone. Demo reference:"))} <span dir="ltr" className="font-bold text-navy-900">{sent}</span>
        </p>
        <Button className="mt-6" variant="outline" onClick={() => setSent(null)}>{t(bi("إرسال رسالة أخرى", "Send another message"))}</Button>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit(async () => {
        const r = await api.contact.send();
        setSent(r.ref);
        reset();
      })}
      className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={bi("الاسم", "Name")} required error={msg(errors.name?.message, locale)}>
          <input className="field" autoComplete="name" {...register("name")} />
        </Field>
        <Field label={bi("البريد الإلكتروني", "Email")} required error={msg(errors.email?.message, locale)}>
          <input className="field" type="email" dir="ltr" autoComplete="email" {...register("email")} />
        </Field>
      </div>
      <Field label={bi("الموضوع", "Topic")} required error={msg(errors.topic?.message, locale)}>
        <select className="field" {...register("topic")}>
          <option value="">{t(bi("اختر الموضوع", "Select a topic"))}</option>
          {TOPICS.map((o) => <option key={o.en} value={o.en}>{t(o)}</option>)}
        </select>
      </Field>
      <Field label={bi("الرسالة", "Message")} required error={msg(errors.message?.message, locale)}>
        <textarea className="field min-h-36 resize-y py-3" {...register("message")} />
      </Field>
      <p className="text-xs leading-6 text-muted">{t(bi("لا تُدخل بيانات حساسة. الرسائل في هذا النموذج لا تغادر متصفحك.", "Please don't enter sensitive data. Messages in this prototype never leave your browser."))}</p>
      <Button type="submit" size="lg" loading={isSubmitting}>{t(bi("إرسال الرسالة", "Send message"))}</Button>
    </form>
  );
}
