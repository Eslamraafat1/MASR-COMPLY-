"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, LayoutDashboard, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { NAV, type NavItem } from "@/lib/data/nav";
import { bi } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/provider";
import { useSession } from "@/lib/hooks/use-session";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TrustBar } from "./TrustBar";

function isActive(item: NavItem, path: string) {
  if (item.href === "/") return path === "/";
  if (item.children?.some((c) => path === c.href || path.startsWith(c.href + "/"))) return true;
  return !!item.href && (path === item.href || path.startsWith(item.href + "/"));
}

function DesktopItem({ item, path }: { item: NavItem; path: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const wrap = useRef<HTMLDivElement>(null);
  const active = isActive(item, path);
  const wide = (item.children?.length ?? 0) > 5;

  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    timer.current = setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={wrap}
      className="relative"
      onMouseEnter={item.children ? show : undefined}
      onMouseLeave={item.children ? hide : undefined}
      onBlur={(e) => {
        if (item.children && !wrap.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <div className="flex items-center">
        <Link
          href={item.href ?? "#"}
          aria-current={active && !item.children ? "page" : undefined}
          className={cn("relative whitespace-nowrap px-2 py-2.5 text-[14.5px] font-medium transition-colors", item.children && "pe-1", active ? "text-navy-900" : "text-ink/75 hover:text-navy-900")}
        >
          {t(item.label)}
          {active && (
            <motion.span layoutId="nav-active" className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-flag-red" transition={{ type: "spring", stiffness: 500, damping: 40 }} aria-hidden="true" />
          )}
        </Link>
        {item.children && (
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="true"
            aria-label={t(item.label)}
            onClick={() => setOpen((o) => !o)}
            className="grid size-7 place-items-center rounded-md text-ink/60 hover:text-navy-900"
          >
            <ChevronDown size={15} aria-hidden="true" className={cn("transition-transform duration-200", open && "rotate-180")} />
          </button>
        )}
      </div>
      <AnimatePresence>
        {open && item.children && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className={cn("absolute start-0 top-full z-50 pt-3", wide ? "w-[40rem]" : "w-[22rem]")}
          >
            <ul className={cn("grid gap-1 rounded-2xl border border-line bg-white p-2.5 shadow-pop", wide && "grid-cols-2")}>
              {item.children.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} onClick={() => setOpen(false)} className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-surface">
                    {c.icon && (
                      <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800 transition-colors group-hover:bg-navy-900 group-hover:text-white">
                        <Icon name={c.icon} size={18} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-navy-900">{t(c.label)}</span>
                      {c.hint && <span className="mt-0.5 line-clamp-2 block text-xs leading-5 text-muted">{t(c.hint)}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileDrawer({ open, onClose, path }: { open: boolean; onClose: () => void; path: string }) {
  const { t, isRtl } = useI18n();
  const { user } = useSession();
  const [expanded, setExpanded] = useState<string | null>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("button, a");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
        if (!f.length) return;
        const a = f[0];
        const z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) {
          e.preventDefault();
          z.focus();
        } else if (!e.shiftKey && document.activeElement === z) {
          e.preventDefault();
          a.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const offscreen = isRtl ? "-100%" : "100%";
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] xl:hidden">
          <motion.div className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} aria-hidden="true" />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={t(bi("القائمة الرئيسية", "Main menu"))}
            className="absolute inset-y-0 end-0 flex w-[min(24rem,92vw)] flex-col bg-white shadow-pop"
            initial={{ x: offscreen }}
            animate={{ x: 0 }}
            exit={{ x: offscreen }}
            transition={{ type: "tween", duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <Logo href="/" />
              <button type="button" onClick={onClose} aria-label={t(bi("إغلاق القائمة", "Close menu"))} className="grid size-10 place-items-center rounded-lg hover:bg-surface">
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label={t(bi("التنقل", "Navigation"))} className="flex-1 overflow-y-auto px-3 py-3">
              <ul className="space-y-0.5">
                {NAV.map((item) => {
                  const active = isActive(item, path);
                  return (
                    <li key={item.id}>
                      {item.children ? (
                        <>
                          <button
                            type="button"
                            aria-expanded={expanded === item.id}
                            onClick={() => setExpanded(expanded === item.id ? null : item.id)}
                            className={cn("flex w-full items-center justify-between rounded-lg px-3 py-3 text-start text-base font-semibold", active ? "bg-navy-50 text-navy-900" : "text-ink hover:bg-surface")}
                          >
                            {t(item.label)}
                            <ChevronDown size={18} aria-hidden="true" className={cn("transition-transform", expanded === item.id && "rotate-180")} />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded === item.id && (
                              <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden ps-3">
                                {item.href && (
                                  <li>
                                    <Link href={item.href} onClick={onClose} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-flag-green">
                                      {t(bi("عرض الكل", "View all"))}
                                    </Link>
                                  </li>
                                )}
                                {item.children.map((c) => (
                                  <li key={c.href}>
                                    <Link href={c.href} onClick={onClose} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink/85 hover:bg-surface">
                                      {c.icon && <Icon name={c.icon} size={17} className="text-navy-600" />}
                                      {t(c.label)}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link href={item.href!} onClick={onClose} aria-current={active ? "page" : undefined} className={cn("block rounded-lg px-3 py-3 text-base font-semibold", active ? "bg-navy-50 text-navy-900" : "text-ink hover:bg-surface")}>
                          {t(item.label)}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="space-y-3 border-t border-line p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{t(bi("اللغة", "Language"))}</span>
                <LanguageSwitcher />
              </div>
              {user ? (
                <Link href="/dashboard" onClick={onClose} className={buttonClasses("primary", "lg", "w-full")}>
                  <LayoutDashboard size={18} aria-hidden="true" /> {t(bi("لوحة التحكم", "Dashboard"))}
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={onClose} className={buttonClasses("outline", "lg")}>
                    {t(bi("تسجيل الدخول", "Sign in"))}
                  </Link>
                  <Link href="/register" onClick={onClose} className={buttonClasses("primary", "lg")}>
                    {t(bi("إنشاء حساب", "Create account"))}
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const { t } = useI18n();
  const path = usePathname();
  const { user } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobile, setMobile] = useState(false);
  const close = useCallback(() => setMobile(false), []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <TrustBar />
      <header className={cn("sticky top-0 z-50 border-b transition-all duration-300", scrolled ? "border-line bg-white/92 shadow-[0_8px_24px_-16px_rgb(16_29_50/.35)] backdrop-blur-xl" : "border-transparent bg-white")}>
        <div className="container-x flex h-[72px] items-center justify-between gap-3">
          <Logo subtitleClassName="hidden min-[420px]:block" subtitle={t(bi("مصر للمطابقة وسلامة المنتجات", "Product compliance & safety"))} />

          <nav aria-label={t(bi("التنقل الرئيسي", "Primary"))} className="hidden items-center xl:flex">
            {NAV.map((item) => (
              <DesktopItem key={item.id} item={item} path={path} />
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <Link href="/search" aria-label={t(bi("بحث", "Search"))} className="grid size-10 place-items-center rounded-lg text-navy-900 hover:bg-navy-50"><Search size={19} aria-hidden="true" /></Link>
            <LanguageSwitcher className="max-sm:hidden !px-2" />
            <div className="hidden items-center gap-2 xl:flex">
              {user ? (
                <Link href="/dashboard" className={buttonClasses("primary", "md")}>
                  <LayoutDashboard size={17} aria-hidden="true" /> {t(bi("لوحة التحكم", "Dashboard"))}
                </Link>
              ) : (
                <>
                  <Link href="/login" className={buttonClasses("primary", "md", "px-5")}>
                    {t(bi("تسجيل الدخول", "Sign in"))}
                  </Link>
                  
                </>
              )}
            </div>
            <button type="button" onClick={() => setMobile(true)} aria-label={t(bi("فتح القائمة", "Open menu"))} aria-expanded={mobile} className="grid size-11 place-items-center rounded-lg border border-line xl:hidden">
              <Menu size={22} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>
      <MobileDrawer open={mobile} onClose={close} path={path} />
    </>
  );
}
