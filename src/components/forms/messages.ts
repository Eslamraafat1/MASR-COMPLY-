import { bi, type Bi, type Locale } from "@/lib/i18n/config";

/** Validation message catalogue. Zod schemas emit keys; components translate them here. */
const M: Record<string, Bi> = {
  required: bi("هذا الحقل مطلوب.", "This field is required."),
  email: bi("أدخل بريداً إلكترونياً صحيحاً، مثل name@example.com.", "Enter a valid email, e.g. name@example.com."),
  passwordMin: bi("كلمة المرور يجب ألا تقل عن 8 أحرف.", "Password must be at least 8 characters."),
  passwordLetter: bi("أضف حرفاً واحداً على الأقل.", "Include at least one letter."),
  passwordDigit: bi("أضف رقماً واحداً على الأقل.", "Include at least one number."),
  passwordMatch: bi("كلمتا المرور غير متطابقتين.", "Passwords do not match."),
  mobile: bi("أدخل رقم موبايل مصرياً صحيحاً، مثل 01012345678.", "Enter a valid Egyptian mobile number, e.g. 01012345678."),
  terms: bi("يجب الموافقة على الشروط للمتابعة.", "You must accept the terms to continue."),
  commercialReg: bi("رقم السجل التجاري يجب أن يتكون من 4–20 حرفاً أو رقماً.", "Commercial registration must be 4–20 letters or digits."),
  taxId: bi("رقم التسجيل الضريبي يجب أن يتكون من 6–15 حرفاً أو رقماً.", "Tax registration number must be 6–15 letters or digits."),
  hsCode: bi("أدخل رمزاً من 4 أو 6 أو 8 أرقام، مثل 8516 أو 8516.10.", "Enter a 4, 6 or 8 digit code, e.g. 8516 or 8516.10."),
  descMin: bi("اكتب وصفاً لا يقل عن 20 حرفاً.", "Write a description of at least 20 characters."),
  msgMin: bi("اكتب رسالة لا تقل عن 10 أحرف.", "Write a message of at least 10 characters."),
  int: bi("أدخل رقماً صحيحاً.", "Enter a whole number."),
  min1: bi("القيمة يجب ألا تقل عن 1.", "Value must be at least 1."),
  max500n: bi("القيمة يجب ألا تزيد على 500.", "Value must be at most 500."),
  max60: bi("الحد الأقصى 60 حرفاً.", "Maximum 60 characters."),
  max80: bi("الحد الأقصى 80 حرفاً.", "Maximum 80 characters."),
  max120: bi("الحد الأقصى 120 حرفاً.", "Maximum 120 characters."),
  max160: bi("الحد الأقصى 160 حرفاً.", "Maximum 160 characters."),
  max500: bi("الحد الأقصى 500 حرف.", "Maximum 500 characters."),
  max1000: bi("الحد الأقصى 1000 حرف.", "Maximum 1000 characters."),
  max1500: bi("الحد الأقصى 1500 حرف.", "Maximum 1500 characters."),
};

export function msg(key: string | undefined, locale: Locale): string | undefined {
  if (!key) return undefined;
  return M[key]?.[locale] ?? M.required[locale];
}
