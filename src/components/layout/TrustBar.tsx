"use client";

import { ChevronDown, Lock, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

/** Plain red / white / black tricolour (no emblem — emblem is a protected state symbol). */
export function FlagMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 30 20" className={cn("h-4 w-6 rounded-[2px] ring-1 ring-white/20", className)} aria-hidden="true">
      <rect width="30" height="6.67" fill="#CE1126" />
      <rect y="6.67" width="30" height="6.67" fill="#fff" />
      <rect y="13.33" width="30" height="6.67" fill="#000" />
    </svg>
  );
}

export function TrustBar() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-navy-950 text-[12.5px] text-white/85">
      <div className="container-x py-1.5">
        <div className="flex min-h-7 flex-wrap items-center gap-x-4 gap-y-1">
          <FlagMark />
          <span>{t(bi("نموذج أولي مستقل — غير تابع لأي جهة حكومية ولا يمثل خدمات رسمية", "Independent prototype — not affiliated with any government body and not an official service"))}</span>
          <button type="button" aria-expanded={open} aria-controls="trust-detail" onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1 font-semibold text-white underline-offset-4 hover:underline">
            {t(bi("كيف تتحقق؟", "How to verify?"))}
            <ChevronDown size={14} aria-hidden="true" className={cn("transition-transform", open && "rotate-180")} />
          </button>
        </div>
        {open && (
          <div id="trust-detail" className="grid gap-4 border-t border-white/10 py-3 text-white/75 sm:grid-cols-2">
            <p className="flex items-start gap-2.5"><ShieldAlert size={16} className="mt-1 shrink-0 text-[#ff6b79]" aria-hidden="true" />{t(bi("هذه المنصة لم تُسجَّل لدى أي جهة حكومية. أي منصة رسمية يجب أن تعرض ما يثبت ذلك وتستخدم نطاقاً حكومياً رسمياً.", "This platform is not registered with any government body. An official platform must show proof of this and use an official government domain."))}</p>
            <p className="flex items-start gap-2.5"><Lock size={16} className="mt-1 shrink-0 text-[#ff6b79]" aria-hidden="true" />{t(bi("لا تُدخل بيانات حقيقية. كل البيانات هنا تجريبية وتُحفظ على جهازك فقط، ولا تُخزَّن كلمات المرور.", "Don't enter real data. Everything here is demo data kept on your device; passwords are never stored."))}</p>
          </div>
        )}
      </div>
    </div>
  );
}
