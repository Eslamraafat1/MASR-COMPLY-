import type { Metadata } from "next";
import { SearchExplorer } from "@/components/pages/SearchExplorer";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "البحث المتقدم" };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("البحث المتقدم", "Advanced search"))}
        text={t(bi("ابحث في المنتجات والفئات واللوائح والمواصفات وجهات التقييم والطلبات من مكان واحد.", "Search products, categories, regulations, standards, assessment bodies and requests from one place."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("البحث", "Search")) }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <SearchExplorer initial={q ?? ""} />
        </div>
      </section>
    </>
  );
}
