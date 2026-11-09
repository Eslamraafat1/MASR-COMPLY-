"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, MailCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { forgotSchema, loginSchema, resetSchema, type ForgotInput, type LoginInput, type ResetInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import { msg } from "./messages";
import { PasswordInput, PasswordStrength } from "./PasswordInput";

function safeNext(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard";
}

export function AuthHeading({ title, text }: { title: string; text?: string }) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-navy-900">{title}</h1>
      {text && <p className="mt-2 text-base leading-8 text-muted">{text}</p>}
    </div>
  );
}

/* ───────────── Login ───────────── */
export function LoginForm() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [busy, setBusy] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema), defaultValues: { email: "", password: "", remember: false } });

  const go = async (email: string) => {
    await api.auth.login({ email });
    router.push(next);
  };

  return (
    <>
      <AuthHeading title={t(bi("تسجيل الدخول", "Sign in"))} text={t(bi("مرحباً بعودتك. أدخل بياناتك للوصول إلى لوحة التحكم.", "Welcome back. Enter your details to access your dashboard."))} />
      <p className="mb-6 flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold-soft px-4 py-3 text-sm leading-7 text-[#6b5116]">
        <Sparkles size={17} className="mt-1 shrink-0" aria-hidden="true" />
        <span>{t(bi("وضع تجريبي: يقبل أي بريد صحيح وكلمة مرور من 8 أحرف فأكثر. لا يتم التحقق من كلمة المرور ولا تُخزَّن.", "Demo mode: any valid email and a password of 8+ characters works. The password is neither verified nor stored."))}</span>
      </p>
      <form noValidate onSubmit={handleSubmit((v) => go(v.email))} className="space-y-5">
        <Field label={bi("البريد الإلكتروني", "Email")} required error={msg(errors.email?.message, locale)}>
          <input className="field" type="email" dir="ltr" autoComplete="email" inputMode="email" {...register("email")} />
        </Field>
        <Field label={bi("كلمة المرور", "Password")} required error={msg(errors.password?.message, locale)}>
          <PasswordInput autoComplete="current-password" {...register("password")} />
        </Field>
        <div className="flex items-center justify-between gap-3 text-sm">
          <label className="flex items-center gap-2 text-ink/80">
            <input type="checkbox" className="size-4 accent-[#CE1126]" {...register("remember")} /> {t(bi("تذكرني", "Remember me"))}
          </label>
          <Link href="/forgot-password" className="font-semibold text-flag-green hover:underline">{t(bi("نسيت كلمة المرور؟", "Forgot password?"))}</Link>
        </div>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>{t(bi("تسجيل الدخول", "Sign in"))}</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />{t(bi("أو", "or"))}<span className="h-px flex-1 bg-line" /></div>
      <Button
        variant="outline"
        size="lg"
        className="w-full"
        loading={busy}
        onClick={async () => {
          setBusy(true);
          await go("demo.user@example.test");
        }}
      >
        {t(bi("المتابعة بحساب تجريبي", "Continue with the demo account"))}
      </Button>
      <p className="mt-8 text-center text-sm text-muted">
        <Link href="/login" className="font-semibold text-navy-900 hover:underline">{t(bi("تغيير المسار", "Change path"))}</Link> · {t(bi("ليس لديك حساب؟", "Don't have an account?"))} <Link href="/register" className="font-semibold text-flag-green hover:underline">{t(bi("إنشاء حساب", "Create account"))}</Link>
      </p>
    </>
  );
}

/* ───────────── Forgot password ───────────── */
export function ForgotForm() {
  const { t, locale } = useI18n();
  const [sentTo, setSentTo] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotInput>({ resolver: zodResolver(forgotSchema), defaultValues: { email: "" } });

  if (sentTo)
    return (
      <div role="status" className="text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><MailCheck size={30} aria-hidden="true" /></span>
        <h1 className="text-2xl font-bold text-navy-900">{t(bi("تحقق من بريدك الإلكتروني", "Check your email"))}</h1>
        <p className="mt-3 text-base leading-8 text-muted">
          {t(bi("لو كان هناك حساب مرتبط بالعنوان", "If an account exists for"))} <span dir="ltr" className="font-semibold text-navy-900">{sentTo}</span> {t(bi("فسنرسل رابطاً لإعادة التعيين. (محاكاة: لم يُرسل أي بريد فعلي.)", "we would send a reset link. (Simulated: no real email was sent.)"))}
        </p>
        <LinkButton href="/reset-password" className="mt-7 w-full" size="lg">{t(bi("فتح صفحة إعادة التعيين التجريبية", "Open the demo reset page"))}</LinkButton>
        <LinkButton href="/login" variant="ghost" className="mt-2 w-full">{t(bi("العودة لتسجيل الدخول", "Back to sign in"))}</LinkButton>
      </div>
    );

  return (
    <>
      <AuthHeading title={t(bi("نسيت كلمة المرور؟", "Forgot your password?"))} text={t(bi("أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.", "Enter your email and we'll send you a reset link."))} />
      <form noValidate onSubmit={handleSubmit(async (v) => { await new Promise((r) => setTimeout(r, 600)); setSentTo(v.email); })} className="space-y-5">
        <Field label={bi("البريد الإلكتروني", "Email")} required error={msg(errors.email?.message, locale)}>
          <input className="field" type="email" dir="ltr" autoComplete="email" {...register("email")} />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>{t(bi("إرسال رابط إعادة التعيين", "Send reset link"))}</Button>
      </form>
      <p className="mt-8 text-center text-sm"><Link href="/login" className="font-semibold text-flag-green hover:underline">{t(bi("العودة لتسجيل الدخول", "Back to sign in"))}</Link></p>
    </>
  );
}

/* ───────────── Reset password ───────────── */
export function ResetForm() {
  const { t, locale } = useI18n();
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<ResetInput>({ resolver: zodResolver(resetSchema), defaultValues: { password: "", confirm: "" } });

  if (done)
    return (
      <div role="status" className="text-center">
        <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600"><CheckCircle2 size={32} aria-hidden="true" /></span>
        <h1 className="text-2xl font-bold text-navy-900">{t(bi("تم تحديث كلمة المرور (محاكاة)", "Password updated (simulated)"))}</h1>
        <p className="mt-3 text-base leading-8 text-muted">{t(bi("لم تُحفظ كلمة المرور في أي مكان. يمكنك الآن تسجيل الدخول.", "Your password was not stored anywhere. You can now sign in."))}</p>
        <LinkButton href="/login" className="mt-7 w-full" size="lg">{t(bi("تسجيل الدخول", "Sign in"))}</LinkButton>
      </div>
    );

  return (
    <>
      <AuthHeading title={t(bi("إعادة تعيين كلمة المرور", "Reset your password"))} text={t(bi("اختر كلمة مرور جديدة قوية لحسابك.", "Choose a new, strong password for your account."))} />
      <form noValidate onSubmit={handleSubmit(async () => { await new Promise((r) => setTimeout(r, 600)); setDone(true); })} className="space-y-5">
        <Field label={bi("كلمة المرور الجديدة", "New password")} required hint={bi("8 أحرف على الأقل مع حرف ورقم.", "At least 8 characters with a letter and a number.")} error={msg(errors.password?.message, locale)}>
          <PasswordInput autoComplete="new-password" {...register("password")} />
        </Field>
        <PasswordStrength value={watch("password")} />
        <Field label={bi("تأكيد كلمة المرور", "Confirm password")} required error={msg(errors.confirm?.message, locale)}>
          <PasswordInput autoComplete="new-password" {...register("confirm")} />
        </Field>
        <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>{t(bi("تحديث كلمة المرور", "Update password"))}</Button>
      </form>
    </>
  );
}

/* ───────────── Email verification UI ───────────── */
export function VerifyEmail() {
  const { t } = useI18n();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "verifying" | "done">("idle");
  const [resent, setResent] = useState(false);
  return (
    <div role="status" className="text-center">
      <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-navy-50 text-navy-800"><MailCheck size={30} aria-hidden="true" /></span>
      <h1 className="text-2xl font-bold text-navy-900">{state === "done" ? t(bi("تم تأكيد البريد (محاكاة)", "Email verified (simulated)")) : t(bi("أكّد بريدك الإلكتروني", "Verify your email"))}</h1>
      <p className="mt-3 text-base leading-8 text-muted">
        {state === "done"
          ? t(bi("حسابك التجريبي جاهز. يمكنك الدخول إلى لوحة التحكم.", "Your demo account is ready. You can enter the dashboard."))
          : t(bi("في نسخة حقيقية سنرسل رابط تأكيد إلى بريدك. هنا يمكنك محاكاة الضغط على الرابط.", "In a real version we'd email you a confirmation link. Here you can simulate clicking it."))}
      </p>
      {state !== "done" ? (
        <div className="mt-7 space-y-3">
          <Button size="lg" className="w-full" loading={state === "verifying"} onClick={async () => { setState("verifying"); await api.auth.verifyEmail(); setState("done"); }}>{t(bi("محاكاة تأكيد البريد", "Simulate email verification"))}</Button>
          <Button variant="ghost" className="w-full" onClick={() => setResent(true)}>{resent ? t(bi("تمت إعادة الإرسال (محاكاة) ✓", "Resent (simulated) ✓")) : t(bi("إعادة إرسال الرسالة", "Resend email"))}</Button>
        </div>
      ) : (
        <Button size="lg" className="mt-7 w-full" onClick={() => router.push("/dashboard")}>{t(bi("الدخول إلى لوحة التحكم", "Go to dashboard"))}</Button>
      )}
    </div>
  );
}
