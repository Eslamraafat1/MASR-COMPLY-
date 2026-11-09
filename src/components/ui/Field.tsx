"use client";

import { AlertCircle } from "lucide-react";
import { useId, type ReactElement, cloneElement, isValidElement } from "react";
import type { Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Accessible form field. Shows the label in the active language with the other language as a
 * secondary hint (bilingual field labels). Injects id / aria-* into its single child control.
 */
export function Field({
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: {
  label: Bi;
  hint?: Bi | string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: ReactElement<{ id?: string; "aria-invalid"?: boolean; "aria-describedby"?: string; "aria-required"?: boolean }>;
  className?: string;
}) {
  const { locale, t } = useI18n();
  const id = useId();
  const other = locale === "ar" ? label.en : label.ar;
  const hintText = typeof hint === "string" ? hint : hint ? t(hint) : undefined;
  const describedBy = [hintText ? `${id}-hint` : null, error ? `${id}-err` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex flex-wrap items-baseline gap-x-2 text-sm font-semibold text-navy-900">
        <span>
          {t(label)}
          {required && (
            <span className="ms-1 text-flag-red" aria-hidden="true">
              *
            </span>
          )}
        </span>
        <span lang={locale === "ar" ? "en" : "ar"} className="text-xs font-normal text-muted">
          {other}
        </span>
        {optional && <span className="ms-auto text-xs font-normal text-muted">{t({ ar: "اختياري", en: "Optional" })}</span>}
      </label>
      {isValidElement(children) &&
        cloneElement(children, {
          id,
          "aria-invalid": error ? true : undefined,
          "aria-describedby": describedBy,
          "aria-required": required || undefined,
        })}
      {hintText && !error && (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hintText}
        </p>
      )}
      {error && (
        <p id={`${id}-err`} role="alert" className="flex items-center gap-1.5 text-xs font-medium text-flag-red-dark">
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
