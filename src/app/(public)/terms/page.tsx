import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/Legal";
import { bi } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "الشروط والأحكام" };

export default function TermsPage() {
  return (
    <LegalPage
      title={bi("الشروط والأحكام", "Terms & conditions")}
      intro={bi("شروط استخدام النموذج الأولي لمنصة MASR COMPLY.", "Terms of use for the MASR COMPLY prototype.")}
      updated="2026-11-01"
      sections={[
        { title: bi("طبيعة الخدمة", "Nature of the service"), body: [bi("هذه المنصة نموذج أولي مستقل. ليست خدمة حكومية رسمية، ولا تُمثّل أي وزارة أو جهة تنظيمية أو تدّعي الانتساب إليها.", "This platform is an independent prototype. It is not an official government service and does not represent, or claim affiliation with, any ministry or regulator.")] },
        { title: bi("لا حجية قانونية", "No legal effect"), body: [bi("أي طلب أو موافقة أو شهادة أو إشعار يظهر في المنصة هو محاكاة لأغراض العرض، وليس له أي أثر قانوني أو تنظيمي أو مالي.", "Any request, approval, certificate or notice shown is a simulation for demonstration and has no legal, regulatory or financial effect.")] },
        { title: bi("المحتوى التنظيمي", "Regulatory content"), body: [bi("اللوائح والمواصفات ورموز النظام المنسق وجهات التقييم المعروضة محتوى مقترح قابل للضبط وبانتظار التحقق الرسمي. يجب الرجوع للمصادر الرسمية دائماً.", "The regulations, standards, HS codes and assessment bodies shown are proposed, configurable content awaiting official verification. Always consult official sources.")] },
        { title: bi("الاستخدام المقبول", "Acceptable use"), body: [bi("يُرجى عدم إدخال بيانات شخصية أو تجارية حقيقية حساسة، وعدم محاولة اختراق النموذج أو إساءة استخدامه.", "Please do not enter real sensitive personal or commercial data, and do not attempt to compromise or misuse the prototype.")] },
        { title: bi("إخلاء المسؤولية", "Disclaimer"), body: [bi("يُقدَّم النموذج «كما هو» دون ضمانات من أي نوع.", "The prototype is provided “as is” without warranties of any kind.")] },
      ]}
    />
  );
}
