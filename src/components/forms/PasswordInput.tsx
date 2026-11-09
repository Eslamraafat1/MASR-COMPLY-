"use client";

import { Eye, EyeOff } from "lucide-react";
import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";

/** Password field with a visibility toggle. Always LTR so mixed Latin/digit passwords read correctly. */
export const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function PasswordInput(props, ref) {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input ref={ref} {...props} type={show ? "text" : "password"} dir="ltr" className="field !pe-12 text-start" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? t(bi("إخفاء كلمة المرور", "Hide password")) : t(bi("إظهار كلمة المرور", "Show password"))}
        aria-pressed={show}
        className="absolute end-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy-900"
      >
        {show ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
      </button>
    </div>
  );
});

/** Simple strength hint (length + variety). Informational only. */
export function PasswordStrength({ value }: { value: string }) {
  const { t } = useI18n();
  const score = [value.length >= 8, /[A-Za-z؀-ۿ]/.test(value) && /\d/.test(value), value.length >= 12, /[^A-Za-z0-9؀-ۿ]/.test(value)].filter(Boolean).length;
  const labels = [bi("ضعيفة", "Weak"), bi("مقبولة", "Fair"), bi("جيدة", "Good"), bi("قوية", "Strong"), bi("قوية جداً", "Very strong")];
  const colors = ["bg-flag-red", "bg-amber-500", "bg-amber-400", "bg-emerald-600", "bg-emerald-600"];
  if (!value) return null;
  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => <span key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score] : "bg-line"}`} />)}
      </div>
      <p className="mt-1 text-xs text-muted">{t(bi("قوة كلمة المرور:", "Password strength:"))} {t(labels[score])}</p>
    </div>
  );
}
