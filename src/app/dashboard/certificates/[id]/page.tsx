"use client";

import { Printer } from "lucide-react";
import { use, useMemo } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { CertificateStatusBadge, PageHeader } from "@/components/dashboard/shared";
import { Button, LinkButton } from "@/components/ui/Button";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useQuery } from "@/lib/hooks/use-demo";
import { ApiError, api } from "@/lib/services/api";
import { formatDate } from "@/lib/utils";

/** Decorative, deterministic pattern — intentionally NOT a scannable QR code. */
function FakeCode({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 0;
    for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    const out: boolean[] = [];
    for (let i = 0; i < 81; i++) {
      h = (h * 1664525 + 1013904223) >>> 0;
      out.push((h >>> 28) % 2 === 0);
    }
    return out;
  }, [seed]);
  return (
    <div className="inline-block rounded-md border border-line p-1.5" aria-hidden="true">
      <div className="grid grid-cols-9 gap-px" style={{ width: 72 }}>
        {cells.map((on, i) => (
          <span key={i} className={on ? "aspect-square bg-navy-900" : "aspect-square bg-navy-50"} />
        ))}
      </div>
    </div>
  );
}

export default function CertificateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { t, locale } = useI18n();
  const q = useQuery(() => api.certificates.get(id), [id]);
  const back = { href: "/dashboard/certificates", label: t(bi("الشهادات", "Certificates")) };

  if (q.error) {
    if (q.error instanceof ApiError && q.error.code === "not_found")
      return <EmptyState title={t(bi("الشهادة غير موجودة", "Certificate not found"))} action={<LinkButton href="/dashboard/certificates" variant="primary">{t(bi("العودة", "Back"))}</LinkButton>} />;
    return <ErrorState onRetry={q.refetch} />;
  }
  if (q.loading || !q.data) return <CardSkeleton rows={8} />;
  const c = q.data;

  const rows: [string, string][] = [
    [t(bi("اسم الحائز", "Holder")), c.holder],
    [t(bi("المنتج", "Product")), t(c.productName)],
    [t(bi("نظام التقييم", "Scheme")), t(c.scheme)],
    [t(bi("مرجع الطلب", "Application ref.")), c.applicationRef],
    [t(bi("تاريخ الإصدار", "Date of issue")), formatDate(c.issuedAt, locale)],
    [t(bi("تاريخ الانتهاء", "Valid until")), formatDate(c.expiresAt, locale)],
  ];

  return (
    <>
      <div className="no-print">
        <PageHeader
          back={back}
          title={c.ref}
          text={t(bi("معاينة مستند تجريبي — غير صالح قانونياً.", "Preview of a demonstration document — not legally valid."))}
          actions={
            <>
              <CertificateStatusBadge status={c.status} />
              <Button variant="primary" onClick={() => window.print()}>
                <Printer size={17} aria-hidden="true" /> {t(bi("طباعة", "Print"))}
              </Button>
            </>
          }
        />
      </div>

      <div className="mx-auto w-full max-w-[820px]">
        <article aria-label={t(bi("معاينة الشهادة", "Certificate preview"))} className="relative aspect-auto overflow-hidden bg-white p-3 shadow-lift sm:aspect-[1/1.414] sm:p-5">
          {/* geometric double border */}
          <div className="relative flex h-full flex-col border-2 border-navy-900 p-1.5">
            <div className="relative flex h-full flex-col border border-gold/70 px-5 py-8 sm:px-12 sm:py-12">
              <div aria-hidden="true" className="pattern-lattice-light pointer-events-none absolute inset-0 opacity-70" />
              {/* DEMO watermark */}
              <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
                <span dir="ltr" className="-rotate-[28deg] select-none text-[5.5rem] font-black tracking-[0.2em] text-flag-red/[0.08] sm:text-[9rem]">DEMO</span>
              </div>

              <header className="relative flex flex-col items-center text-center">
                <LogoMark size={56} />
                <p dir="ltr" className="mt-3 text-sm font-extrabold tracking-[0.3em] text-navy-900">MASR COMPLY</p>
                <div className="my-5 flex w-40 items-center" aria-hidden="true">
                  <span className="h-[3px] flex-1 bg-flag-red" /><span className="h-[3px] flex-1 bg-white ring-0" /><span className="h-[3px] flex-1 bg-navy-900" />
                </div>
                <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">{t(bi("شهادة مطابقة (نموذج)", "Certificate of Conformity (Sample)"))}</h2>
                <p className="mt-2 text-xs font-bold tracking-widest text-flag-red">DEMONSTRATION DOCUMENT — NOT LEGALLY VALID</p>
              </header>

              <p className="relative mx-auto mt-8 max-w-lg text-center text-sm leading-7 text-muted">
                {t(bi("يُظهر هذا المستند التجريبي كيف قد تُعرض شهادة مطابقة داخل المنصة. لا يُعد اعتماداً أو موافقة من أي جهة.", "This demonstration document shows how a conformity certificate might appear in the platform. It is not an approval or endorsement by any authority."))}
              </p>

              <dl className="relative mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {rows.map(([k, v]) => (
                  <div key={k} className="border-b border-line pb-2.5">
                    <dt className="text-xs font-medium text-muted">{k}</dt>
                    <dd className="mt-1 text-[15px] font-semibold text-navy-900"><bdi>{v}</bdi></dd>
                  </div>
                ))}
              </dl>

              <footer className="relative mt-auto flex items-end justify-between gap-4 pt-10">
                <div>
                  <p className="text-xs text-muted">{t(bi("رقم الشهادة", "Certificate no."))}</p>
                  <p dir="ltr" className="text-start font-bold tracking-wide text-navy-900">{c.ref}</p>
                  <span className="mt-3 inline-flex rounded bg-flag-green px-2 py-0.5 text-[10px] font-bold tracking-widest text-white">DEMO</span>
                </div>
                <div className="text-center">
                  <FakeCode seed={c.ref} />
                  <p className="mt-1 text-[10px] font-bold tracking-widest text-muted">DEMO · NOT SCANNABLE</p>
                </div>
              </footer>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
