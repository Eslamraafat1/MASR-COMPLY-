"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LifeBuoy, LogOut, Menu, RotateCcw, X } from "lucide-react";
import {
  BadgeCheck,
  Building2,
  ClipboardCheck,
  LayoutDashboard,
  Landmark,
  Package,
  Settings,
  Ship,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { DemoTag } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/States";
import { ACCOUNT_TYPE_LABEL } from "@/lib/data/content";
import { bi, type Bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useDemoState } from "@/lib/hooks/use-demo";
import { useSession } from "@/lib/hooks/use-session";
import { api } from "@/lib/services/api";
import { cn } from "@/lib/utils";

const ITEMS: { href: string; label: Bi; icon: typeof Package; exact?: boolean }[] = [
  { href: "/dashboard", label: bi("نظرة عامة", "Overview"), icon: LayoutDashboard, exact: true },
  { href: "/dashboard/facilities", label: bi("منشآتي", "My facilities"), icon: Building2 },
  { href: "/dashboard/products", label: bi("منتجاتي", "My products"), icon: Package },
  { href: "/dashboard/applications", label: bi("طلبات تقييم المطابقة", "Conformity requests"), icon: ClipboardCheck },
  { href: "/dashboard/certificates", label: bi("الشهادات", "Certificates"), icon: BadgeCheck },
  { href: "/dashboard/shipments", label: bi("مستندات الشحنات", "Shipment documents"), icon: Ship },
  { href: "/dashboard/bodies", label: bi("جهات التقييم", "Assessment bodies"), icon: Landmark },
  { href: "/dashboard/notifications", label: bi("الإشعارات", "Notifications"), icon: Bell },
  { href: "/dashboard/settings", label: bi("إعدادات الحساب", "Account settings"), icon: Settings },
  { href: "/dashboard/support", label: bi("الدعم والمساعدة", "Support & help"), icon: LifeBuoy },
];

function SidebarNav({ path, onNavigate, unread }: { path: string; onNavigate?: () => void; unread: number }) {
  const { t } = useI18n();
  return (
    <nav aria-label={t(bi("قائمة لوحة التحكم", "Dashboard menu"))} className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-0.5">
        {ITEMS.map(({ href, label, icon: I, exact }) => {
          const active = exact ? path === href : path === href || path.startsWith(href + "/");
          return (
            <li key={href}>
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[14.5px] font-medium transition-colors",
                  active ? "bg-white/10 text-white" : "text-white/65 hover:bg-white/5 hover:text-white",
                )}
              >
                {active && <span aria-hidden="true" className="absolute inset-y-2 start-0 w-[3px] rounded-full bg-flag-red" />}
                <I size={18} aria-hidden="true" className={cn(active ? "text-[#ff6b79]" : "text-white/50 group-hover:text-white/80")} />
                <span className="flex-1">{t(label)}</span>
                {href.endsWith("notifications") && unread > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-flag-red px-1.5 text-[11px] font-bold text-white">
                    <span className="ltr-num">{unread}</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFoot() {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <div className="space-y-1 border-t border-white/10 p-3">
      <button
        type="button"
        onClick={async () => {
          await api.auth.resetDemo();
          router.refresh();
        }}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start text-sm text-white/60 hover:bg-white/5 hover:text-white"
      >
        <RotateCcw size={17} aria-hidden="true" /> {t(bi("إعادة ضبط بيانات العرض", "Reset demo data"))}
      </button>
    </div>
  );
}

function UserMenu() {
  const { t } = useI18n();
  const { user } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  if (!user) return null;
  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen((o) => !o)} className="flex items-center gap-2.5 rounded-lg p-1.5 pe-2.5 hover:bg-surface">
        <span className="grid size-9 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white">{initials}</span>
        <span className="hidden text-start leading-tight sm:block">
          <span className="block max-w-[10rem] truncate text-sm font-semibold text-navy-900">{user.name}</span>
          <span className="block text-xs text-muted">{t(ACCOUNT_TYPE_LABEL[user.accountType])}</span>
        </span>
        <ChevronDown size={15} aria-hidden="true" className="text-muted" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div role="menu" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.15 }} className="absolute end-0 top-full z-50 mt-2 w-64 rounded-xl border border-line bg-white p-1.5 shadow-pop">
            <div className="border-b border-line px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-navy-900">{user.organization}</p>
              <p dir="ltr" className="truncate text-start text-xs text-muted">{user.email}</p>
            </div>
            <Link role="menuitem" href="/dashboard/settings" onClick={() => setOpen(false)} className="mt-1 flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm hover:bg-surface">
              <Settings size={16} aria-hidden="true" /> {t(bi("إعدادات الحساب", "Account settings"))}
            </Link>
            <button
              role="menuitem"
              type="button"
              onClick={async () => {
                await api.auth.logout();
                router.replace("/");
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-start text-sm text-flag-red-dark hover:bg-flag-red-soft"
            >
              <LogOut size={16} aria-hidden="true" /> {t(bi("تسجيل الخروج", "Sign out"))}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const { t, isRtl } = useI18n();
  const path = usePathname();
  const router = useRouter();
  const { user, ready } = useSession();
  const state = useDemoState();
  const [drawer, setDrawer] = useState(false);
  const closeDrawer = useCallback(() => setDrawer(false), []);
  const unread = state.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [ready, user, path, router]);
  useEffect(() => {
    if (!drawer) return;
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setDrawer(false);
    document.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", esc);
    };
  }, [drawer]);

  if (!ready || !user) {
    return (
      <div className="grid min-h-dvh place-items-center bg-surface p-6" role="status" aria-busy="true">
        <div className="w-full max-w-sm space-y-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-24" />
          <Skeleton className="w-2/3" />
          <span className="sr-only">{t(bi("جارٍ التحقق من الجلسة…", "Checking session…"))}</span>
        </div>
      </div>
    );
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-navy-900 text-white">
      <div className="flex h-[68px] shrink-0 items-center border-b border-white/10 px-5">
        <Logo tone="light" />
      </div>
      <SidebarNav path={path} unread={unread} onNavigate={closeDrawer} />
      <SidebarFoot />
    </div>
  );

  const title = ITEMS.find((i) => (i.exact ? path === i.href : path.startsWith(i.href)))?.label;
  const offscreen = isRtl ? "100%" : "-100%";

  return (
    <div className="min-h-dvh bg-surface">
      <aside className="no-print fixed inset-y-0 start-0 z-40 hidden w-64 lg:block">{sidebar}</aside>

      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[60] lg:hidden">
            <motion.div className="absolute inset-0 bg-navy-950/60" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeDrawer} aria-hidden="true" />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={t(bi("قائمة لوحة التحكم", "Dashboard menu"))}
              className="absolute inset-y-0 start-0 w-72 max-w-[85vw]"
              initial={{ x: offscreen }}
              animate={{ x: 0 }}
              exit={{ x: offscreen }}
              transition={{ type: "tween", duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {sidebar}
              <button type="button" onClick={closeDrawer} aria-label={t(bi("إغلاق", "Close"))} className="absolute end-3 top-4 grid size-9 place-items-center rounded-lg text-white/80 hover:bg-white/10">
                <X size={20} aria-hidden="true" />
              </button>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="lg:ps-64 print:ps-0">
        <header className="no-print sticky top-0 z-30 flex h-[68px] items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur-xl sm:px-6">
          <button type="button" onClick={() => setDrawer(true)} aria-label={t(bi("فتح القائمة", "Open menu"))} className="grid size-10 place-items-center rounded-lg border border-line lg:hidden">
            <Menu size={20} aria-hidden="true" />
          </button>
          <p className="hidden min-w-0 truncate text-sm font-semibold text-navy-900 sm:block lg:hidden">{title && t(title)}</p>
          <div className="hidden items-center gap-2 text-xs text-muted lg:flex">
            <DemoTag>DEMO</DemoTag>
            <span>{t(bi("مساحة عمل تجريبية — البيانات محفوظة على جهازك فقط", "Demo workspace — data is stored on your device only"))}</span>
          </div>
          <div className="ms-auto flex items-center gap-1.5">
            <LanguageSwitcher />
            <Link href="/dashboard/notifications" aria-label={`${t(bi("الإشعارات", "Notifications"))}${unread ? ` (${unread})` : ""}`} className="relative grid size-10 place-items-center rounded-lg text-navy-800 hover:bg-surface">
              <Bell size={20} aria-hidden="true" />
              {unread > 0 && <span className="absolute end-1.5 top-1.5 size-2.5 rounded-full bg-flag-red ring-2 ring-white" />}
            </Link>
            <UserMenu />
          </div>
        </header>
        <main id="main" className="mx-auto w-full max-w-[1280px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
