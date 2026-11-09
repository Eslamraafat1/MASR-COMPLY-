"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckBig, CircleHelp, LifeBuoy, Mail, Radar, Scale } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader, Panel } from "@/components/dashboard/shared";
import { DemoTag } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { useSession } from "@/lib/hooks/use-session";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { contactSchema, type ContactInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";

const TOPICS = [
  bi("مشكلة في الحساب", "Account issue"),
  bi("تسجيل المنتجات", "Product registration"),
  bi("طلبات المطابقة", "Conformity requests"),
  bi("المستندات والشحنات", "Documents & shipments"),
  bi("أخرى", "Other"),
];

export default function SupportPage() {
  const { t, locale } = useI18n();
  const { user } = useSession();
  const [ref, setRef] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    values: { name: user?.name ?? "", email: user?.email ?? "", topic: "", message: "" },
  });
  const e = (k: keyof ContactInput) => msg(errors[k]?.message, locale);

  const onSubmit = handleSubmit(async () => {
    setBusy(true);
    const r = await api.contact.send();
    setBusy(false);
    setRef(r.ref);
    reset();
  });

  const links = [
    { href: "/faq", icon: CircleHelp, label: bi("الأسئلة الشائعة", "FAQ"), text: bi("إجابات عن الأسئلة الأكثر تكراراً.", "Answers to common questions.") },
    { href: "/help", icon: LifeBuoy, label: bi("مركز المساعدة", "Help center"), text: bi("أدلة إرشادية حسب الموضوع.", "Guides by topic.") },
    { href: "/track", icon: Radar, label: bi("متابعة طلب", "Track a request"), text: bi("تتبّع طلب بالرقم المرجعي.", "Follow a request by reference.") },
    { href: "/regulations", icon: Scale, label: bi("اللوائح والمواصفات", "Regulations & standards"), text: bi("محتوى مقترح قابل للبحث.", "Searchable proposed content.") },
    { href: "/contact", icon: Mail, label: bi("تواصل معنا", "Contact us"), text: bi("قنوات التواصل العامة.", "General contact channels.") },
  ];

  return (
    <div>
      <PageHeader title={t(bi("الدعم والمساعدة", "Support & help"))} text={t(bi("اعثر على إجابة بسرعة أو أرسل طلب دعم تجريبي.", "Find an answer quickly or send a demo support ticket."))} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-2">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="group flex items-start gap-4 rounded-xl border border-line bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800 group-hover:bg-navy-900 group-hover:text-white">
                <l.icon size={19} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-bold text-navy-900">{t(l.label)}</span>
                <span className="text-xs text-muted">{t(l.text)}</span>
              </span>
            </Link>
          ))}
        </div>

        <Panel className="lg:col-span-3" title={t(bi("إرسال طلب دعم", "Send a support ticket"))} action={<DemoTag />}>
          {ref ? (
            <div className="py-6 text-center" role="status">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
                <CircleCheckBig size={28} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-bold text-navy-900">{t(bi("تم تسجيل طلبك (تجريبي)", "Your ticket was recorded (demo)"))}</h3>
              <p className="mt-1 text-sm text-muted">{t(bi("لم يُرسل أي شيء إلى جهة حقيقية.", "Nothing was sent to a real party."))}</p>
              <p dir="ltr" className="mt-3 text-sm font-semibold text-navy-900">{ref}</p>
              <Button className="mt-5" variant="outline" onClick={() => setRef(null)}>{t(bi("إرسال طلب آخر", "Send another"))}</Button>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
              <Field label={bi("الاسم", "Name")} required error={e("name")}>
                <input className="field" {...register("name")} />
              </Field>
              <Field label={bi("البريد الإلكتروني", "Email")} required error={e("email")}>
                <input className="field" type="email" dir="ltr" {...register("email")} />
              </Field>
              <Field className="sm:col-span-2" label={bi("الموضوع", "Topic")} required error={e("topic")}>
                <select className="field" {...register("topic")}>
                  <option value="">{t(bi("اختر…", "Select…"))}</option>
                  {TOPICS.map((x) => (
                    <option key={x.en} value={x.en}>{t(x)}</option>
                  ))}
                </select>
              </Field>
              <Field className="sm:col-span-2" label={bi("الرسالة", "Message")} required error={e("message")}>
                <textarea rows={5} className="field" {...register("message")} />
              </Field>
              <div className="sm:col-span-2">
                <Button type="submit" loading={busy}>{t(bi("إرسال", "Send"))}</Button>
              </div>
            </form>
          )}
        </Panel>
      </div>
    </div>
  );
}
