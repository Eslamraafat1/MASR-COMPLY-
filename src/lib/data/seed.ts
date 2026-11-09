import { bi } from "../i18n/config";
import type {
  ActivityItem,
  Application,
  ApplicationStatus,
  Certificate,
  DocumentFile,
  Facility,
  NotificationItem,
  Product,
  Shipment,
  TimelineEvent,
} from "../types";
import { APPLICATION_STATUS } from "./status";

/** ALL data in this file is fictional demonstration data. */

const doc = (id: string, name: string, size: number, at: string, type = "application/pdf"): DocumentFile => ({ id, name, size, type, uploadedAt: at });

const STEP_TITLES: Partial<Record<ApplicationStatus, { t: [string, string]; n?: [string, string] }>> = {
  draft: { t: ["تم إنشاء المسودة", "Draft created"] },
  submitted: { t: ["تم تقديم الطلب", "Request submitted"], n: ["تم استلام الطلب في البيئة التجريبية.", "Request received in the demo environment."] },
  under_review: { t: ["بدأت مراجعة المستندات", "Document review started"], n: ["يتم فحص اكتمال المستندات.", "Documents are being checked for completeness."] },
  info_required: { t: ["مطلوب استكمال بيانات", "Additional information required"], n: ["يرجى رفع المستند المطلوب لمتابعة الإجراء.", "Please upload the requested document to continue."] },
  under_assessment: { t: ["انتقل الطلب إلى التقييم", "Moved to assessment"], n: ["أُسند الطلب إلى جهة التقييم المختارة.", "Assigned to the selected assessment body."] },
  completed: { t: ["اكتملت الإجراءات", "Procedure completed"], n: ["استُوفيت المتطلبات في هذا المسار التجريبي.", "Requirements met in this demo workflow."] },
  rejected: { t: ["تم رفض الطلب", "Request rejected"], n: ["سبب الرفض توضيحي لأغراض العرض.", "The rejection reason is illustrative only."] },
};

export function buildTimeline(ref: string, statuses: ApplicationStatus[], start: string): TimelineEvent[] {
  const base = new Date(start).getTime();
  return statuses.map((s, i) => {
    const meta = STEP_TITLES[s]!;
    return {
      id: `${ref}-t${i}`,
      at: new Date(base + i * 2 * 86400000).toISOString(),
      status: s,
      title: bi(meta.t[0], meta.t[1]),
      note: meta.n ? bi(meta.n[0], meta.n[1]) : undefined,
      actor: bi(i === 0 ? "مقدّم الطلب" : "النظام (محاكاة)", i === 0 ? "Applicant" : "System (simulated)"),
    };
  });
}

export const SEED_USER = {
  id: "u_demo",
  name: "Layla Hassan",
  email: "demo.user@example.test",
  accountType: "importer" as const,
  organization: "شركة الأفق للاستيراد (تجريبية)",
  emailVerified: true,
  createdAt: "2026-08-12T09:00:00.000Z",
};

export const SEED_FACILITIES: Facility[] = [
  { id: "fac1", name: bi("شركة الأفق للاستيراد (تجريبية)", "Horizon Imports Co. (DEMO)"), commercialReg: "DEMO-CR-100234", taxId: "DEMO-TX-554120", activity: bi("استيراد أجهزة كهربائية", "Electrical appliance import"), city: bi("القاهرة", "Cairo"), contact: "Layla Hassan", status: "verified", products: 5 },
  { id: "fac2", name: bi("مستودع الدلتا اللوجستي (تجريبي)", "Delta Logistics Warehouse (DEMO)"), commercialReg: "DEMO-CR-100877", taxId: "DEMO-TX-554980", activity: bi("تخزين وتوزيع", "Storage & distribution"), city: bi("الإسكندرية", "Alexandria"), contact: "Omar Khaled", status: "verified", products: 2 },
  { id: "fac3", name: bi("فرع بورسعيد (تجريبي)", "Port Said Branch (DEMO)"), commercialReg: "DEMO-CR-101310", taxId: "DEMO-TX-555044", activity: bi("استيراد ألعاب ومنتجات أطفال", "Toy & children's product import"), city: bi("بورسعيد", "Port Said"), contact: "Nour Ibrahim", status: "pending", products: 1 },
];

const P = (n: number, nameAr: string, nameEn: string, category: string, brand: string, model: string, origin: string, manufacturer: string, hs: string, status: Product["status"], at: string): Product => ({
  id: `prd${n}`,
  ref: `DEMO-PRD-${String(n).padStart(4, "0")}`,
  nameAr,
  nameEn,
  category,
  brand,
  model,
  origin,
  manufacturer,
  hsCode: hs,
  description: "Demonstration product record.",
  status,
  createdAt: at,
  attachments: [doc(`pd${n}a`, "datasheet.pdf", 482000, at), doc(`pd${n}b`, "product-photo.jpg", 1240000, at, "image/jpeg")],
});

export const SEED_PRODUCTS: Product[] = [
  P(1, "غلاية مياه كهربائية 1.7 لتر", "Electric kettle 1.7 L", "electrical", "AquaHeat", "AH-170", "TR", "Bosphorus Appliances", "8516", "registered", "2026-08-20"),
  P(2, "ثلاجة بابين 450 لتر", "Double-door refrigerator 450 L", "electrical", "FrostLine", "FL-450D", "KR", "Hanbit Electronics", "8418", "registered", "2026-08-28"),
  P(3, "مصباح LED موفر 12 وات", "LED bulb 12 W", "lighting", "Lumo", "LM-12E27", "CN", "Shenzhen Lumo Ltd.", "8539", "registered", "2026-09-04"),
  P(4, "شاحن لاسلكي 15 وات", "Wireless charger 15 W", "electronics", "ChargeWave", "CW-15", "CN", "ChargeWave Tech", "8517", "pending_review", "2026-09-18"),
  P(5, "مكعبات بناء للأطفال", "Children's building blocks", "toys", "BrickJoy", "BJ-300", "DE", "Spielwerk GmbH", "9503", "info_required", "2026-09-25"),
  P(6, "غسالة أوتوماتيك 9 كجم", "Front-load washer 9 kg", "electrical", "WashPro", "WP-9F", "IT", "Bianchi Domestic S.p.A.", "8450", "registered", "2026-10-02"),
  P(7, "بلاط سيراميك 60×60", "Ceramic tile 60×60", "building", "TerraStone", "TS-6060", "IN", "Terra Ceramics", "6907", "pending_review", "2026-10-15"),
  P(8, "كرسي مكتب مريح", "Ergonomic office chair", "furniture", "SitWell", "SW-Pro", "CN", "SitWell Furniture", "9403", "draft", "2026-10-30"),
];

const A = (n: number, prod: number, nameAr: string, nameEn: string, type: Application["type"], body: string | undefined, flow: ApplicationStatus[], start: string, actions: Application["actions"] = []): Application => {
  const ref = `DEMO-APP-2026-${String(n).padStart(4, "0")}`;
  const timeline = buildTimeline(ref, flow, start);
  const last = flow[flow.length - 1];
  return {
    id: `app${n}`,
    ref,
    productId: `prd${prod}`,
    productName: bi(nameAr, nameEn),
    type,
    bodyId: body,
    status: last,
    submittedAt: last === "draft" ? undefined : start,
    updatedAt: timeline[timeline.length - 1].at,
    documents: last === "draft" ? [] : [doc(`ad${n}a`, "product-datasheet.pdf", 530000, start), doc(`ad${n}b`, "manufacturer-declaration.pdf", 210000, start)],
    actions,
    timeline,
  };
};

export const SEED_APPLICATIONS: Application[] = [
  A(1, 1, "غلاية مياه كهربائية 1.7 لتر", "Electric kettle 1.7 L", "conformity", "b1", ["submitted", "under_review", "under_assessment", "completed"], "2026-08-25"),
  A(2, 2, "ثلاجة بابين 450 لتر", "Double-door refrigerator 450 L", "conformity", "b1", ["submitted", "under_review", "under_assessment", "completed"], "2026-09-02"),
  A(3, 3, "مصباح LED موفر 12 وات", "LED bulb 12 W", "assessment", "b5", ["submitted", "under_review", "under_assessment"], "2026-09-20"),
  A(4, 4, "شاحن لاسلكي 15 وات", "Wireless charger 15 W", "conformity", "b1", ["submitted", "under_review"], "2026-10-10"),
  A(5, 5, "مكعبات بناء للأطفال", "Children's building blocks", "conformity", "b3", ["submitted", "under_review", "info_required"], "2026-10-12", [
    { id: "act5a", title: bi("رفع تقرير اختبار السلامة", "Upload safety test report"), detail: bi("يرجى رفع تقرير اختبار حديث بصيغة PDF.", "Please upload a recent test report in PDF format."), done: false },
    { id: "act5b", title: bi("تأكيد بيانات المصنّع", "Confirm manufacturer details"), detail: bi("تأكد من تطابق اسم المصنّع مع المستندات.", "Check that the manufacturer name matches the documents."), done: false },
  ]),
  A(6, 6, "غسالة أوتوماتيك 9 كجم", "Front-load washer 9 kg", "conformity", "b1", ["submitted", "under_review", "under_assessment"], "2026-10-14"),
  A(7, 7, "بلاط سيراميك 60×60", "Ceramic tile 60×60", "assessment", "b2", ["submitted"], "2026-10-28"),
  A(8, 3, "مصباح LED موفر 12 وات — تجديد", "LED bulb 12 W — renewal", "renewal", "b5", ["draft"], "2026-11-01"),
  A(9, 4, "شاحن لاسلكي 15 وات — طلب إضافي", "Wireless charger 15 W — supplementary", "assessment", "b1", ["submitted", "under_review", "rejected"], "2026-09-08"),
  A(10, 6, "غسالة أوتوماتيك 9 كجم — تقييم إضافي", "Front-load washer 9 kg — additional", "assessment", "b5", ["submitted", "under_review", "under_assessment", "completed"], "2026-08-30"),
];

export const SEED_CERTIFICATES: Certificate[] = [
  { id: "cert1", ref: "DEMO-CERT-0001", applicationRef: "DEMO-APP-2026-0001", productName: bi("غلاية مياه كهربائية 1.7 لتر", "Electric kettle 1.7 L"), holder: "Horizon Imports Co. (DEMO)", scheme: bi("نموذج مطابقة تجريبي", "Demo conformity scheme"), issuedAt: "2026-09-10", expiresAt: "2027-09-10", status: "active" },
  { id: "cert2", ref: "DEMO-CERT-0002", applicationRef: "DEMO-APP-2026-0002", productName: bi("ثلاجة بابين 450 لتر", "Double-door refrigerator 450 L"), holder: "Horizon Imports Co. (DEMO)", scheme: bi("نموذج مطابقة تجريبي", "Demo conformity scheme"), issuedAt: "2026-09-20", expiresAt: "2027-09-20", status: "active" },
  { id: "cert3", ref: "DEMO-CERT-0003", applicationRef: "DEMO-APP-2026-0010", productName: bi("غسالة أوتوماتيك 9 كجم", "Front-load washer 9 kg"), holder: "Horizon Imports Co. (DEMO)", scheme: bi("نموذج تقييم تجريبي", "Demo assessment scheme"), issuedAt: "2025-10-01", expiresAt: "2026-10-01", status: "expired" },
  { id: "cert4", ref: "DEMO-CERT-0004", applicationRef: "DEMO-APP-2026-0006", productName: bi("غسالة أوتوماتيك 9 كجم", "Front-load washer 9 kg"), holder: "Horizon Imports Co. (DEMO)", scheme: bi("نموذج مطابقة تجريبي", "Demo conformity scheme"), issuedAt: "2026-11-05", expiresAt: "2027-11-05", status: "pending" },
];

export const SEED_SHIPMENTS: Shipment[] = [
  { id: "sh1", ref: "DEMO-SHP-0101", description: bi("شحنة أجهزة منزلية — 120 وحدة", "Household appliances — 120 units"), origin: "TR", port: bi("ميناء الإسكندرية", "Alexandria Port"), items: 3, status: "cleared", createdAt: "2026-09-05", documents: 4 },
  { id: "sh2", ref: "DEMO-SHP-0102", description: bi("شحنة إضاءة LED — 2,000 وحدة", "LED lighting — 2,000 units"), origin: "CN", port: bi("ميناء السخنة", "Sokhna Port"), items: 1, status: "under_review", createdAt: "2026-10-09", documents: 3 },
  { id: "sh3", ref: "DEMO-SHP-0103", description: bi("شحنة ألعاب أطفال", "Children's toys shipment"), origin: "DE", port: bi("ميناء بورسعيد", "Port Said Port"), items: 2, status: "info_required", createdAt: "2026-10-18", documents: 2 },
  { id: "sh4", ref: "DEMO-SHP-0104", description: bi("بلاط سيراميك — 18 منصة", "Ceramic tiles — 18 pallets"), origin: "IN", port: bi("ميناء دمياط", "Damietta Port"), items: 1, status: "submitted", createdAt: "2026-10-29", documents: 3 },
  { id: "sh5", ref: "DEMO-SHP-0105", description: bi("ملف شحنة قيد الإعداد", "Shipment file in preparation"), origin: "KR", port: bi("ميناء الإسكندرية", "Alexandria Port"), items: 1, status: "draft", createdAt: "2026-11-04", documents: 0 },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: bi("مطلوب استكمال بيانات", "Information required"), body: bi("الطلب DEMO-APP-2026-0005 يحتاج إلى تقرير اختبار السلامة.", "Request DEMO-APP-2026-0005 needs a safety test report."), at: "2026-11-07T10:20:00.000Z", read: false, kind: "action", href: "/dashboard/applications/app5" },
  { id: "n2", title: bi("شهادة تجريبية جاهزة", "Demo certificate ready"), body: bi("أصبحت الشهادة DEMO-CERT-0004 متاحة للمعاينة.", "Certificate DEMO-CERT-0004 is available to preview."), at: "2026-11-05T14:00:00.000Z", read: false, kind: "success", href: "/dashboard/certificates/cert4" },
  { id: "n3", title: bi("انتهت صلاحية شهادة", "Certificate expired"), body: bi("انتهت صلاحية الشهادة DEMO-CERT-0003 بتاريخ 2026-10-01.", "Certificate DEMO-CERT-0003 expired on 2026-10-01."), at: "2026-10-02T08:00:00.000Z", read: true, kind: "warning", href: "/dashboard/certificates/cert3" },
  { id: "n4", title: bi("تم تحديث حالة طلب", "Request status updated"), body: bi("الطلب DEMO-APP-2026-0006 انتقل إلى مرحلة التقييم.", "Request DEMO-APP-2026-0006 moved to assessment."), at: "2026-10-20T11:00:00.000Z", read: true, kind: "info", href: "/dashboard/applications/app6" },
  { id: "n5", title: bi("مرحباً بك في النموذج التجريبي", "Welcome to the prototype"), body: bi("جميع البيانات هنا توضيحية وتُحفظ على جهازك فقط.", "All data here is illustrative and stored on your device only."), at: "2026-08-12T09:05:00.000Z", read: true, kind: "info" },
];

export const SEED_ACTIVITIES: ActivityItem[] = [
  { id: "ac1", title: bi("تمت إضافة منتج «كرسي مكتب مريح» كمسودة", "Product “Ergonomic office chair” saved as draft"), at: "2026-10-30T09:15:00.000Z", kind: "product" },
  { id: "ac2", title: bi("تم تقديم الطلب DEMO-APP-2026-0007", "Request DEMO-APP-2026-0007 submitted"), at: "2026-10-28T13:40:00.000Z", kind: "application" },
  { id: "ac3", title: bi("تم رفع مستند «datasheet.pdf»", "Document “datasheet.pdf” uploaded"), at: "2026-10-28T13:35:00.000Z", kind: "document" },
  { id: "ac4", title: bi("طلب استكمال بيانات للطلب DEMO-APP-2026-0005", "Information requested for DEMO-APP-2026-0005"), at: "2026-10-16T10:00:00.000Z", kind: "application" },
  { id: "ac5", title: bi("تم تحديث بيانات المنشأة", "Facility details updated"), at: "2026-09-30T08:10:00.000Z", kind: "account" },
];

export const statusLabelOf = (s: ApplicationStatus) => APPLICATION_STATUS[s].label;
