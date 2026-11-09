import { z } from "zod";

/**
 * Validation schemas. Messages are keyed (not translated strings) so that forms can map them to
 * the active locale via `msg()` in components/forms/messages.ts.
 */

export const ACCOUNT_TYPES = ["importer", "manufacturer", "individual", "government", "assessment_body", "inspection_body"] as const;
export const accountTypeSchema = z.enum(ACCOUNT_TYPES);

const req = (key: string) => z.string().trim().min(1, key);

export const loginSchema = z.object({
  email: z.string().trim().min(1, "required").email("email"),
  password: z.string().min(8, "passwordMin"),
  remember: z.boolean().optional(),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const forgotSchema = z.object({ email: z.string().trim().min(1, "required").email("email") });
export type ForgotInput = z.infer<typeof forgotSchema>;

export const resetSchema = z
  .object({
    password: z.string().min(8, "passwordMin").regex(/[A-Za-z؀-ۿ]/, "passwordLetter").regex(/\d/, "passwordDigit"),
    confirm: z.string().min(1, "required"),
  })
  .refine((v) => v.password === v.confirm, { path: ["confirm"], message: "passwordMatch" });
export type ResetInput = z.infer<typeof resetSchema>;

/* ───────── Registration wizard ───────── */

const phone = z
  .string()
  .trim()
  .min(1, "required")
  .regex(/^(\+?20|0)?1[0125]\d{8}$/, "mobile");

const optStr = z.string().trim().optional();
const passwordRule = z.string().min(8, "passwordMin").regex(/[A-Za-z؀-ۿ]/, "passwordLetter").regex(/\d/, "passwordDigit");
type Ctx = z.core.$RefinementCtx;
const missing = (v: unknown) => typeof v !== "string" || v.trim().length === 0;

const orgShape = {
  accountType: accountTypeSchema,
  establishmentName: optStr,
  commercialReg: optStr,
  taxId: optStr,
  activity: optStr,
  address: optStr,
  fullName: optStr,
};
const accountShape = {
  accountType: accountTypeSchema,
  contactPerson: optStr,
  email: z.string().trim().min(1, "required").email("email"),
  mobile: phone,
  password: passwordRule,
  confirm: z.string().min(1, "required"),
};

type OrgValues = { accountType: (typeof ACCOUNT_TYPES)[number]; establishmentName?: string; commercialReg?: string; taxId?: string; activity?: string; address?: string; fullName?: string };

/** Which fields are mandatory depends on the account type — individuals never provide business data. */
function orgRules(v: OrgValues, ctx: Ctx) {
  const need = (field: keyof OrgValues) => {
    if (missing(v[field])) ctx.addIssue({ code: "custom", path: [field], message: "required" });
  };
  if (v.accountType === "individual") {
    need("fullName");
    return;
  }
  need("establishmentName");
  need("address");
  // Commercial registration & tax id apply to commercial entities only (importers, manufacturers).
  if (v.accountType === "importer" || v.accountType === "manufacturer") {
    need("commercialReg");
    need("taxId");
    need("activity");
  }
  if (v.commercialReg && !/^[A-Za-z0-9\-/]{4,20}$/.test(v.commercialReg)) ctx.addIssue({ code: "custom", path: ["commercialReg"], message: "commercialReg" });
  if (v.taxId && !/^[A-Za-z0-9\-]{6,15}$/.test(v.taxId)) ctx.addIssue({ code: "custom", path: ["taxId"], message: "taxId" });
}
function accountRules(v: { accountType: OrgValues["accountType"]; contactPerson?: string; password: string; confirm: string }, ctx: Ctx) {
  if (v.accountType !== "individual" && missing(v.contactPerson)) ctx.addIssue({ code: "custom", path: ["contactPerson"], message: "required" });
  if (v.password !== v.confirm) ctx.addIssue({ code: "custom", path: ["confirm"], message: "passwordMatch" });
}

export const registerTypeSchema = z.object({ accountType: accountTypeSchema });
export const registerOrgSchema = z.object(orgShape).superRefine(orgRules);
export const registerAccountSchema = z.object(accountShape).superRefine(accountRules);
export const registerTermsSchema = z.object({ terms: z.boolean().refine((v) => v === true, "terms") });
export const registerSchema = z
  .object({ ...orgShape, ...accountShape, terms: z.boolean().refine((v) => v === true, "terms") })
  .superRefine((v, ctx) => {
    orgRules(v, ctx);
    accountRules(v, ctx);
  });
export type RegisterInput = z.infer<typeof registerSchema>;

/** One schema per wizard step; the form's resolver switches with the current step. */
export const REGISTER_STEP_SCHEMAS = [registerTypeSchema, registerOrgSchema, registerAccountSchema, registerTermsSchema] as const;

/* ───────── Product registration ───────── */

export const productSchema = z.object({
  nameAr: req("required").max(120, "max120"),
  nameEn: req("required").max(120, "max120"),
  category: req("required"),
  brand: req("required").max(80, "max80"),
  model: req("required").max(80, "max80"),
  origin: req("required"),
  manufacturer: req("required").max(120, "max120"),
  hsCode: z
    .string()
    .trim()
    .regex(/^(\d{4}|\d{6}|\d{8}|\d{4}\.\d{2}|\d{4}\.\d{2}\.\d{2})?$/, "hsCode")
    .optional(),
  description: req("required").min(20, "descMin").max(1000, "max1000"),
  facilityId: z.string().optional(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const PRODUCT_STEP_FIELDS: Record<number, (keyof ProductInput)[]> = {
  0: ["nameAr", "nameEn", "category", "brand", "model", "description"],
  1: ["origin", "manufacturer", "hsCode"],
};

/* ───────── Applications, shipments, contact ───────── */

export const applicationSchema = z.object({
  productId: req("required"),
  type: z.enum(["conformity", "assessment", "renewal"]),
  bodyId: req("required"),
  notes: z.string().trim().max(500, "max500").optional(),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;

export const shipmentSchema = z.object({
  description: req("required").max(160, "max160"),
  origin: req("required"),
  port: req("required"),
  items: z.coerce.number().int("int").min(1, "min1").max(500, "max500n"),
});
export type ShipmentInput = z.infer<typeof shipmentSchema>;

export const facilitySchema = z.object({
  name: req("required").max(120, "max120"),
  commercialReg: req("required").regex(/^[A-Za-z0-9\-/]{4,20}$/, "commercialReg"),
  taxId: req("required").regex(/^[A-Za-z0-9\-]{6,15}$/, "taxId"),
  activity: req("required").max(120, "max120"),
  city: req("required").max(60, "max60"),
  contact: req("required").max(80, "max80"),
});
export type FacilityInput = z.infer<typeof facilitySchema>;

export const contactSchema = z.object({
  name: req("required"),
  email: z.string().trim().min(1, "required").email("email"),
  topic: req("required"),
  message: req("required").min(10, "msgMin").max(1500, "max1500"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const settingsSchema = z.object({
  name: req("required"),
  email: z.string().trim().min(1, "required").email("email"),
  organization: req("required"),
});
export type SettingsInput = z.infer<typeof settingsSchema>;

/* ───────── File validation (shared by the dropzone) ───────── */

export const ALLOWED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"] as const;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_FILES = 8;

export type FileIssue = "type" | "size" | "count" | "duplicate";
export function validateFile(file: { name: string; size: number; type: string }, existing: { name: string }[]): FileIssue | null {
  if (!(ALLOWED_FILE_TYPES as readonly string[]).includes(file.type)) return "type";
  if (file.size > MAX_FILE_BYTES) return "size";
  if (existing.length >= MAX_FILES) return "count";
  if (existing.some((f) => f.name === file.name)) return "duplicate";
  return null;
}
