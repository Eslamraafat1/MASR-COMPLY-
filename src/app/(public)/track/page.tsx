import type { Metadata } from "next";
import { TrackForm } from "@/components/dashboard/TrackForm";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "متابعة طلب | Track a request" };

export default async function TrackPage() {
  const l = await getLocale();
  return (
    <>
      <PageHero
        title={bi("متابعة الطلب", "Track a request")[l]}
        text={bi("أدخل الرقم المرجعي لمعرفة حالة الطلب ومراحله.", "Enter a request reference to see its status and stages.")[l]}
        crumbs={[{ label: bi("الرئيسية", "Home")[l], href: "/" }, { label: bi("متابعة الطلب", "Track a request")[l] }]}
      />
      <section className="bg-surface py-12 sm:py-16">
        <div className="container-x">
          <TrackForm />
        </div>
      </section>
    </>
  );
}
