import type { Metadata } from "next";
import { HsExplorer } from "@/components/pages/Catalogues";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "رموز النظام المنسق" };

export default async function HsCodesPage() {
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("رموز النظام المنسق (HS)", "Harmonized System (HS) codes"))}
        text={t(bi("ابحث عن العنوان الأقرب لمنتجك واستخدمه عند تسجيل المنتج.", "Find the heading closest to your product and use it when registering."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("رموز النظام المنسق", "HS codes")) }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <HsExplorer />
        </div>
      </section>
    </>
  );
}
