import type { Metadata } from "next";
import { ServicesList } from "@/components/pages/ServicesList";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "الخدمات" };

export default async function ServicesPage() {
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("الخدمات", "Services"))}
        text={t(bi("خدمات إلكترونية تمكّن الأفراد والمستوردين والمصانع المحلية والجهات الحكومية من إدارة المنتجات والشهادات والمستندات.", "Electronic services that let individuals, importers, local factories and government entities manage products, certificates and documents."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("الخدمات", "Services")) }]}
      />
      <section className="py-14 sm:py-20">
        <div className="container-x">
          <ServicesList />
        </div>
      </section>
    </>
  );
}
