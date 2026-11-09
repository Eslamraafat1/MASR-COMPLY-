"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { Stepper } from "@/components/ui/Stepper";
import { ACCOUNT_TYPE_LABEL, SECTORS } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { ACCOUNT_TYPES, REGISTER_STEP_SCHEMAS, registerSchema, type RegisterInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import { cn } from "@/lib/utils";
import { AuthHeading } from "./AuthForms";
import { msg } from "./messages";
import { PasswordInput, PasswordStrength } from "./PasswordInput";

const STEPS = [bi("نوع الحساب", "Account type"), bi("بيانات المنشأة", "Organisation"), bi("الاتصال والحساب", "Contact & login"), bi("المراجعة", "Review")];

export function RegisterWizard() {
  const { t, locale, isRtl } = useI18n();
  const params = useSearchParams().get("type");
  const initialType = (ACCOUNT_TYPES as readonly string[]).includes(params ?? "") ? (params as RegisterInput["accountType"]) : "importer";
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);
  const [done, setDone] = useState<{ email: string } | null>(null);
  const Next = isRtl ? ArrowLeft : ArrowRight;
  const Prev = isRtl ? ArrowRight : ArrowLeft;

  const resolver = ((values: unknown, ctx: unknown, opts: unknown) =>
    (zodResolver(REGISTER_STEP_SCHEMAS[stepRef.current] as never) as (v: unknown, c: unknown, o: unknown) => unknown)(values, ctx, opts)) as unknown as Resolver<RegisterInput>;

  const { register, handleSubmit, trigger, watch, getValues, setValue, setError, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
    resolver,
    mode: "onTouched",
    defaultValues: { accountType: initialType, establishmentName: "", commercialReg: "", taxId: "", activity: "", address: "", fullName: "", contactPerson: "", email: "", mobile: "", password: "", confirm: "", terms: false },
  });

  const type = watch("accountType");
  const isIndividual = type === "individual";
  const commercial = type === "importer" || type === "manufacturer";
  const goTo = (n: number) => {
    stepRef.current = n;
    setStep(n);
  };
  const e = (k: keyof RegisterInput) => msg(errors[k]?.message as string | undefined, locale);

  const next = async () => {
    if (await trigger()) goTo(step + 1);
  };

  // The step resolver strips fields outside the current step, so the full form is read directly.
  const submit = async () => {
    const values = getValues();
    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      const field = first.path[0] as keyof RegisterInput;
      const stepOf = (k: keyof RegisterInput) => (k === "accountType" ? 0 : ["establishmentName", "commercialReg", "taxId", "activity", "address", "fullName"].includes(k) ? 1 : k === "terms" ? 3 : 2);
      goTo(stepOf(field));
      setError(field, { message: first.message });
      return;
    }
    await api.auth.register(parsed.data);
    setDone({ email: values.email });
  };

  if (done)
    return (
      <div role="status" className="text-center">
        <motion.span initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }} className="mx-auto mb-5 grid size-20 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <PartyPopper size={36} aria-hidden="true" />
        </motion.span>
        <h1 className="text-3xl font-bold text-navy-900">{t(bi("تم إنشاء حسابك التجريبي", "Your demo account is created"))}</h1>
        <p className="mt-3 text-base leading-8 text-muted">
          {t(bi("الخطوة التالية: تأكيد البريد الإلكتروني", "Next step: verify the email"))} <span dir="ltr" className="font-semibold text-navy-900">{done.email}</span>. {t(bi("لم يُرسل أي بريد فعلي في هذا النموذج.", "No real email is sent in this prototype."))}
        </p>
        <LinkButton href="/verify-email" size="lg" className="mt-8 w-full">{t(bi("متابعة التأكيد", "Continue to verification"))}</LinkButton>
        <LinkButton href="/dashboard" variant="ghost" className="mt-2 w-full">{t(bi("تخطَّ إلى لوحة التحكم", "Skip to dashboard"))}</LinkButton>
      </div>
    );

  return (
    <>
      <AuthHeading title={t(bi("إنشاء حساب", "Create your account"))} text={t(bi("أربع خطوات قصيرة لإعداد حسابك التجريبي. لا نجمع بيانات حساسة غير لازمة.", "Four short steps to set up your demo account. We don't collect unnecessary sensitive data."))} />
      <div className="mb-8"><Stepper steps={STEPS} current={step} /></div>

      <form noValidate onSubmit={handleSubmit(submit)}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: isRtl ? -16 : 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRtl ? 16 : -16 }} transition={{ duration: 0.2 }} className="space-y-5">
            {step === 0 && (
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-navy-900">{t(bi("اختر نوع الحساب", "Choose your account type"))}</legend>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SECTORS.map((s) => {
                    const on = type === s.accountType;
                    return (
                      <label key={s.slug} className={cn("flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-all focus-within:ring-4 focus-within:ring-flag-green/15", on ? "border-navy-900 bg-navy-50/60" : "border-line hover:border-navy-900/30")}>
                        <input type="radio" className="sr-only" value={s.accountType} checked={on} onChange={() => setValue("accountType", s.accountType, { shouldValidate: true })} name="accountType" />
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", on ? "bg-navy-900 text-white" : "bg-surface text-navy-700")}><Icon name={s.icon} size={20} /></span>
                        <span className="min-w-0">
                          <span className="block text-sm font-bold text-navy-900">{t(ACCOUNT_TYPE_LABEL[s.accountType])}</span>
                          <span className="mt-0.5 block text-xs leading-5 text-muted">{t(s.short)}</span>
                        </span>
                        {on && <CheckCircle2 size={18} className="ms-auto shrink-0 text-flag-green" aria-hidden="true" />}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 1 &&
              (isIndividual ? (
                <>
                  <p className="rounded-lg bg-surface px-4 py-3 text-sm leading-7 text-muted">{t(bi("حساب الأفراد لا يتطلب بيانات سجل تجاري أو ضريبي.", "Individual accounts don't require commercial or tax registration data."))}</p>
                  <Field label={bi("الاسم الكامل", "Full name")} required error={e("fullName")}><input className="field" autoComplete="name" {...register("fullName")} /></Field>
                </>
              ) : (
                <>
                  <Field label={bi("اسم المنشأة", "Establishment name")} required error={e("establishmentName")}><input className="field" autoComplete="organization" {...register("establishmentName")} /></Field>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={bi("رقم السجل التجاري", "Commercial registration no.")} required={commercial} optional={!commercial} error={e("commercialReg")}><input className="field" dir="ltr" inputMode="text" {...register("commercialReg")} /></Field>
                    <Field label={bi("رقم التسجيل الضريبي", "Tax registration no.")} required={commercial} optional={!commercial} error={e("taxId")}><input className="field" dir="ltr" {...register("taxId")} /></Field>
                  </div>
                  <Field label={bi("النشاط التجاري", "Business activity")} required={commercial} optional={!commercial} error={e("activity")}><input className="field" {...register("activity")} /></Field>
                  <Field label={bi("العنوان", "Address")} required error={e("address")}><input className="field" autoComplete="street-address" {...register("address")} /></Field>
                </>
              ))}

            {step === 2 && (
              <>
                {!isIndividual && <Field label={bi("الشخص المسؤول", "Contact person")} required error={e("contactPerson")}><input className="field" autoComplete="name" {...register("contactPerson")} /></Field>}
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label={bi("البريد الإلكتروني", "Email")} required error={e("email")}><input className="field" type="email" dir="ltr" autoComplete="email" {...register("email")} /></Field>
                  <Field label={bi("رقم الموبايل", "Mobile number")} required hint="01012345678" error={e("mobile")}><input className="field" type="tel" dir="ltr" autoComplete="tel" inputMode="tel" {...register("mobile")} /></Field>
                </div>
                <Field label={bi("كلمة المرور", "Password")} required hint={bi("8 أحرف على الأقل مع حرف ورقم. لن تُخزَّن في النموذج.", "At least 8 characters with a letter and number. Never stored in the prototype.")} error={e("password")}><PasswordInput autoComplete="new-password" {...register("password")} /></Field>
                <PasswordStrength value={watch("password")} />
                <Field label={bi("تأكيد كلمة المرور", "Confirm password")} required error={e("confirm")}><PasswordInput autoComplete="new-password" {...register("confirm")} /></Field>
              </>
            )}

            {step === 3 && (
              <>
                <dl className="divide-y divide-line rounded-xl border border-line bg-surface/50 text-sm">
                  {(
                    [
                      [bi("نوع الحساب", "Account type"), t(ACCOUNT_TYPE_LABEL[type])],
                      [isIndividual ? bi("الاسم", "Name") : bi("المنشأة", "Establishment"), isIndividual ? getValues("fullName") : getValues("establishmentName")],
                      [bi("البريد الإلكتروني", "Email"), getValues("email")],
                      [bi("الموبايل", "Mobile"), getValues("mobile")],
                    ] as [ReturnType<typeof bi>, string | undefined][]
                  ).map(([k, v], i) => (
                    <div key={i} className="flex items-center justify-between gap-4 px-4 py-3"><dt className="text-muted">{t(k)}</dt><dd dir="auto" className="font-semibold text-navy-900">{v}</dd></div>
                  ))}
                </dl>
                <div>
                  <label className="flex items-start gap-3 text-sm leading-7 text-ink/85">
                    <input type="checkbox" className="mt-2 size-4 accent-[#CE1126]" aria-invalid={!!errors.terms} {...register("terms")} />
                    <span>
                      {t(bi("أوافق على", "I agree to the"))} <Link href="/terms" target="_blank" className="font-semibold text-flag-green underline-offset-4 hover:underline">{t(bi("الشروط والأحكام", "Terms & conditions"))}</Link> {t(bi("و", "and"))} <Link href="/privacy" target="_blank" className="font-semibold text-flag-green underline-offset-4 hover:underline">{t(bi("سياسة الخصوصية", "Privacy policy"))}</Link>{t(bi("، وأدرك أن هذا نموذج أولي غير رسمي.", ", and understand this is an unofficial prototype."))}
                    </span>
                  </label>
                  {errors.terms && <p role="alert" className="mt-2 text-xs font-medium text-flag-red-dark">{e("terms")}</p>}
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => goTo(step - 1)}><Prev size={17} aria-hidden="true" /> {t(bi("السابق", "Back"))}</Button>
          ) : <span />}
          {step < 3 ? (
            <Button size="lg" onClick={next}>{t(bi("التالي", "Next"))} <Next size={17} aria-hidden="true" /></Button>
          ) : (
            <Button type="submit" size="lg" variant="accent" loading={isSubmitting}>{t(bi("إنشاء الحساب", "Create account"))}</Button>
          )}
        </div>
      </form>
      <p className="mt-8 text-center text-sm text-muted">{t(bi("لديك حساب بالفعل؟", "Already have an account?"))} <Link href="/login" className="font-semibold text-flag-green hover:underline">{t(bi("تسجيل الدخول", "Sign in"))}</Link></p>
    </>
  );
}
