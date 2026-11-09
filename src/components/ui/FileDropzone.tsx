"use client";

import { FileImage, FileText, Trash2, UploadCloud } from "lucide-react";
import { useId, useRef, useState } from "react";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { ALLOWED_FILE_TYPES, MAX_FILE_BYTES, MAX_FILES, validateFile, type FileIssue } from "@/lib/schemas";
import type { DocumentFile } from "@/lib/types";
import { cn, formatBytes, uid } from "@/lib/utils";

const ISSUE: Record<FileIssue, ReturnType<typeof bi>> = {
  type: bi("نوع الملف غير مدعوم (المسموح: PDF أو JPG أو PNG أو WEBP).", "Unsupported file type (allowed: PDF, JPG, PNG, WEBP)."),
  size: bi("حجم الملف أكبر من 5 ميجابايت.", "File is larger than 5 MB."),
  count: bi(`الحد الأقصى ${MAX_FILES} ملفات.`, `Maximum ${MAX_FILES} files.`),
  duplicate: bi("هذا الملف مضاف بالفعل.", "This file is already added."),
};

/**
 * Drag-and-drop uploader with validation. Demo only: files are NOT uploaded anywhere — only
 * metadata (name, size, type) is retained so the prototype can show realistic document handling.
 */
export function FileDropzone({
  files,
  onChange,
  label,
  accept = ALLOWED_FILE_TYPES.join(","),
  multiple = true,
}: {
  files: DocumentFile[];
  onChange: (f: DocumentFile[]) => void;
  label: string;
  accept?: string;
  multiple?: boolean;
}) {
  const { t } = useI18n();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const ingest = (list: FileList | null) => {
    if (!list) return;
    const next = [...files];
    const errs: string[] = [];
    for (const f of Array.from(list)) {
      const issue = validateFile(f, next);
      if (issue) errs.push(`${f.name}: ${t(ISSUE[issue])}`);
      else next.push({ id: uid("file"), name: f.name, size: f.size, type: f.type, uploadedAt: new Date().toISOString() });
    }
    setErrors(errs);
    onChange(multiple ? next : next.slice(-1));
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <label
        htmlFor={inputId}
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          ingest(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-9 text-center transition-colors focus-within:border-flag-green focus-within:ring-4 focus-within:ring-flag-green/15",
          drag ? "border-flag-green bg-flag-green-soft" : "border-[#c5cfdc] bg-surface/60 hover:border-navy-600 hover:bg-surface",
        )}
      >
        <span className="grid size-12 place-items-center rounded-full bg-white text-navy-800 shadow-card">
          <UploadCloud size={22} aria-hidden="true" />
        </span>
        <span className="text-sm font-semibold text-navy-900">{label}</span>
        <span className="text-xs text-muted">
          {t(bi("اسحب الملفات وأفلتها هنا أو اضغط للاختيار", "Drag & drop files here or click to browse"))} · PDF / JPG / PNG · {t(bi("حتى", "up to"))} {formatBytes(MAX_FILE_BYTES)}
        </span>
        <input ref={inputRef} id={inputId} type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(e) => ingest(e.target.files)} />
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1 rounded-lg bg-flag-red-soft px-4 py-3 text-xs font-medium text-flag-red-dark">
          {errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      {files.length > 0 && (
        <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
          {files.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-4 py-2.5">
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-700">{f.type.startsWith("image/") ? <FileImage size={18} aria-hidden="true" /> : <FileText size={18} aria-hidden="true" />}</span>
              <span className="min-w-0 flex-1">
                <span dir="ltr" className="block truncate text-start text-sm font-medium text-navy-900">
                  {f.name}
                </span>
                <span className="text-xs text-muted">{formatBytes(f.size)}</span>
              </span>
              <button type="button" onClick={() => onChange(files.filter((x) => x.id !== f.id))} aria-label={`${t(bi("حذف", "Remove"))} ${f.name}`} className="grid size-9 place-items-center rounded-lg text-muted hover:bg-flag-red-soft hover:text-flag-red">
                <Trash2 size={16} aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
