import type { Metadata } from "next";
import { LegalPage } from "@/components/pages/Legal";
import { bi } from "@/lib/i18n/config";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return (
    <LegalPage
      title={bi("سياسة الخصوصية", "Privacy policy")}
      intro={bi("كيف يتعامل هذا النموذج الأولي مع البيانات التي تُدخلها.", "How this prototype handles the data you enter.")}
      updated="2026-11-01"
      sections={[
        { title: bi("نطاق النموذج", "Scope of the prototype"), body: [bi("MASR COMPLY نموذج أولي مستقل لأغراض العرض والتجربة. لا يرتبط بأي جهة حكومية ولا يعالج بيانات حقيقية.", "MASR COMPLY is an independent prototype for demonstration. It is not linked to any government body and does not process real data.")] },
        { title: bi("ما الذي نخزّنه", "What is stored"), body: [bi("تُحفظ بيانات التجربة (الملف التعريفي المعروض، المنتجات، الطلبات التجريبية) في التخزين المحلي لمتصفحك فقط، ولا تُرسل إلى أي خادم.", "Demo data (the displayed profile, products, demo requests) is kept in your browser's local storage only and is never sent to a server."), bi("لا تُخزَّن كلمات المرور إطلاقاً، ولا تُتحقق من صحتها؛ أي بيانات دخول صحيحة الشكل تفتح مساحة العرض.", "Passwords are never stored or verified; any well-formed credentials open the demo workspace.")] },
        { title: bi("الملفات المرفوعة", "Uploaded files"), body: [bi("تُسجَّل أسماء الملفات وأحجامها وأنواعها فقط لإظهار تجربة إدارة المستندات؛ لا يُرفع محتوى الملفات.", "Only file names, sizes and types are recorded to illustrate document handling; file contents are never uploaded.")] },
        { title: bi("ملفات تعريف الارتباط", "Cookies"), body: [bi("نستخدم ملف تعريف ارتباط واحداً وظيفياً لحفظ اختيار اللغة.", "We use a single functional cookie to remember your language choice.")] },
        { title: bi("حقوقك", "Your choices"), body: [bi("يمكنك مسح البيانات في أي وقت من إعدادات الحساب (إعادة ضبط بيانات العرض) أو بمسح بيانات الموقع من المتصفح.", "You can erase the data at any time from account settings (reset demo data) or by clearing site data in your browser.")] },
        { title: bi("التواصل", "Contact"), body: [bi("لأي استفسار حول هذه السياسة استخدم صفحة «تواصل معنا».", "For any question about this policy, use the “Contact us” page.")] },
      ]}
    />
  );
}
