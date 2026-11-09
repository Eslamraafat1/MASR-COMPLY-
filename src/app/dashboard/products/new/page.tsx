"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CircleCheckBig, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { msg } from "@/components/forms/messages";
import { PageHeader, Panel, Info } from "@/components/dashboard/shared";
import { DemoTag } from "@/components/ui/Badge";
import { Button, buttonClasses } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { Stepper } from "@/components/ui/Stepper";
import { CATEGORIES, COUNTRIES, categoryLabel, countryLabel } from "@/lib/data/reference";
import { useQuery } from "@/lib/hooks/use-demo";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { PRODUCT_STEP_FIELDS, productSchema, type ProductInput } from "@/lib/schemas";
import { api } from "@/lib/services/api";
import type { DocumentFile, Product } from "@/lib/types";
import { formatBytes } from "@/lib/utils";

const STEPS = [bi("البيانات الأساسية", "Basics"), bi("البيانات الفنية", "Technical"), bi("الصور والمستندات", "Images & documents"), bi("المراجعة والتقديم", "Review & submit")];

type Draft = { values: Partial<ProductInput>; images: DocumentFile[]; docs: DocumentFile[]; step: number };
const EMPTY: ProductInput = { nameAr: "", nameEn: "", category: "", brand: "", model: "", origin: "", manufacturer: "", hsCode: "", description: "", facilityId: "" };

export default function NewProductPage() {
  const { t, locale, isRtl } = useI18n();
  const [step, setStep] = useState(0);
  const [images, setImages] = useState<DocumentFile[]>([]);
  const [docs, setDocs] = useState<DocumentFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<Product | null>(null);
  const [savedAt, setSavedAt] = useState<"idle" | "saving" | "saved">("idle");
  const [restored, setRestored] = useState(false);
  const facilities = useQuery(() => api.facilities.list(), []);

  const { register, trigger, getValues, reset, formState: { errors } } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: EMPTY,
    mode: "onTouched",
  });
  const e = (k: keyof ProductInput) => msg(errors[k]?.message, locale);

  useEffect(() => {
    let alive = true;
    api.products.getDraft().then((d) => {
      if (!alive || !d) return;
      const draft = d as Draft;
      reset({ ...EMPTY, ...draft.values });
      setImages(draft.images ?? []);
      setDocs(draft.docs ?? []);
      setStep(Math.min(draft.step ?? 0, 3));
      setRestored(true);
    });
    return () => {
      alive = false;
    };
  }, [reset]);

  const saveDraft = async () => {
    setSavedAt("saving");
    await api.products.saveDraft({ values: getValues(), images, docs, step } satisfies Draft);
    setSavedAt("saved");
  };

  const next = async () => {
    const fields = PRODUCT_STEP_FIELDS[step];
    if (fields && !(await trigger(fields))) return;
    setStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  const submit = async () => {
    if (!(await trigger())) {
      setStep(0);
      return;
    }
    setSubmitting(true);
    const p = await api.products.create(getValues(), [...images, ...docs]);
    setSubmitting(false);
    setDone(p);
  };

  const Prev = isRtl ? ArrowRight : ArrowLeft;
  const Nxt = isRtl ? ArrowLeft : ArrowRight;

  if (done) {
    return (
      <div className="mx-auto max-w-xl py-10 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CircleCheckBig size={34} aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-2xl font-bold text-navy-900">{t(bi("تم تسجيل المنتج (تجريبي)", "Product registered (demo)"))}</h1>
        <p className="mt-2 text-sm leading-7 text-muted">{t(bi("أُضيف المنتج إلى سجلك بحالة «قيد المراجعة». هذا إجراء محاكاة وليس تسجيلاً رسمياً.", "The product was added to your register as “Pending review”. This is a simulation, not an official registration."))}</p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line bg-white px-4 py-2 text-sm font-semibold text-navy-900">
          <span dir="ltr">{done.ref}</span> <DemoTag />
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={`/dashboard/products/${done.id}`} className={buttonClasses("primary")}>{t(bi("عرض المنتج", "View product"))}</Link>
          <Link href={`/dashboard/applications/new?product=${done.id}`} className={buttonClasses("outline")}>{t(bi("بدء طلب مطابقة", "Start a conformity request"))}</Link>
          <Link href="/dashboard/products" className={buttonClasses("ghost")}>{t(bi("كل المنتجات", "All products"))}</Link>
        </div>
      </div>
    );
  }

  const v = getValues();
  const cat = categoryLabel(v.category);
  const country = countryLabel(v.origin);
  const facility = facilities.data?.find((f) => f.id === v.facilityId);

  return (
    <div>
      <PageHeader
        back={{ href: "/dashboard/products", label: t(bi("منتجاتي", "My products")) }}
        title={t(bi("تسجيل منتج جديد", "Register a new product"))}
        text={t(bi("أكمل الخطوات التالية. يمكنك حفظ مسودة والعودة لاحقاً.", "Complete the steps below. You can save a draft and return later."))}
        actions={
          <Button variant="outline" onClick={saveDraft} loading={savedAt === "saving"}>
            <Save size={16} aria-hidden="true" /> {t(bi("حفظ كمسودة", "Save draft"))}
          </Button>
        }
      />
      <div className="mb-6 rounded-xl border border-line bg-white p-5 shadow-card sm:px-8">
        <Stepper steps={STEPS} current={step} />
      </div>
      <div aria-live="polite" className="mb-4 min-h-5 text-sm">
        {restored && step >= 0 && savedAt === "idle" && <p className="text-emerald-800">{t(bi("تمت استعادة المسودة المحفوظة.", "Saved draft restored."))}</p>}
        {savedAt === "saved" && <p className="text-emerald-800">{t(bi("تم حفظ المسودة على جهازك.", "Draft saved on your device."))}</p>}
      </div>

      <form onSubmit={(ev) => ev.preventDefault()} noValidate>
        <Panel title={t(STEPS[step])}>
          {step === 0 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={bi("اسم المنتج بالعربية", "Product name (Arabic)")} required error={e("nameAr")}>
                <input className="field" dir="rtl" {...register("nameAr")} />
              </Field>
              <Field label={bi("اسم المنتج بالإنجليزية", "Product name (English)")} required error={e("nameEn")}>
                <input className="field" dir="ltr" {...register("nameEn")} />
              </Field>
              <Field label={bi("فئة المنتج", "Product category")} required error={e("category")}>
                <select className="field" {...register("category")}>
                  <option value="">{t(bi("اختر…", "Select…"))}</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{t(c.title)}</option>
                  ))}
                </select>
              </Field>
              <Field label={bi("العلامة التجارية", "Brand")} required error={e("brand")}>
                <input className="field" {...register("brand")} />
              </Field>
              <Field label={bi("رقم الموديل", "Model number")} required error={e("model")}>
                <input className="field" dir="ltr" {...register("model")} />
              </Field>
              <div className="hidden sm:block" />
              <Field className="sm:col-span-2" label={bi("وصف المنتج", "Product description")} required error={e("description")} hint={bi("20 حرفاً على الأقل.", "At least 20 characters.")}>
                <textarea rows={4} className="field" {...register("description")} />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={bi("بلد المنشأ", "Country of origin")} required error={e("origin")}>
                <select className="field" {...register("origin")}>
                  <option value="">{t(bi("اختر…", "Select…"))}</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.id} value={c.id}>{t(c.title)}</option>
                  ))}
                </select>
              </Field>
              <Field label={bi("المصنّع", "Manufacturer")} required error={e("manufacturer")}>
                <input className="field" {...register("manufacturer")} />
              </Field>
              <Field label={bi("رمز النظام المنسق (HS)", "HS code")} optional error={e("hsCode")} hint={bi("إن وجد — مثل 8516 أو 8516.10", "If applicable — e.g. 8516 or 8516.10")}>
                <input className="field" dir="ltr" inputMode="numeric" {...register("hsCode")} />
              </Field>
              <Field label={bi("المنشأة المسؤولة", "Responsible facility")} optional>
                <select className="field" {...register("facilityId")}>
                  <option value="">{t(bi("بدون تحديد", "Not specified"))}</option>
                  {facilities.data?.map((f) => (
                    <option key={f.id} value={f.id}>{t(f.name)}</option>
                  ))}
                </select>
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <h3 className="mb-1 text-sm font-bold text-navy-900">{t(bi("صور المنتج", "Product images"))}</h3>
                <p className="mb-3 text-xs text-muted">{t(bi("لأغراض العرض يُحفظ اسم الملف وحجمه فقط — لا يتم رفع الملفات.", "For demo purposes only the file name and size are kept — files are not uploaded."))}</p>
                <FileDropzone files={images} onChange={setImages} accept="image/jpeg,image/png,image/webp" label={t(bi("أضف صور المنتج", "Add product images"))} />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-bold text-navy-900">{t(bi("المستندات الداعمة", "Supporting documents"))}</h3>
                <FileDropzone files={docs} onChange={setDocs} accept="application/pdf" label={t(bi("أضف المستندات الداعمة (PDF)", "Add supporting documents (PDF)"))} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="mb-5 rounded-lg bg-gold-soft px-4 py-3 text-sm text-[#7a5d1c]">{t(bi("راجع البيانات قبل التقديم. هذه محاكاة ولا تمثل تسجيلاً رسمياً.", "Review before submitting. This is a simulation and not an official registration."))}</p>
              <dl className="grid gap-5 sm:grid-cols-2">
                <Info label={t(bi("الاسم بالعربية", "Name (Arabic)"))}>{v.nameAr}</Info>
                <Info label={t(bi("الاسم بالإنجليزية", "Name (English)"))}>{v.nameEn}</Info>
                <Info label={t(bi("الفئة", "Category"))}>{cat ? t(cat) : "-"}</Info>
                <Info label={t(bi("العلامة / الموديل", "Brand / Model"))}>{v.brand} / <span dir="ltr">{v.model}</span></Info>
                <Info label={t(bi("بلد المنشأ", "Origin"))}>{country ? t(country) : "-"}</Info>
                <Info label={t(bi("المصنّع", "Manufacturer"))}>{v.manufacturer}</Info>
                <Info label={t(bi("رمز HS", "HS code"))}><span dir="ltr">{v.hsCode || "—"}</span></Info>
                <Info label={t(bi("المنشأة", "Facility"))}>{facility ? t(facility.name) : "—"}</Info>
                <div className="sm:col-span-2"><Info label={t(bi("الوصف", "Description"))}>{v.description}</Info></div>
              </dl>
              <div className="mt-6 border-t border-line pt-5">
                <p className="mb-2 text-sm font-bold text-navy-900">{t(bi("الملفات", "Files"))} (<span className="ltr-num">{images.length + docs.length}</span>)</p>
                {images.length + docs.length === 0 ? (
                  <p className="text-sm text-muted">{t(bi("لا توجد ملفات مرفقة.", "No files attached."))}</p>
                ) : (
                  <ul className="space-y-1 text-sm text-muted">
                    {[...images, ...docs].map((f) => (
                      <li key={f.id} className="flex justify-between gap-3"><span dir="ltr" className="truncate">{f.name}</span><span>{formatBytes(f.size)}</span></li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </Panel>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={back} disabled={step === 0}>
            <Prev size={16} aria-hidden="true" className="" /> {t(bi("السابق", "Back"))}
          </Button>
          {step < 3 ? (
            <Button onClick={next}>
              {t(bi("التالي", "Next"))} <Nxt size={16} aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="accent" loading={submitting} onClick={submit}>
              {t(bi("تقديم (محاكاة)", "Submit (simulated)"))}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
