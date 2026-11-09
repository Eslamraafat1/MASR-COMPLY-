import type { Metadata } from "next";
import { BodiesExplorer } from "@/components/pages/Catalogues";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "جهات التقييم" };

export default async function BodiesPage() {
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("جهات تقييم المطابقة", "Conformity assessment bodies"))}
        text={t(bi("دليل قابل للبحث حسب المجال والمدينة. القائمة تجريبية إلى حين اعتماد بيانات رسمية.", "A directory searchable by scope and city. The list is illustrative until official data is available."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("جهات التقييم", "Assessment bodies")) }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <BodiesExplorer />
        </div>
      </section>
    </>
  );
}
