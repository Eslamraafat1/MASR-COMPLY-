import type { Bi } from "./i18n/config";

export type AccountType =
  | "importer"
  | "manufacturer"
  | "individual"
  | "government"
  | "assessment_body"
  | "inspection_body";

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "info_required"
  | "under_assessment"
  | "completed"
  | "rejected";

export type ProductStatus = "draft" | "pending_review" | "registered" | "info_required";
export type CertificateStatus = "active" | "expired" | "pending" | "revoked";
export type ShipmentStatus = "draft" | "submitted" | "under_review" | "cleared" | "info_required";

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  organization: string;
  emailVerified: boolean;
  createdAt: string;
};

export type Facility = {
  id: string;
  name: Bi;
  commercialReg: string;
  taxId: string;
  activity: Bi;
  city: Bi;
  contact: string;
  status: "verified" | "pending";
  products: number;
};

export type Product = {
  id: string;
  ref: string;
  nameAr: string;
  nameEn: string;
  category: string; // category id
  brand: string;
  model: string;
  origin: string; // ISO-like country id
  manufacturer: string;
  hsCode?: string;
  description: string;
  status: ProductStatus;
  createdAt: string;
  attachments: DocumentFile[];
};

export type DocumentFile = {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  kind?: Bi;
};

export type TimelineEvent = {
  id: string;
  at: string;
  status: ApplicationStatus;
  title: Bi;
  note?: Bi;
  actor?: Bi;
};

export type RequiredAction = {
  id: string;
  title: Bi;
  detail: Bi;
  done: boolean;
};

export type Application = {
  id: string;
  ref: string;
  productId: string;
  productName: Bi;
  type: "conformity" | "assessment" | "renewal";
  bodyId?: string;
  status: ApplicationStatus;
  submittedAt?: string;
  updatedAt: string;
  notes?: string;
  documents: DocumentFile[];
  actions: RequiredAction[];
  timeline: TimelineEvent[];
};

export type Certificate = {
  id: string;
  ref: string;
  applicationRef: string;
  productName: Bi;
  holder: string;
  scheme: Bi;
  issuedAt: string;
  expiresAt: string;
  status: CertificateStatus;
};

export type Shipment = {
  id: string;
  ref: string;
  description: Bi;
  origin: string;
  port: Bi;
  items: number;
  status: ShipmentStatus;
  createdAt: string;
  documents: number;
};

export type NotificationItem = {
  id: string;
  title: Bi;
  body: Bi;
  at: string;
  read: boolean;
  kind: "info" | "action" | "success" | "warning";
  href?: string;
};

export type ActivityItem = {
  id: string;
  title: Bi;
  at: string;
  kind: "product" | "application" | "document" | "account";
};

/* ───────── reference / catalogue content (configurable, pending verification) ───────── */

export type ServiceItem = {
  slug: string;
  icon: string;
  title: Bi;
  short: Bi;
  long: Bi;
  steps: Bi[];
  docs: Bi[];
  href: string; // where the primary CTA goes (inside the authenticated area)
};

export type SectorItem = {
  slug: string;
  icon: string;
  accountType: AccountType;
  title: Bi;
  short: Bi;
  long: Bi;
  can: Bi[];
};

export type RegulationItem = {
  id: string;
  code: string;
  kind: "regulation" | "standard";
  title: Bi;
  sector: Bi;
  summary: Bi;
  status: "indicative";
};

export type HsCodeItem = {
  code: string;
  title: Bi;
  chapter: Bi;
  note?: Bi;
};

export type AssessmentBodyItem = {
  id: string;
  name: Bi;
  city: Bi;
  scopes: Bi[];
  accreditation: Bi;
  email: string;
};

export type CategoryItem = { id: string; title: Bi };
export type CountryItem = { id: string; title: Bi };
