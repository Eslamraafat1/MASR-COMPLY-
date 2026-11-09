import { Clock, LifeBuoy, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageHero } from "@/components/ui/Section";
import { bi } from "@/lib/i18n/config";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "تواصل معنا" };

export default async function ContactPage() {
  const { t } = await getT();
  const cards = [
    { icon: Mail, title: bi("البريد الإلكتروني", "Email"), text: "support@masrcomply.example" },
    { icon: Clock, title: bi("ساعات الدعم", "Support hours"), text: t(bi("تُحدد عند الإطلاق الرسمي", "To be set at official launch")) },
    { icon: MapPin, title: bi("الموقع", "Location"), text: t(bi("جمهورية مصر العربية — نموذج رقمي", "Arab Republic of Egypt — digital prototype")) },
    { icon: LifeBuoy, title: bi("مركز المساعدة", "Help center"), text: t(bi("أدلة وأسئلة شائعة متاحة دائماً", "Guides and FAQs always available")) },
  ];
  return (
    <>
      <PageHero
        title={t(bi("تواصل معنا", "Contact us"))}
        text={t(bi("يسعدنا سماع استفساراتك وملاحظاتك حول التجربة.", "We'd love to hear your questions and feedback about the experience."))}
        crumbs={[{ label: t(bi("الرئيسية", "Home")), href: "/" }, { label: t(bi("تواصل معنا", "Contact")) }]}
      />
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_22rem] lg:gap-14">
          <ContactForm />
          <aside>
            <ul className="space-y-4">
              {cards.map((c, i) => (
                <li key={i} className="flex items-start gap-4 rounded-xl border border-line bg-white p-5 shadow-card">
                  <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-navy-50 text-navy-800"><c.icon size={20} aria-hidden="true" /></span>
                  <span>
                    <span className="block text-sm font-bold text-navy-900">{t(c.title)}</span>
                    <span className="mt-0.5 block text-sm leading-7 text-muted" dir={c.text.includes("@") ? "ltr" : undefined}>{c.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>
    </>
  );
}
