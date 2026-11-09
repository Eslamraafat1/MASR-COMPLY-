import { bi, type Bi } from "../i18n/config";
import type { AccountType, SectorItem, ServiceItem } from "../types";

/** Shown wherever workflow or regulatory content appears. */
export const PROPOSED_NOTICE = bi(
  "محتوى مقترح لأغراض النموذج الأولي، وهو غير مُعتمد رسمياً إلى حين التحقق منه مع الجهات المختصة.",
  "Proposed content for prototype purposes. It is not officially verified until confirmed with the competent authorities.",
);

export const DEMO_NOTICE = bi(
  "بيانات تجريبية (DEMO) لأغراض العرض فقط — ليست سجلات حكومية حقيقية.",
  "DEMO data for illustration only — not real government records.",
);

export const BRAND = {
  name: "MASR COMPLY",
  arName: "منصة مصر للمطابقة وسلامة المنتجات",
  enName: "Masr Comply — Product Compliance & Safety Platform",
  tagline: bi("نحو سوق مصري أكثر أماناً وجودة.", "Building a Safer, More Trusted Egyptian Market."),
};

export const SERVICES: ServiceItem[] = [
  {
    slug: "product-registration",
    icon: "PackagePlus",
    title: bi("تسجيل المنتجات", "Product Registration"),
    short: bi("أضف منتجاتك وبياناتها الفنية ومستنداتها في سجل واحد منظم.", "Add your products, technical data and documents in one organised record."),
    long: bi(
      "يتيح لك هذا المسار إنشاء سجل رقمي لكل منتج يتضمن الاسم والفئة والعلامة التجارية وبلد المنشأ والمصنّع والمستندات الداعمة، لتبقى بياناتك جاهزة لأي طلب مطابقة لاحق.",
      "Create a digital record for each product with its name, category, brand, origin, manufacturer and supporting documents, so your data is ready for any later conformity request.",
    ),
    steps: [
      bi("أدخل بيانات المنتج الأساسية", "Enter the core product details"),
      bi("أضف البيانات الفنية ورمز النظام المنسق", "Add technical data and HS code"),
      bi("ارفع الصور والمستندات الداعمة", "Upload images and supporting documents"),
      bi("راجع البيانات ثم قدّم الطلب", "Review and submit"),
    ],
    docs: [
      bi("صور واضحة للمنتج", "Clear product images"),
      bi("كتيّب البيانات الفنية أو المواصفات", "Datasheet or specifications"),
      bi("بيانات المصنّع", "Manufacturer details"),
    ],
    href: "/dashboard/products/new",
  },
  {
    slug: "conformity-request",
    icon: "ClipboardCheck",
    title: bi("طلب تقييم المطابقة", "Conformity Assessment Request"),
    short: bi("قدّم طلب تقييم لمنتج مسجّل واختر جهة التقييم المناسبة.", "Submit an assessment request for a registered product and pick a body."),
    long: bi(
      "اختر منتجاً من سجلك، وحدّد نوع الطلب وجهة التقييم، ثم أرفق المستندات المطلوبة. ستتابع حالة الطلب لحظة بلحظة من لوحة التحكم.",
      "Pick a product from your register, choose the request type and assessment body, and attach the required documents. You can follow the request from your dashboard.",
    ),
    steps: [
      bi("اختر المنتج من سجلك", "Choose a product from your register"),
      bi("حدّد نوع الطلب وجهة التقييم", "Select request type and assessment body"),
      bi("أرفق المستندات المطلوبة", "Attach the required documents"),
      bi("قدّم الطلب وتابع الحالة", "Submit and follow the status"),
    ],
    docs: [
      bi("تقارير اختبار (إن وجدت)", "Test reports (if available)"),
      bi("بيانات المنتج المسجّل", "Registered product record"),
    ],
    href: "/dashboard/applications/new",
  },
  {
    slug: "certificates",
    icon: "BadgeCheck",
    title: bi("إدارة شهادات المطابقة", "Conformity Certificates"),
    short: bi("اطّلع على الشهادات وتواريخ صلاحيتها وحمّل نسخاً للمعاينة.", "View certificates, validity dates and download previews."),
    long: bi(
      "مكان واحد لعرض الشهادات المرتبطة بمنتجاتك، مع تنبيهات قبل انتهاء الصلاحية وإمكانية معاينة المستند وطباعته. الشهادات في هذا النموذج تجريبية وغير ذات حجية قانونية.",
      "One place to see certificates linked to your products, with expiry reminders and a printable preview. Certificates in this prototype are demonstration documents with no legal validity.",
    ),
    steps: [
      bi("افتح قائمة الشهادات", "Open your certificates list"),
      bi("ابحث أو صفِّ حسب الحالة", "Search or filter by status"),
      bi("عاين المستند واطبعه", "Preview and print the document"),
    ],
    docs: [],
    href: "/dashboard/certificates",
  },
  {
    slug: "shipment-documents",
    icon: "Ship",
    title: bi("إدارة مستندات الشحنات", "Shipment Documents"),
    short: bi("نظّم مستندات الشحنات المرتبطة بمنتجاتك وتابع حالتها.", "Organise documents for shipments tied to your products."),
    long: bi(
      "أنشئ ملف شحنة، واربطه بالمنتجات والمستندات، وتابع مراحله من الإعداد حتى الاكتمال، مع سجل واضح لكل مستند.",
      "Create a shipment file, link products and documents, and follow it from preparation to completion with a clear document history.",
    ),
    steps: [
      bi("أنشئ ملف الشحنة", "Create the shipment file"),
      bi("أضف المنتجات والمستندات", "Add products and documents"),
      bi("قدّم الملف وتابع الحالة", "Submit and track the status"),
    ],
    docs: [bi("فاتورة الشحن", "Commercial invoice"), bi("قائمة التعبئة", "Packing list")],
    href: "/dashboard/shipments",
  },
  {
    slug: "application-tracking",
    icon: "Radar",
    title: bi("متابعة الطلبات", "Application Tracking"),
    short: bi("تتبّع أي طلب برقمه المرجعي واطّلع على مراحله وإجراءاته المطلوبة.", "Track any request by reference and see its stages and required actions."),
    long: bi(
      "أدخل الرقم المرجعي للطلب لمعرفة حالته الحالية والمراحل التي مرّ بها وأي إجراءات مطلوبة منك.",
      "Enter a request reference to see its current status, the stages it passed through, and any actions required from you.",
    ),
    steps: [bi("أدخل الرقم المرجعي", "Enter the reference"), bi("اطّلع على الحالة والسجل الزمني", "See status and timeline")],
    docs: [],
    href: "/track",
  },
  {
    slug: "assessment-bodies",
    icon: "Landmark",
    title: bi("البحث عن جهات التقييم", "Find Assessment Bodies"),
    short: bi("استعرض جهات التقييم حسب المجال والمدينة والنطاق.", "Browse assessment bodies by scope, city and field."),
    long: bi(
      "دليل قابل للبحث لجهات تقييم المطابقة ونطاق عمل كل جهة. القائمة الحالية تجريبية وتُستبدل بالبيانات المعتمدة عند التحقق منها.",
      "A searchable directory of conformity assessment bodies and their scope. The current list is illustrative and will be replaced with verified data.",
    ),
    steps: [bi("ابحث بالاسم أو المجال", "Search by name or field"), bi("قارن النطاقات", "Compare scopes"), bi("اختر الجهة عند تقديم الطلب", "Select when applying")],
    docs: [],
    href: "/assessment-bodies",
  },
  {
    slug: "regulations",
    icon: "BookOpenCheck",
    title: bi("اللوائح والمواصفات", "Regulations & Standards"),
    short: bi("ابحث في اللوائح الفنية والمواصفات المرتبطة بقطاع منتجك.", "Search technical regulations and standards related to your sector."),
    long: bi(
      "مكتبة قابلة للبحث للوائح الفنية والمواصفات. المحتوى قابل للضبط ومحدد كمقترح إلى حين التحقق الرسمي.",
      "A searchable library of technical regulations and standards. The content is configurable and marked as proposed until officially verified.",
    ),
    steps: [bi("ابحث بالكلمة أو القطاع", "Search by keyword or sector"), bi("اطّلع على الملخص", "Read the summary"), bi("ارجع إلى المصدر الرسمي للتحقق", "Verify against the official source")],
    docs: [],
    href: "/regulations",
  },
  {
    slug: "facilities",
    icon: "Factory",
    title: bi("إدارة المنشآت", "Facility Management"),
    short: bi("أدر بيانات منشآتك وفروعك وجهات الاتصال في مكان واحد.", "Manage your facilities, branches and contacts in one place."),
    long: bi(
      "سجّل منشآتك وحدّث بياناتها، واربط المنتجات بالمنشأة المسؤولة عنها لتسهيل تقديم الطلبات لاحقاً.",
      "Register your facilities, keep their details up to date and link products to the responsible facility to simplify later requests.",
    ),
    steps: [bi("أضف المنشأة", "Add the facility"), bi("أدخل بيانات السجل والنشاط", "Enter registration and activity data"), bi("اربط المنتجات", "Link products")],
    docs: [bi("بيانات السجل التجاري", "Commercial registration details")],
    href: "/dashboard/facilities",
  },
];

export const SECTORS: SectorItem[] = [
  {
    slug: "importers",
    icon: "Container",
    accountType: "importer",
    title: bi("المستوردون", "Importers"),
    short: bi("سجّل المنتجات المستوردة وأدر مستندات الشحنات وطلبات المطابقة.", "Register imported products and manage shipment documents and conformity requests."),
    long: bi("للمنشآت التي تستورد منتجات للسوق المصري وتحتاج إلى تنظيم ملفاتها ومستنداتها وطلباتها في بيئة واحدة.", "For businesses importing products into the Egyptian market that need their files, documents and requests organised in one environment."),
    can: [bi("تسجيل المنتجات المستوردة", "Register imported products"), bi("إدارة مستندات الشحنات", "Manage shipment documents"), bi("متابعة طلبات المطابقة", "Follow conformity requests")],
  },
  {
    slug: "manufacturers",
    icon: "Factory",
    accountType: "manufacturer",
    title: bi("المصنعون المحليون", "Local Manufacturers"),
    short: bi("نظّم منتجاتك المحلية وملفات الجودة وطلبات التقييم.", "Organise local products, quality files and assessment requests."),
    long: bi("للمصانع والمنتجين المحليين الذين يرغبون في توثيق منتجاتهم وإدارة شهاداتها وطلباتها.", "For factories and local producers who want to document their products and manage certificates and requests."),
    can: [bi("تسجيل خطوط الإنتاج والمنتجات", "Register production lines and products"), bi("تقديم طلبات التقييم", "Submit assessment requests"), bi("إدارة الشهادات", "Manage certificates")],
  },
  {
    slug: "individuals",
    icon: "UserRound",
    accountType: "individual",
    title: bi("الأفراد", "Individuals"),
    short: bi("تحقق من المنتجات وتابع الطلبات الخاصة بك بسهولة.", "Look up products and follow your own requests with ease."),
    long: bi("للأفراد الراغبين في الاستعلام عن المنتجات أو متابعة طلبات شخصية دون تعقيد.", "For individuals who want to look up products or follow personal requests without complexity."),
    can: [bi("البحث عن المنتجات والمواصفات", "Search products and standards"), bi("متابعة الطلبات الشخصية", "Follow personal requests"), bi("الاطلاع على الإرشادات", "Read guidance")],
  },
  {
    slug: "government",
    icon: "Building2",
    accountType: "government",
    title: bi("الجهات الحكومية", "Government Entities"),
    short: bi("بوابة مقترحة للاطلاع على الطلبات والبيانات ذات الصلة بالجهة.", "A proposed portal to view requests and data relevant to the entity."),
    long: bi("مسار مقترح للجهات الحكومية للاطلاع على البيانات المشتركة وتنسيق المراجعة، ويخضع لضوابط وصلاحيات تُحدد لاحقاً.", "A proposed track for government entities to view shared data and coordinate reviews, subject to permissions to be defined later."),
    can: [bi("الاطلاع على بيانات المنتجات", "View product data"), bi("تنسيق المراجعات", "Coordinate reviews"), bi("تقارير مجمّعة", "Aggregated reports")],
  },
  {
    slug: "assessment-bodies",
    icon: "FlaskConical",
    accountType: "assessment_body",
    title: bi("جهات تقييم المطابقة", "Conformity Assessment Bodies"),
    short: bi("استقبل الطلبات ونسّق الاختبارات وأصدر نتائج التقييم.", "Receive requests, coordinate testing and report assessment results."),
    long: bi("لجهات الاختبار والفحص والاعتماد التي تستقبل طلبات التقييم وتتابع نتائجها.", "For testing, certification and inspection bodies that receive assessment requests and follow their outcomes."),
    can: [bi("استقبال الطلبات", "Receive requests"), bi("طلب استكمال بيانات", "Request additional information"), bi("تسجيل نتائج التقييم", "Record assessment outcomes")],
  },
  {
    slug: "inspection-bodies",
    icon: "ScanSearch",
    accountType: "inspection_body",
    title: bi("جهات التفتيش", "Inspection Bodies"),
    short: bi("نسّق أعمال التفتيش وارتبط بملفات المنتجات والشحنات.", "Coordinate inspection work and link to product and shipment files."),
    long: bi("لجهات التفتيش التي تحتاج إلى الاطلاع على ملفات الشحنات والمنتجات ذات الصلة وتسجيل ملاحظاتها.", "For inspection bodies that need to see relevant shipment and product files and record their findings."),
    can: [bi("الاطلاع على ملفات الشحنات", "View shipment files"), bi("تسجيل ملاحظات التفتيش", "Record inspection notes"), bi("متابعة الحالات", "Follow cases")],
  },
];

export const ACCOUNT_TYPE_LABEL: Record<AccountType, Bi> = {
  importer: bi("مستورد", "Importer"),
  manufacturer: bi("مصنع محلي", "Local Manufacturer"),
  individual: bi("فرد", "Individual"),
  government: bi("جهة حكومية", "Government Entity"),
  assessment_body: bi("جهة تقييم مطابقة", "Conformity Assessment Body"),
  inspection_body: bi("جهة تفتيش", "Inspection Body"),
};

export const WORKFLOW_STEPS: { n: string; icon: string; title: Bi; text: Bi }[] = [
  { n: "01", icon: "UserPlus", title: bi("إنشاء حساب المنشأة", "Create a facility account"), text: bi("سجّل بيانات منشأتك واختر نوع الحساب المناسب.", "Register your facility and choose the right account type.") },
  { n: "02", icon: "PackagePlus", title: bi("تسجيل المنتجات", "Register products"), text: bi("أضف بيانات المنتجات والمستندات الداعمة.", "Add product data and supporting documents.") },
  { n: "03", icon: "ClipboardList", title: bi("تقديم طلب التقييم", "Submit an assessment request"), text: bi("اختر المنتج وجهة التقييم وقدّم طلبك.", "Pick the product and body, then submit your request.") },
  { n: "04", icon: "FileSearch", title: bi("مراجعة المستندات", "Document review"), text: bi("تُراجع المستندات ويُطلب استكمال أي نقص.", "Documents are reviewed and any gaps are flagged.") },
  { n: "05", icon: "Activity", title: bi("متابعة حالة الطلب", "Follow request status"), text: bi("تابع كل مرحلة وإشعاراتها من لوحة التحكم.", "Follow every stage and notification from your dashboard.") },
  { n: "06", icon: "FileCheck2", title: bi("استكمال الإجراءات وإصدار المستندات", "Complete procedures & issue documents"), text: bi("عند استيفاء المتطلبات تُتاح المستندات المرتبطة.", "When requirements are met, related documents become available.") },
];

export const STATS: { icon: string; label: Bi }[] = [
  { icon: "Boxes", label: bi("المنتجات المسجلة", "Registered products") },
  { icon: "Building", label: bi("المنشآت المسجلة", "Registered facilities") },
  { icon: "Send", label: bi("الطلبات المقدمة", "Submitted requests") },
  { icon: "CircleCheckBig", label: bi("الطلبات المكتملة", "Completed requests") },
];

export const ANNOUNCEMENTS: { id: string; category: Bi; date: string; title: Bi; text: Bi; body: Bi }[] = [
  {
    id: "a1",
    category: bi("تحديث المنصة", "Platform update"),
    date: "2026-10-28",
    title: bi("إطلاق النسخة التجريبية من لوحة التحكم", "Dashboard prototype preview released"),
    text: bi("لوحة تحكم موحدة لمتابعة المنتجات والطلبات والشهادات في مكان واحد.", "A unified dashboard to follow products, requests and certificates in one place."),
    body: bi("تتيح النسخة التجريبية تجربة رحلة المستخدم كاملة: من إنشاء الحساب وتسجيل المنتج إلى متابعة الطلب. جميع البيانات المعروضة تجريبية.", "The prototype lets you experience the full user journey: from account creation and product registration to request tracking. All displayed data is demonstration data."),
  },
  {
    id: "a2",
    category: bi("دليل إرشادي", "Guide"),
    date: "2026-10-12",
    title: bi("دليل مبسّط لتجهيز مستندات المنتج", "A simple guide to preparing product documents"),
    text: bi("نصائح عامة لتنظيم المستندات قبل البدء في تسجيل المنتج.", "General tips for organising your documents before registering a product."),
    body: bi("ننصح بتجهيز صور واضحة للمنتج، وبيانات المصنّع، وأي تقارير فنية متاحة قبل البدء في نموذج التسجيل.", "We recommend preparing clear product images, manufacturer details and any available technical reports before starting the registration form."),
  },
  {
    id: "a3",
    category: bi("لغة وإتاحة", "Language & access"),
    date: "2026-09-30",
    title: bi("دعم كامل للعربية والإنجليزية", "Full Arabic and English support"),
    text: bi("تبدّل واجهة المنصة اتجاهها وخطوطها تلقائياً عند تغيير اللغة.", "The interface flips direction and typography automatically when you change language."),
    body: bi("يتم حفظ اختيار اللغة تلقائياً ويُطبّق على جميع الصفحات، بما فيها لوحة التحكم والجداول والنماذج.", "Your language choice is remembered and applied to every page, including the dashboard, tables and forms."),
  },
  {
    id: "a4",
    category: bi("قريباً", "Coming soon"),
    date: "2026-09-15",
    title: bi("التكامل مع الخدمات الخلفية قيد التخطيط", "Backend integration under planning"),
    text: bi("تم فصل طبقة الخدمات لتسهيل الربط مع واجهات برمجية حقيقية لاحقاً.", "The service layer is decoupled to ease connecting real APIs later."),
    body: bi("هذا النموذج الأولي يعمل ببيانات محاكاة. لا توجد حالياً أي تكاملات رسمية مع جهات حكومية.", "This prototype runs on simulated data. There are currently no official integrations with government bodies."),
  },
];

export const FAQS: { id: string; topic: Bi; q: Bi; a: Bi }[] = [
  {
    id: "f1",
    topic: bi("الحساب", "Account"),
    q: bi("كيف أنشئ حساباً على المنصة؟", "How do I create an account?"),
    a: bi("اختر «إنشاء حساب»، ثم حدّد نوع الحساب وأدخل بيانات المنشأة وجهة الاتصال. بعد ذلك ستصلك رسالة لتأكيد البريد الإلكتروني. في هذا النموذج التجريبي لا يتم إرسال رسائل حقيقية.", "Choose “Create account”, select your account type, then enter facility and contact details. You would then confirm your email address. In this prototype no real emails are sent."),
  },
  {
    id: "f2",
    topic: bi("المنتجات", "Products"),
    q: bi("كيف أسجّل منتجاً جديداً؟", "How do I register a new product?"),
    a: bi("من لوحة التحكم اختر «منتجاتي» ثم «تسجيل منتج جديد»، واتبع الخطوات: البيانات الأساسية، البيانات الفنية، المستندات، ثم المراجعة والتقديم. يمكنك حفظ المسودة والعودة لاحقاً.", "From your dashboard choose “My products” then “Register product”, and follow the steps: basics, technical data, documents, then review and submit. You can save a draft and return later."),
  },
  {
    id: "f3",
    topic: bi("المستندات", "Documents"),
    q: bi("ما المستندات التي قد أحتاج إليها؟", "Which documents might I need?"),
    a: bi("تختلف المتطلبات حسب نوع المنتج والإجراء. بشكل عام قد تشمل صور المنتج، وبيانات المصنّع، وكتيّب المواصفات، وتقارير الاختبار. المتطلبات النهائية تحددها الجهات المختصة ولا تُعد هذه الإجابة التزاماً قانونياً.", "Requirements vary by product and procedure. In general they may include product images, manufacturer details, a datasheet and test reports. Final requirements are set by the competent authorities; this answer is not a legal requirement."),
  },
  {
    id: "f4",
    topic: bi("المتابعة", "Tracking"),
    q: bi("كيف أتابع حالة طلبي؟", "How can I follow my request status?"),
    a: bi("افتح «طلبات تقييم المطابقة» في لوحة التحكم أو استخدم صفحة «متابعة الطلب» بالرقم المرجعي. ستجد الحالة الحالية والسجل الزمني وأي إجراءات مطلوبة.", "Open “Conformity requests” in your dashboard or use the “Track request” page with the reference. You will see the current status, timeline and any required actions."),
  },
  {
    id: "f5",
    topic: bi("المطابقة", "Conformity"),
    q: bi("ما المقصود بتقييم المطابقة؟", "What is conformity assessment?"),
    a: bi("هو التحقق من أن المنتج يستوفي متطلبات لائحة فنية أو مواصفة محددة، من خلال اختبار أو فحص أو مراجعة مستندات تقوم بها جهة تقييم.", "It is verifying that a product meets the requirements of a given technical regulation or standard, through testing, inspection or document review carried out by an assessment body."),
  },
  {
    id: "f6",
    topic: bi("المطابقة", "Conformity"),
    q: bi("هل هذه المنصة جهة حكومية رسمية؟", "Is this an official government platform?"),
    a: bi("لا. MASR COMPLY نموذج أولي مستقل لمفهوم منصة رقمية، ولا يرتبط بأي وزارة أو جهة تنظيمية، ولا يُصدر موافقات أو شهادات ذات حجية قانونية.", "No. MASR COMPLY is an independent prototype of a platform concept. It is not affiliated with any ministry or regulator and does not issue approvals or legally valid certificates."),
  },
  {
    id: "f7",
    topic: bi("الدعم", "Support"),
    q: bi("كيف أتواصل مع الدعم؟", "How do I contact support?"),
    a: bi("استخدم صفحة «تواصل معنا» أو مركز المساعدة. في هذا النموذج تُحفظ الرسائل محلياً على جهازك فقط.", "Use the “Contact us” page or the Help Center. In this prototype, messages are stored locally on your device only."),
  },
  {
    id: "f8",
    topic: bi("الحساب", "Account"),
    q: bi("هل بياناتي محفوظة بأمان؟", "Is my data stored securely?"),
    a: bi("النموذج الأولي لا يرسل بياناتك إلى أي خادم؛ تُحفظ بيانات العرض محلياً في متصفحك ولا تُخزَّن كلمات المرور إطلاقاً. لا تُدخل بيانات حقيقية حساسة.", "The prototype sends nothing to any server; demo data is kept locally in your browser and passwords are never stored. Please do not enter real sensitive data."),
  },
];

export const HELP_CATEGORIES: { icon: string; title: Bi; text: Bi; href: string }[] = [
  { icon: "UserCog", title: bi("الحساب والتسجيل", "Account & registration"), text: bi("إنشاء الحساب، أنواع الحسابات، واستعادة كلمة المرور.", "Creating an account, account types and password recovery."), href: "/faq" },
  { icon: "PackageSearch", title: bi("تسجيل المنتجات", "Product registration"), text: bi("كيفية إدخال بيانات المنتج وتجهيز المستندات.", "How to enter product data and prepare documents."), href: "/services/product-registration" },
  { icon: "ClipboardCheck", title: bi("طلبات المطابقة", "Conformity requests"), text: bi("تقديم الطلب وفهم الحالات والإجراءات المطلوبة.", "Submitting requests and understanding statuses and actions."), href: "/services/conformity-request" },
  { icon: "Ship", title: bi("مستندات الشحنات", "Shipment documents"), text: bi("إنشاء ملف الشحنة وإدارة مستنداتها.", "Creating a shipment file and managing its documents."), href: "/services/shipment-documents" },
  { icon: "Scale", title: bi("اللوائح والمواصفات", "Regulations & standards"), text: bi("البحث في المحتوى التنظيمي المقترح.", "Searching the proposed regulatory content."), href: "/regulations" },
  { icon: "LifeBuoy", title: bi("التواصل مع الدعم", "Contact support"), text: bi("أرسل استفسارك وسنعود إليك في النموذج التجريبي.", "Send your question; in the prototype it is stored locally."), href: "/contact" },
];
