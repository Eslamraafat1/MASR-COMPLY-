import type { Metadata } from "next";
import { FaqExplorer } from "@/components/pages/FaqExplorer";
import { LinkButton } from "@/components/ui/Button";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "الأسئلة الشائعة" };

export default async function FaqPage() {
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("الأسئلة الشائعة", "Frequently asked questions"))}
        text={t(bi("إجابات عامة عن الحساب وتسجيل المنتجات والمستندات والمتابعة. لا تُعد التزاماً قانونياً.", "General answers about accounts, product registration, documents and tracking. They are not legal requirements."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("الأسئلة الشائعة", "FAQ")) }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <FaqExplorer />
          <div className="mx-auto mt-12 flex max-w-3xl flex-col items-center gap-4 rounded-2xl bg-surface p-8 text-center">
            <h2 className="text-xl font-bold text-navy-900">{t(bi("لم تجد إجابتك؟", "Didn't find your answer?"))}</h2>
            <LinkButton href="/contact">{t(bi("تواصل معنا", "Contact us"))}</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
