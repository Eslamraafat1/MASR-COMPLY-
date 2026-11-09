import { bi } from "../i18n/config";
import type { AssessmentBodyItem, CategoryItem, CountryItem, HsCodeItem, RegulationItem } from "../types";

/**
 * Reference catalogue — configurable content, PENDING OFFICIAL VERIFICATION.
 * Regulation entries are placeholders (DEMO codes). International standards are cited by their public
 * designation only; nothing here asserts that a standard is mandatory in Egypt.
 */

export const CATEGORIES: CategoryItem[] = [
  { id: "electrical", title: bi("الأجهزة الكهربائية والمنزلية", "Electrical & household appliances") },
  { id: "electronics", title: bi("الإلكترونيات ومعدات المعلومات", "Electronics & IT equipment") },
  { id: "toys", title: bi("ألعاب الأطفال", "Children's toys") },
  { id: "textiles", title: bi("المنسوجات والملابس", "Textiles & clothing") },
  { id: "cosmetics", title: bi("مستحضرات العناية الشخصية", "Personal care products") },
  { id: "building", title: bi("مواد البناء", "Building materials") },
  { id: "automotive", title: bi("قطع غيار المركبات", "Automotive parts") },
  { id: "food-contact", title: bi("مواد ملامسة للغذاء", "Food-contact materials") },
  { id: "lighting", title: bi("معدات الإضاءة", "Lighting equipment") },
  { id: "furniture", title: bi("الأثاث", "Furniture") },
];

export const COUNTRIES: CountryItem[] = [
  { id: "EG", title: bi("مصر", "Egypt") },
  { id: "CN", title: bi("الصين", "China") },
  { id: "TR", title: bi("تركيا", "Türkiye") },
  { id: "DE", title: bi("ألمانيا", "Germany") },
  { id: "IT", title: bi("إيطاليا", "Italy") },
  { id: "IN", title: bi("الهند", "India") },
  { id: "KR", title: bi("كوريا الجنوبية", "South Korea") },
  { id: "AE", title: bi("الإمارات", "United Arab Emirates") },
  { id: "SA", title: bi("السعودية", "Saudi Arabia") },
  { id: "US", title: bi("الولايات المتحدة", "United States") },
  { id: "JP", title: bi("اليابان", "Japan") },
  { id: "FR", title: bi("فرنسا", "France") },
];

export const REGULATIONS: RegulationItem[] = [
  { id: "r1", code: "DEMO-REG-001", kind: "regulation", title: bi("سلامة الأجهزة الكهربائية المنزلية (عنصر نائب)", "Household electrical appliance safety (placeholder)"), sector: bi("كهربائية", "Electrical"), summary: bi("عنصر نائب يمثل لائحة فنية مرتبطة بسلامة الأجهزة الكهربائية المنزلية. يُستبدل بالمحتوى الرسمي بعد التحقق.", "Placeholder representing a technical regulation on household appliance safety. To be replaced by verified official content."), status: "indicative" },
  { id: "r2", code: "DEMO-REG-002", kind: "regulation", title: bi("سلامة ألعاب الأطفال (عنصر نائب)", "Children's toy safety (placeholder)"), sector: bi("ألعاب", "Toys"), summary: bi("عنصر نائب يمثل متطلبات السلامة الميكانيكية والكيميائية للألعاب.", "Placeholder representing mechanical and chemical safety requirements for toys."), status: "indicative" },
  { id: "r3", code: "DEMO-REG-003", kind: "regulation", title: bi("بطاقات البيان للمنسوجات (عنصر نائب)", "Textile labelling (placeholder)"), sector: bi("منسوجات", "Textiles"), summary: bi("عنصر نائب يمثل متطلبات البيانات والوسم على المنسوجات.", "Placeholder representing data and labelling requirements for textiles."), status: "indicative" },
  { id: "r4", code: "DEMO-REG-004", kind: "regulation", title: bi("معدات الإضاءة والكفاءة (عنصر نائب)", "Lighting equipment & efficiency (placeholder)"), sector: bi("إضاءة", "Lighting"), summary: bi("عنصر نائب يمثل متطلبات سلامة وكفاءة معدات الإضاءة.", "Placeholder representing safety and efficiency requirements for lighting."), status: "indicative" },
  { id: "r5", code: "DEMO-REG-005", kind: "regulation", title: bi("مواد البناء ومتطلبات الأداء (عنصر نائب)", "Building materials performance (placeholder)"), sector: bi("بناء", "Construction"), summary: bi("عنصر نائب يمثل متطلبات أداء مواد البناء الأساسية.", "Placeholder representing basic performance requirements for building materials."), status: "indicative" },
  { id: "r6", code: "DEMO-REG-006", kind: "regulation", title: bi("المواد الملامسة للأغذية (عنصر نائب)", "Food-contact materials (placeholder)"), sector: bi("غذاء", "Food contact"), summary: bi("عنصر نائب يمثل اشتراطات المواد الملامسة للأغذية.", "Placeholder representing requirements for food-contact materials."), status: "indicative" },
  { id: "s1", code: "IEC 60335-1", kind: "standard", title: bi("سلامة الأجهزة الكهربائية المنزلية — متطلبات عامة", "Household and similar electrical appliances — Safety — General requirements"), sector: bi("كهربائية", "Electrical"), summary: bi("مواصفة دولية معروفة. لا يعني إدراجها هنا أنها إلزامية في مصر.", "A well-known international standard. Its listing here does not mean it is mandatory in Egypt."), status: "indicative" },
  { id: "s2", code: "IEC 62368-1", kind: "standard", title: bi("معدات الصوت والفيديو وتقنية المعلومات — متطلبات السلامة", "Audio/video, information and communication technology equipment — Safety"), sector: bi("إلكترونيات", "Electronics"), summary: bi("مواصفة دولية لسلامة معدات تقنية المعلومات والاتصالات.", "International standard for safety of ICT and AV equipment."), status: "indicative" },
  { id: "s3", code: "ISO 8124-1", kind: "standard", title: bi("سلامة الألعاب — الجوانب الميكانيكية والفيزيائية", "Safety of toys — Mechanical and physical properties"), sector: bi("ألعاب", "Toys"), summary: bi("مواصفة دولية للجوانب الميكانيكية والفيزيائية لسلامة الألعاب.", "International standard on mechanical and physical safety aspects of toys."), status: "indicative" },
  { id: "s4", code: "ISO 9001", kind: "standard", title: bi("أنظمة إدارة الجودة — المتطلبات", "Quality management systems — Requirements"), sector: bi("إدارة الجودة", "Quality management"), summary: bi("مواصفة دولية لأنظمة إدارة الجودة.", "International standard for quality management systems."), status: "indicative" },
  { id: "s5", code: "IEC 60598-1", kind: "standard", title: bi("المصابيح — متطلبات عامة واختبارات", "Luminaires — General requirements and tests"), sector: bi("إضاءة", "Lighting"), summary: bi("مواصفة دولية للمصابيح ومعدات الإضاءة.", "International standard for luminaires."), status: "indicative" },
  { id: "s6", code: "ISO 3758", kind: "standard", title: bi("المنسوجات — رموز العناية بالأقمشة", "Textiles — Care labelling code"), sector: bi("منسوجات", "Textiles"), summary: bi("مواصفة دولية لرموز العناية بالمنسوجات.", "International standard for textile care labelling symbols."), status: "indicative" },
];

export const HS_CODES: HsCodeItem[] = [
  { code: "8516", title: bi("سخانات كهربائية وأجهزة تسخين منزلية", "Electric heaters and domestic heating appliances"), chapter: bi("الفصل 85 — آلات وأجهزة كهربائية", "Chapter 85 — Electrical machinery") },
  { code: "8418", title: bi("ثلاجات ومجمدات ومعدات تبريد", "Refrigerators, freezers and refrigerating equipment"), chapter: bi("الفصل 84 — آلات وأجهزة ميكانيكية", "Chapter 84 — Machinery") },
  { code: "8450", title: bi("غسالات منزلية", "Household washing machines"), chapter: bi("الفصل 84 — آلات وأجهزة ميكانيكية", "Chapter 84 — Machinery") },
  { code: "8517", title: bi("هواتف وأجهزة اتصالات", "Telephones and communication apparatus"), chapter: bi("الفصل 85 — آلات وأجهزة كهربائية", "Chapter 85 — Electrical machinery") },
  { code: "8471", title: bi("آلات معالجة البيانات الآلية", "Automatic data-processing machines"), chapter: bi("الفصل 84 — آلات وأجهزة ميكانيكية", "Chapter 84 — Machinery") },
  { code: "8539", title: bi("مصابيح كهربائية ومصابيح LED", "Electric filament or discharge lamps, LED lamps"), chapter: bi("الفصل 85 — آلات وأجهزة كهربائية", "Chapter 85 — Electrical machinery") },
  { code: "9503", title: bi("ألعاب وأدوات تسلية للأطفال", "Toys and children's recreational articles"), chapter: bi("الفصل 95 — ألعاب وأدوات رياضية", "Chapter 95 — Toys, games and sports") },
  { code: "6109", title: bi("قمصان وملابس داخلية محبوكة", "T-shirts and knitted undershirts"), chapter: bi("الفصل 61 — ملابس محبوكة", "Chapter 61 — Knitted apparel") },
  { code: "3304", title: bi("مستحضرات التجميل والعناية بالبشرة", "Beauty and skin-care preparations"), chapter: bi("الفصل 33 — زيوت عطرية ومستحضرات تجميل", "Chapter 33 — Essential oils & cosmetics") },
  { code: "6907", title: bi("بلاط وقطع خزفية للرصف والتكسية", "Ceramic paving and cladding tiles"), chapter: bi("الفصل 69 — منتجات خزفية", "Chapter 69 — Ceramic products") },
  { code: "8708", title: bi("أجزاء وملحقات المركبات ذات المحرك", "Parts and accessories of motor vehicles"), chapter: bi("الفصل 87 — مركبات", "Chapter 87 — Vehicles") },
  { code: "9403", title: bi("أثاث آخر وأجزاؤه", "Other furniture and parts thereof"), chapter: bi("الفصل 94 — أثاث", "Chapter 94 — Furniture") },
];

export const ASSESSMENT_BODIES: AssessmentBodyItem[] = [
  { id: "b1", name: bi("مختبر النيل للاختبارات (تجريبي)", "Nile Testing Laboratory (DEMO)"), city: bi("القاهرة", "Cairo"), scopes: [bi("كهربائية", "Electrical"), bi("إلكترونيات", "Electronics")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b1@example.test" },
  { id: "b2", name: bi("مركز الدلتا للفحص والمعايرة (تجريبي)", "Delta Inspection & Calibration Centre (DEMO)"), city: bi("المنصورة", "Mansoura"), scopes: [bi("منسوجات", "Textiles"), bi("مواد البناء", "Building materials")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b2@example.test" },
  { id: "b3", name: bi("معمل الإسكندرية للجودة (تجريبي)", "Alexandria Quality Lab (DEMO)"), city: bi("الإسكندرية", "Alexandria"), scopes: [bi("مواد ملامسة للغذاء", "Food-contact"), bi("ألعاب", "Toys")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b3@example.test" },
  { id: "b4", name: bi("هيئة الصعيد لتقييم المطابقة (تجريبية)", "Upper Egypt Conformity Body (DEMO)"), city: bi("أسيوط", "Assiut"), scopes: [bi("مواد البناء", "Building materials"), bi("أثاث", "Furniture")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b4@example.test" },
  { id: "b5", name: bi("مركز السويس لاختبارات الإضاءة (تجريبي)", "Suez Lighting Test Centre (DEMO)"), city: bi("السويس", "Suez"), scopes: [bi("إضاءة", "Lighting"), bi("كهربائية", "Electrical")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b5@example.test" },
  { id: "b6", name: bi("معمل الجيزة للمركبات وقطع الغيار (تجريبي)", "Giza Automotive Parts Lab (DEMO)"), city: bi("الجيزة", "Giza"), scopes: [bi("قطع غيار المركبات", "Automotive parts")], accreditation: bi("بيانات الاعتماد قيد التحقق", "Accreditation details pending verification"), email: "demo-b6@example.test" },
];

export const categoryLabel = (id: string) => CATEGORIES.find((c) => c.id === id)?.title;
export const countryLabel = (id: string) => COUNTRIES.find((c) => c.id === id)?.title;
export const bodyById = (id?: string) => ASSESSMENT_BODIES.find((b) => b.id === id);
