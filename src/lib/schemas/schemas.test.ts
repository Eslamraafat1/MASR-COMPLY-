import { describe, expect, it } from "vitest";
import { applicationSchema, productSchema, registerAccountSchema, registerOrgSchema, validateFile } from "./index";

const issues = (r: { success: boolean; error?: { issues: { path: PropertyKey[]; message: string }[] } }) => (r.success ? [] : r.error!.issues.map((i) => `${String(i.path[0])}:${i.message}`));

describe("registration rules depend on account type", () => {
  it("requires commercial + tax data for importers", () => {
    const r = registerOrgSchema.safeParse({ accountType: "importer", establishmentName: "X", address: "Cairo" });
    expect(issues(r)).toEqual(expect.arrayContaining(["commercialReg:required", "taxId:required", "activity:required"]));
  });
  it("does not require commercial data for government entities", () => {
    const r = registerOrgSchema.safeParse({ accountType: "government", establishmentName: "X", address: "Cairo" });
    expect(r.success).toBe(true);
  });
  it("individuals only need a full name", () => {
    expect(registerOrgSchema.safeParse({ accountType: "individual" }).success).toBe(false);
    expect(registerOrgSchema.safeParse({ accountType: "individual", fullName: "Sara" }).success).toBe(true);
  });
  it("validates mobile format and password confirmation", () => {
    const bad = registerAccountSchema.safeParse({ accountType: "individual", email: "a@b.co", mobile: "123", password: "abcdefg1", confirm: "different1" });
    expect(issues(bad)).toEqual(expect.arrayContaining(["mobile:mobile", "confirm:passwordMatch"]));
    const ok = registerAccountSchema.safeParse({ accountType: "individual", email: "a@b.co", mobile: "01012345678", password: "abcdefg1", confirm: "abcdefg1" });
    expect(ok.success).toBe(true);
  });
});

describe("product + application schemas", () => {
  const base = { nameAr: "غلاية", nameEn: "Kettle", category: "electrical", brand: "B", model: "M1", origin: "TR", manufacturer: "Acme", description: "A sufficiently long description." };
  it("accepts a valid product and optional HS code", () => {
    expect(productSchema.safeParse({ ...base, hsCode: "8516" }).success).toBe(true);
    expect(productSchema.safeParse({ ...base, hsCode: "" }).success).toBe(true);
  });
  it("rejects malformed HS codes and short descriptions", () => {
    expect(issues(productSchema.safeParse({ ...base, hsCode: "85" }))).toContain("hsCode:hsCode");
    expect(issues(productSchema.safeParse({ ...base, description: "short" }))).toContain("description:descMin");
  });
  it("requires product and body for applications", () => {
    expect(applicationSchema.safeParse({ productId: "", type: "conformity", bodyId: "" }).success).toBe(false);
  });
});

describe("file validation", () => {
  it("enforces type, size and duplicates", () => {
    expect(validateFile({ name: "a.exe", size: 10, type: "application/x-msdownload" }, [])).toBe("type");
    expect(validateFile({ name: "a.pdf", size: 6 * 1024 * 1024, type: "application/pdf" }, [])).toBe("size");
    expect(validateFile({ name: "a.pdf", size: 10, type: "application/pdf" }, [{ name: "a.pdf" }])).toBe("duplicate");
    expect(validateFile({ name: "b.pdf", size: 10, type: "application/pdf" }, [])).toBeNull();
  });
});
