import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { SECTORS } from "@/lib/data/content";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "اختيار المسار" };

const PATHS = ["individuals", "importers", "government", "manufacturers"];

/** Route picker (mirrors the reference portal): choose an account path first, then sign in. */
export default async function LoginPathPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const { l, t } = await getT();
  const Arrow = l === "ar" ? ArrowLeft : ArrowRight;
  const q = next && next.startsWith("/") && !next.startsWith("//") ? `&next=${encodeURIComponent(next)}` : "";
  return (
    <>
      <h1 className="text-3xl font-bold text-navy-900">{t(bi("اختيار المسار", "Choose your path"))}</h1>
      <p className="mb-8 mt-2 text-base leading-8 text-muted">{t(bi("فضلاً اختر نوع الحساب الذي تريد الدخول به للاستفادة من الخدمات المتاحة.", "Please choose the account type you want to sign in with to use the available services."))}</p>
      <ul className="space-y-3">
        {SECTORS.filter((s) => PATHS.includes(s.slug)).map((s) => (
          <li key={s.slug}>
            <Link href={`/login/form?type=${s.accountType}${q}`} className="group flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition-all hover:border-flag-red/50 hover:shadow-card">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-navy-900 text-white transition-colors group-hover:bg-flag-red"><Icon name={s.icon} size={22} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-base font-bold text-navy-900">{t(s.title)}</span>
                <span className="block text-sm text-muted">{t(s.short)}</span>
              </span>
              <Arrow size={18} aria-hidden="true" className="shrink-0 text-flag-red" />
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 rounded-xl bg-surface p-5">
        <h2 className="font-bold text-navy-900">{t(bi("مستخدم جديد", "New user"))}</h2>
        <p className="mt-1 text-sm leading-7 text-muted">{t(bi("إذا لم يكن لديك حساب يمكنك إنشاء حساب في خطوات بسيطة وسهلة.", "If you don't have an account, you can create one in a few simple steps."))}</p>
        <LinkButton href="/register" className="mt-4">{t(bi("إنشاء حساب", "Create account"))}</LinkButton>
      </div>
    </>
  );
}
