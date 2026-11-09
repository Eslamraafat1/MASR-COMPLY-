"use client";

import { AlertTriangle, SearchX } from "lucide-react";
import type { ReactNode } from "react";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} aria-hidden="true" />;
}

export function CardSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 rounded-xl border border-line bg-white p-5" role="status" aria-busy="true">
      <Skeleton className="h-5 w-1/3" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className={i % 2 ? "w-4/5" : "w-full"} />
      ))}
      <span className="sr-only">Loading…</span>
    </div>
  );
}

export function EmptyState({ icon, title, text, action }: { icon?: ReactNode; title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#cfd7e3] bg-white px-6 py-14 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-navy-50 text-navy-700">{icon ?? <SearchX size={26} aria-hidden="true" />}</div>
      <h3 className="text-base font-bold text-navy-900">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ onRetry, message }: { onRetry?: () => void; message?: string }) {
  const { t } = useI18n();
  return (
    <div role="alert" className="flex flex-col items-center rounded-xl border border-red-200 bg-flag-red-soft/60 px-6 py-12 text-center">
      <div className="mb-4 grid size-14 place-items-center rounded-2xl bg-white text-flag-red">
        <AlertTriangle size={26} aria-hidden="true" />
      </div>
      <h3 className="text-base font-bold text-navy-900">{t(bi("تعذر تحميل البيانات", "Couldn't load data"))}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{message ?? t(bi("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.", "Something went wrong. Please try again."))}</p>
      {onRetry && (
        <Button className="mt-5" variant="outline" onClick={onRetry}>
          {t(bi("إعادة المحاولة", "Try again"))}
        </Button>
      )}
    </div>
  );
}
