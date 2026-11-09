import { CheckCircle2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const { t } = await getT();
  const points = [
    bi("تسجيل المنتجات ومتابعة الطلبات في مكان واحد", "Register products and follow requests in one place"),
    bi("واجهة عربية وإنجليزية كاملة", "Complete Arabic and English interface"),
    bi("لا تُخزَّن كلمات المرور في النموذج التجريبي", "No passwords are stored in the demo"),
  ];
  return (
    <div className="grid min-h-dvh lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <aside className="pattern-lattice relative hidden flex-col justify-between overflow-hidden bg-navy-900 p-12 text-white lg:flex">
        <div aria-hidden="true" className="absolute -bottom-40 -start-20 size-[480px] rounded-full bg-flag-green/20 blur-[120px]" />
        <div aria-hidden="true" className="absolute -top-32 end-0 size-96 rounded-full bg-flag-red/20 blur-[120px]" />
        <Logo tone="light" />
        <div className="relative max-w-md">
          <h2 className="text-3xl font-bold leading-[1.45]">{t(bi("بوابتك الرقمية نحو سوق أكثر أماناً وثقة", "Your digital gateway to a safer, more trusted market"))}</h2>
          <ul className="mt-8 space-y-4 text-white/80">
            {points.map((p, i) => (
              <li key={i} className="flex items-start gap-3"><CheckCircle2 size={20} className="mt-1 shrink-0 text-[#ff6b79]" aria-hidden="true" />{t(p)}</li>
            ))}
          </ul>
        </div>
        <p className="relative flex items-start gap-2 text-xs leading-6 text-white/55"><ShieldCheck size={15} className="mt-1 shrink-0 text-gold" aria-hidden="true" />{t(bi("نموذج أولي مستقل غير تابع لأي جهة حكومية.", "Independent prototype, not affiliated with any government body."))}</p>
      </aside>
      <div className="flex min-h-dvh flex-col bg-white">
        <header className="flex items-center justify-between p-4 sm:p-6">
          <div className="lg:hidden"><Logo /></div>
          <Link href="/" className="hidden text-sm font-medium text-muted hover:text-navy-900 lg:block">{t(bi("→ العودة إلى الرئيسية", "← Back to home"))}</Link>
          <LanguageSwitcher />
        </header>
        <main id="main" className="mx-auto flex w-full max-w-[34rem] flex-1 flex-col justify-center px-4 pb-12 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
