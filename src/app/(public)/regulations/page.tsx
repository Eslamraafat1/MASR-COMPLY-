import type { Metadata } from "next";
import { RegulationsExplorer } from "@/components/pages/Catalogues";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "اللوائح الفنية والمواصفات" };

export default async function RegulationsPage() {
  const { t } = await getT();
  return (
    <>
      <PageHero
        title={t(bi("اللوائح الفنية والمواصفات", "Technical regulations & standards"))}
        text={t(bi("مكتبة قابلة للبحث وللضبط. المحتوى الحالي مقترح وبانتظار التحقق الرسمي.", "A searchable, configurable library. Current content is proposed and awaiting official verification."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("اللوائح والمواصفات", "Regulations")) }]}
      />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <RegulationsExplorer />
        </div>
      </section>
    </>
  );
}
