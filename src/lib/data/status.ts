import { bi, type Bi } from "../i18n/config";
import type { ApplicationStatus, CertificateStatus, ProductStatus, ShipmentStatus } from "../types";

export type Tone = "neutral" | "info" | "warning" | "success" | "danger" | "navy";

export const APPLICATION_STATUS: Record<ApplicationStatus, { label: Bi; tone: Tone; order: number }> = {
  draft: { label: bi("مسودة", "Draft"), tone: "neutral", order: 0 },
  submitted: { label: bi("تم التقديم", "Submitted"), tone: "info", order: 1 },
  under_review: { label: bi("قيد المراجعة", "Under review"), tone: "navy", order: 2 },
  info_required: { label: bi("مطلوب استكمال بيانات", "Information required"), tone: "warning", order: 3 },
  under_assessment: { label: bi("قيد التقييم", "Under assessment"), tone: "info", order: 4 },
  completed: { label: bi("مكتمل", "Completed"), tone: "success", order: 5 },
  rejected: { label: bi("مرفوض", "Rejected"), tone: "danger", order: 6 },
};

export const PRODUCT_STATUS: Record<ProductStatus, { label: Bi; tone: Tone }> = {
  draft: { label: bi("مسودة", "Draft"), tone: "neutral" },
  pending_review: { label: bi("قيد المراجعة", "Pending review"), tone: "navy" },
  registered: { label: bi("مسجّل", "Registered"), tone: "success" },
  info_required: { label: bi("مطلوب استكمال بيانات", "Information required"), tone: "warning" },
};

export const CERTIFICATE_STATUS: Record<CertificateStatus, { label: Bi; tone: Tone }> = {
  active: { label: bi("سارية", "Active"), tone: "success" },
  expired: { label: bi("منتهية", "Expired"), tone: "danger" },
  pending: { label: bi("قيد الإصدار", "Pending"), tone: "info" },
  revoked: { label: bi("ملغاة", "Revoked"), tone: "danger" },
};

export const SHIPMENT_STATUS: Record<ShipmentStatus, { label: Bi; tone: Tone }> = {
  draft: { label: bi("مسودة", "Draft"), tone: "neutral" },
  submitted: { label: bi("تم التقديم", "Submitted"), tone: "info" },
  under_review: { label: bi("قيد المراجعة", "Under review"), tone: "navy" },
  info_required: { label: bi("مطلوب استكمال بيانات", "Information required"), tone: "warning" },
  cleared: { label: bi("مكتمل", "Completed"), tone: "success" },
};

/** Linear happy-path used by the demo "advance status" simulation. */
export const APPLICATION_FLOW: ApplicationStatus[] = ["submitted", "under_review", "under_assessment", "completed"];
