"use client";

import { Bell, Boxes, CircleAlert, ClipboardCheck, BadgeCheck, PackagePlus, Radar, Ship, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ApplicationStatusBadge, PageHeader, Panel } from "@/components/dashboard/shared";
import { DemoTag } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";
import { CardSkeleton, ErrorState } from "@/components/ui/States";
import { ACCOUNT_TYPE_LABEL } from "@/lib/data/content";
import { APPLICATION_STATUS } from "@/lib/data/status";
import { useQuery } from "@/lib/hooks/use-demo";
import { useSession } from "@/lib/hooks/use-session";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import { cn, formatDate, formatDateTime, formatNumber } from "@/lib/utils";

const SEG: Record<string, string> = {
  neutral: "bg-slate-400",
  info: "bg-sky-500",
  navy: "bg-navy-600",
  warning: "bg-amber-500",
  success: "bg-emerald-600",
  danger: "bg-flag-red",
};

export default function OverviewPage() {
  const { t, locale } = useI18n();
  const { user } = useSession();
  const q = useQuery(() => api.dashboard.summary(), []);

  if (q.error) return <ErrorState onRetry={q.refetch} />;
  if (!q.data)
    return (
      <div className="space-y-4">
        <CardSkeleton rows={2} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <CardSkeleton key={i} rows={1} />
          ))}
        </div>
        <CardSkeleton rows={5} />
      </div>
    );
  const d = q.data;
  const total = d.distribution.reduce((n, x) => n + x.count, 0) || 1;

  const cards = [
    { icon: Boxes, label: bi("المنتجات", "Products"), value: d.products, href: "/dashboard/products", tone: "bg-navy-50 text-navy-800" },
    { icon: ClipboardCheck, label: bi("طلبات مفتوحة", "Open requests"), value: d.openApplications, href: "/dashboard/applications", tone: "bg-sky-50 text-sky-800" },
    { icon: BadgeCheck, label: bi("شهادات سارية", "Active certificates"), value: d.certificates, href: "/dashboard/certificates", tone: "bg-emerald-50 text-emerald-600" },
    { icon: CircleAlert, label: bi("إجراءات مطلوبة", "Actions required"), value: d.actionsRequired, href: "/dashboard/applications", tone: "bg-amber-50 text-amber-800" },
  ];
  const quick = [
    { icon: PackagePlus, label: bi("تسجيل منتج", "Register product"), href: "/dashboard/products/new" },
    { icon: ClipboardCheck, label: bi("طلب مطابقة جديد", "New conformity request"), href: "/dashboard/applications/new" },
    { icon: Ship, label: bi("مستندات الشحنات", "Shipment documents"), href: "/dashboard/shipments" },
    { icon: Radar, label: bi("متابعة طلب", "Track a request"), href: "/track" },
  ];

  return (
    <div>
      <PageHeader
        title={`${t(bi("مرحباً", "Welcome"))}${user ? `، ${user.name}` : ""}`}
        text={t(bi("هذه نظرة سريعة على نشاط حسابك في مساحة العمل التجريبية.", "A quick look at your account activity in the demo workspace."))}
        actions={
          <Link href="/dashboard/products/new" className={buttonClasses("primary")}>
            <PackagePlus size={17} aria-hidden="true" /> {t(bi("تسجيل منتج", "Register product"))}
          </Link>
        }
      />

      <Reveal>
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 rounded-xl border border-line bg-white p-5 shadow-card">
          <span className="grid size-11 place-items-center rounded-xl bg-navy-900 text-[#ff6b79]">
            <ShieldCheck size={22} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-navy-900">{user?.organization}</p>
            <p className="text-xs text-muted">{user && t(ACCOUNT_TYPE_LABEL[user.accountType])}</p>
          </div>
          <ul className="flex flex-wrap items-center gap-2 text-xs font-semibold sm:ms-auto">
            <li className={cn("rounded-full px-3 py-1", user?.emailVerified ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-900")}>
              {user?.emailVerified ? t(bi("البريد مؤكد", "Email verified")) : t(bi("البريد غير مؤكد", "Email not verified"))}
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full bg-gold-soft px-3 py-1 text-[#7a5d1c]">
              <DemoTag className="!border-0 !bg-transparent !p-0" /> {t(bi("مساحة عمل تجريبية", "Demo workspace"))}
            </li>
          </ul>
        </div>
      </Reveal>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c, i) => (
          <Reveal key={i} delay={i * 0.05}>
            <Link href={c.href} className="group block rounded-xl border border-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift">
              <span className={cn("grid size-10 place-items-center rounded-lg", c.tone)}>
                <c.icon size={20} aria-hidden="true" />
              </span>
              <p className="ltr-num mt-4 text-3xl font-bold text-navy-900">{formatNumber(c.value, locale)}</p>
              <p className="mt-0.5 text-sm text-muted">{t(c.label)}</p>
            </Link>
          </Reveal>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel
            title={t(bi("آخر الطلبات", "Recent requests"))}
            padded={false}
            action={
              <Link href="/dashboard/applications" className="text-sm font-semibold text-flag-green hover:underline">
                {t(bi("عرض الكل", "View all"))}
              </Link>
            }
          >
            <ul className="divide-y divide-line">
              {d.recentApplications.map((a) => (
                <li key={a.id}>
                  <Link href={`/dashboard/applications/${a.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 hover:bg-surface">
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-navy-900">{t(a.productName)}</span>
                      <span dir="ltr" className="block text-start text-xs text-muted">
                        {a.ref} · {formatDate(a.updatedAt, locale)}
                      </span>
                    </span>
                    <ApplicationStatusBadge status={a.status} />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title={t(bi("توزيع حالات الطلبات", "Request status distribution"))}
            action={<DemoTag />}
          >
            <div className="flex h-3 overflow-hidden rounded-full bg-surface" role="img" aria-label={t(bi("توزيع حالات الطلبات التجريبية", "Demo request status distribution"))}>
              {d.distribution
                .filter((x) => x.count > 0)
                .map((x) => (
                  <div key={x.status} className={SEG[APPLICATION_STATUS[x.status].tone]} style={{ width: `${(x.count / total) * 100}%` }} />
                ))}
            </div>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
              {d.distribution.map((x) => (
                <li key={x.status} className="flex items-center gap-2">
                  <span className={cn("size-2.5 shrink-0 rounded-full", SEG[APPLICATION_STATUS[x.status].tone])} aria-hidden="true" />
                  <span className="truncate text-muted">{t(APPLICATION_STATUS[x.status].label)}</span>
                  <span className="ltr-num ms-auto font-semibold text-navy-900">{x.count}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">{t(bi("أرقام توضيحية محسوبة من بيانات العرض التجريبية فقط.", "Illustrative figures computed from demo data only."))}</p>
          </Panel>

          <Panel title={t(bi("آخر الأنشطة", "Recent activity"))}>
            <ol className="relative space-y-4 border-s border-line ps-5">
              {d.activities.map((a) => (
                <li key={a.id} className="relative">
                  <span aria-hidden="true" className="absolute -start-[25px] top-1.5 size-2.5 rounded-full bg-navy-600 ring-4 ring-white" />
                  <p className="text-sm text-navy-900">{t(a.title)}</p>
                  <p className="text-xs text-muted">{formatDateTime(a.at, locale)}</p>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title={t(bi("إجراءات سريعة", "Quick actions"))}>
            <ul className="grid gap-2">
              {quick.map((x) => (
                <li key={x.href}>
                  <Link href={x.href} className="flex items-center gap-3 rounded-lg border border-line px-3.5 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-navy-900/30 hover:bg-surface">
                    <x.icon size={18} aria-hidden="true" className="text-navy-600" /> {t(x.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel
            title={t(bi("الإشعارات", "Notifications"))}
            padded={false}
            action={
              <Link href="/dashboard/notifications" className="text-sm font-semibold text-flag-green hover:underline">
                {t(bi("الكل", "All"))}
              </Link>
            }
          >
            <ul className="divide-y divide-line">
              {d.notifications.map((n) => (
                <li key={n.id} className="flex gap-3 px-5 py-3.5">
                  <Bell size={16} aria-hidden="true" className={cn("mt-1 shrink-0", n.read ? "text-muted" : "text-flag-red")} />
                  <div className="min-w-0">
                    <p className={cn("text-sm", n.read ? "text-ink" : "font-semibold text-navy-900")}>{t(n.title)}</p>
                    <p className="line-clamp-2 text-xs leading-5 text-muted">{t(n.body)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
