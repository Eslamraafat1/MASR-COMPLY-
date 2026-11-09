import { bi, type Bi } from "../i18n/config";
import { SERVICES } from "./content";

export type NavLeaf = { href: string; label: Bi; hint?: Bi; icon?: string };
export type NavItem = { id: string; label: Bi; href?: string; children?: NavLeaf[] };

export const NAV: NavItem[] = [
  { id: "home", label: bi("الرئيسية", "Home"), href: "/" },
  { id: "about", label: bi("عن المنصة", "About"), href: "/about" },
  {
    id: "services",
    label: bi("الخدمات", "Services"),
    href: "/services",
    children: SERVICES.map((s) => ({ href: `/services/${s.slug}`, label: s.title, hint: s.short, icon: s.icon })),
  },
  {
    id: "knowledge",
    label: bi("مركز المعرفة", "Knowledge center"),
    href: "/help",
    children: [
      { href: "/help", label: bi("مركز المساعدة", "Help center"), hint: bi("أدلة وإرشادات", "Guides and how-tos"), icon: "LifeBuoy" },
      { href: "/faq", label: bi("الأسئلة الشائعة", "FAQ"), hint: bi("إجابات سريعة", "Quick answers"), icon: "CircleHelp" },
      { href: "/regulations", label: bi("اللوائح الفنية والمواصفات", "Regulations & standards"), hint: bi("محتوى مقترح قابل للضبط", "Configurable proposed content"), icon: "Scale" },
      { href: "/hs-codes", label: bi("رموز النظام المنسق", "HS codes"), hint: bi("ابحث عن رمز المنتج", "Look up a product code"), icon: "Boxes" },
      { href: "/assessment-bodies", label: bi("جهات تقييم المطابقة", "Assessment bodies"), hint: bi("دليل تجريبي", "Illustrative directory"), icon: "Landmark" },
      { href: "/sectors", label: bi("القطاعات المستفيدة", "Beneficiary sectors"), hint: bi("مسار لكل فئة", "A path for every user"), icon: "Building2" },
    ],
  },
  { id: "contact", label: bi("تواصل معنا", "Contact"), href: "/contact" },
];

export const FOOTER_QUICK: NavLeaf[] = [
  { href: "/about", label: bi("عن المنصة", "About the platform") },
  { href: "/sectors", label: bi("القطاعات المستفيدة", "Beneficiary sectors") },
  { href: "/regulations", label: bi("اللوائح والمواصفات", "Regulations & standards") },
  { href: "/hs-codes", label: bi("رموز النظام المنسق", "HS codes") },
  { href: "/assessment-bodies", label: bi("جهات التقييم", "Assessment bodies") },
  { href: "/search", label: bi("البحث المتقدم", "Advanced search") },
];
export const FOOTER_SUPPORT: NavLeaf[] = [
  { href: "/help", label: bi("مركز المساعدة", "Help center") },
  { href: "/faq", label: bi("الأسئلة الشائعة", "FAQ") },
  { href: "/track", label: bi("متابعة طلب", "Track a request") },
  { href: "/contact", label: bi("تواصل معنا", "Contact us") },
];
