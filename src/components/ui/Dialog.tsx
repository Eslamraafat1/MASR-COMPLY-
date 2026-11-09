"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { useI18n } from "@/lib/i18n/provider";
import { bi } from "@/lib/i18n/config";

/**
 * Accessible modal built on the native <dialog>: focus is trapped by the browser, Esc closes,
 * background is inert, and focus returns to the trigger on close.
 */
export function Dialog({ open, onClose, title, description, children, footer }: { open: boolean; onClose: () => void; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useI18n();
  const titleId = useId();
  const descId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.body.style.overflow = "hidden";
    }
    if (!open && d.open) d.close();
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="modal"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="m-4 w-[min(32rem,calc(100vw-2rem))] rounded-2xl border border-line bg-white shadow-pop">
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-4">
          <div>
            <h2 id={titleId} className="text-lg font-bold text-navy-900">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-sm text-muted">
                {description}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} aria-label={t(bi("إغلاق", "Close"))} className="grid size-9 shrink-0 place-items-center rounded-lg text-muted hover:bg-surface hover:text-navy-900">
            <X size={18} aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[65dvh] overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-3 border-t border-line bg-surface/60 px-6 py-4">{footer}</div>}
      </div>
    </dialog>
  );
}
