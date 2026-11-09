"use client";

import { AlertTriangle, Bell, CheckCheck, CircleCheckBig, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard/shared";
import { Button } from "@/components/ui/Button";
import { CardSkeleton, EmptyState, ErrorState } from "@/components/ui/States";
import { useQuery } from "@/lib/hooks/use-demo";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { api } from "@/lib/services/api";
import { cn, formatDateTime } from "@/lib/utils";

const KIND = {
  info: { icon: Info, cls: "bg-sky-50 text-sky-700" },
  action: { icon: Bell, cls: "bg-amber-50 text-amber-800" },
  success: { icon: CircleCheckBig, cls: "bg-emerald-50 text-emerald-600" },
  warning: { icon: AlertTriangle, cls: "bg-flag-red-soft text-flag-red" },
} as const;

export default function NotificationsPage() {
  const { t, locale } = useI18n();
  const q = useQuery(() => api.notifications.list(), []);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const list = (q.data ?? []).filter((n) => !unreadOnly || !n.read);
  const unread = (q.data ?? []).filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title={t(bi("الإشعارات", "Notifications"))}
        text={t(bi("إشعارات توضيحية من مساحة العمل التجريبية.", "Illustrative notifications from the demo workspace."))}
        actions={
          <>
            <Button variant={unreadOnly ? "primary" : "outline"} aria-pressed={unreadOnly} onClick={() => setUnreadOnly((x) => !x)}>
              {t(bi("غير المقروءة", "Unread only"))} (<span className="ltr-num">{unread}</span>)
            </Button>
            <Button variant="outline" disabled={unread === 0} onClick={() => api.notifications.markRead()}>
              <CheckCheck size={16} aria-hidden="true" /> {t(bi("تحديد الكل كمقروء", "Mark all read"))}
            </Button>
          </>
        }
      />
      {q.error ? (
        <ErrorState onRetry={q.refetch} />
      ) : !q.data ? (
        <CardSkeleton rows={5} />
      ) : list.length === 0 ? (
        <EmptyState title={t(bi("لا توجد إشعارات", "No notifications"))} text={t(bi("أنت على اطلاع بكل شيء.", "You're all caught up."))} />
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
          {list.map((n) => {
            const K = KIND[n.kind];
            return (
              <li key={n.id} className={cn("flex gap-4 p-4 sm:p-5", !n.read && "bg-navy-50/50")}>
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", K.cls)}>
                  <K.icon size={19} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3">
                    <p className={cn("text-sm", n.read ? "font-medium text-ink" : "font-bold text-navy-900")}>{t(n.title)}</p>
                    {!n.read && <span className="size-2 rounded-full bg-flag-red" aria-label={t(bi("غير مقروء", "Unread"))} />}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted">{t(n.body)}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs">
                    <span className="text-muted">{formatDateTime(n.at, locale)}</span>
                    {n.href && (
                      <Link href={n.href} onClick={() => api.notifications.markRead(n.id)} className="font-semibold text-flag-green hover:underline">
                        {t(bi("فتح", "Open"))}
                      </Link>
                    )}
                    {!n.read && (
                      <button type="button" onClick={() => api.notifications.markRead(n.id)} className="font-semibold text-navy-700 hover:underline">
                        {t(bi("تحديد كمقروء", "Mark read"))}
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
