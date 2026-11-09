/**
 * Mock API service layer.
 *
 * Every function is async and returns plain data, mirroring what a REST/Laravel client would do.
 * Components must call `api.*` (via hooks) and never touch the store directly. To go live, re-implement
 * each method with `fetch('/api/...')` — signatures stay the same.
 *
 * NOTHING here is a real submission, approval, payment or government integration.
 */
import { bi } from "../i18n/config";
import { APPLICATION_STATUS, APPLICATION_FLOW } from "../data/status";
import { SEED_USER, buildTimeline } from "../data/seed";
import { ASSESSMENT_BODIES, CATEGORIES, HS_CODES, REGULATIONS } from "../data/reference";
import { sleep, uid } from "../utils";
import type { ApplicationInput, FacilityInput, ProductInput, RegisterInput, ShipmentInput } from "../schemas";
import type {
  ActivityItem,
  Application,
  ApplicationStatus,
  Certificate,
  DemoUser,
  DocumentFile,
  Facility,
  NotificationItem,
  Product,
  Shipment,
} from "../types";
import { getState, resetState, setState } from "./store";

const LATENCY = 260;
const lag = <T,>(v: T, ms = LATENCY): Promise<T> => sleep(ms).then(() => v);
const now = () => new Date().toISOString();
const pad = (n: number, w = 4) => String(n).padStart(w, "0");

export class ApiError extends Error {
  constructor(
    public code: "not_found" | "unauthorized" | "invalid",
    message: string,
  ) {
    super(message);
  }
}

function pushActivity(a: Omit<ActivityItem, "id" | "at">) {
  setState((s) => ({ ...s, activities: [{ id: uid("ac"), at: now(), ...a }, ...s.activities].slice(0, 30) }));
}
function pushNotification(n: Omit<NotificationItem, "id" | "at" | "read">) {
  setState((s) => ({ ...s, notifications: [{ id: uid("n"), at: now(), read: false, ...n }, ...s.notifications] }));
}

export const api = {
  auth: {
    me: () => lag(getState().user, 80),
    /** Demo sign-in: any well-formed credentials open the demo workspace. The password is NOT stored or checked. */
    async login(input: { email: string }): Promise<DemoUser> {
      await sleep(550);
      const base = getState().user ?? (input.email === SEED_USER.email ? SEED_USER : null);
      const user: DemoUser = base ?? {
        id: "u_demo",
        name: input.email.split("@")[0].replace(/[._-]+/g, " "),
        email: input.email,
        accountType: "importer",
        organization: "شركة الأفق للاستيراد (تجريبية)",
        emailVerified: true,
        createdAt: now(),
      };
      setState((s) => ({ ...s, user: { ...user, email: input.email } }));
      return user;
    },
    async register(input: RegisterInput): Promise<DemoUser> {
      await sleep(800);
      const user: DemoUser = {
        id: uid("u"),
        name: input.fullName || input.contactPerson || input.email,
        email: input.email,
        accountType: input.accountType,
        organization: input.establishmentName || input.fullName || input.email,
        emailVerified: false,
        createdAt: now(),
      };
      setState((s) => ({ ...s, user }));
      return user;
    },
    async verifyEmail(): Promise<void> {
      await sleep(500);
      setState((s) => (s.user ? { ...s, user: { ...s.user, emailVerified: true } } : s));
    },
    async updateProfile(patch: Partial<Pick<DemoUser, "name" | "email" | "organization">>): Promise<DemoUser> {
      await sleep(400);
      const s = getState();
      if (!s.user) throw new ApiError("unauthorized", "Not signed in");
      const user = { ...s.user, ...patch };
      setState((st) => ({ ...st, user }));
      return user;
    },
    async logout(): Promise<void> {
      setState((s) => ({ ...s, user: null }));
    },
    async resetDemo(): Promise<void> {
      resetState();
    },
  },

  dashboard: {
    async summary() {
      await sleep(LATENCY);
      const s = getState();
      const dist = (Object.keys(APPLICATION_STATUS) as ApplicationStatus[]).map((k) => ({
        status: k,
        count: s.applications.filter((a) => a.status === k).length,
      }));
      return {
        products: s.products.length,
        facilities: s.facilities.length,
        applications: s.applications.length,
        openApplications: s.applications.filter((a) => !["completed", "rejected", "draft"].includes(a.status)).length,
        certificates: s.certificates.filter((c) => c.status === "active").length,
        actionsRequired: s.applications.reduce((n, a) => n + a.actions.filter((x) => !x.done).length, 0),
        distribution: dist,
        recentApplications: [...s.applications].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 5),
        activities: s.activities.slice(0, 6),
        notifications: s.notifications.slice(0, 4),
        unread: s.notifications.filter((n) => !n.read).length,
      };
    },
  },

  facilities: {
    list: () => lag<Facility[]>(getState().facilities),
    async create(input: FacilityInput): Promise<Facility> {
      await sleep(450);
      const f: Facility = {
        id: uid("fac"),
        name: bi(input.name, input.name),
        commercialReg: input.commercialReg,
        taxId: input.taxId,
        activity: bi(input.activity, input.activity),
        city: bi(input.city, input.city),
        contact: input.contact,
        status: "pending",
        products: 0,
      };
      setState((s) => ({ ...s, facilities: [f, ...s.facilities] }));
      pushActivity({ title: bi(`تمت إضافة المنشأة «${input.name}»`, `Facility “${input.name}” added`), kind: "account" });
      return f;
    },
  },

  products: {
    list: () => lag<Product[]>(getState().products),
    async get(id: string): Promise<Product> {
      await sleep(LATENCY);
      const p = getState().products.find((x) => x.id === id);
      if (!p) throw new ApiError("not_found", "Product not found");
      return p;
    },
    getDraft: () => lag(getState().productDraft, 60),
    async saveDraft(draft: unknown): Promise<void> {
      await sleep(250);
      setState((s) => ({ ...s, productDraft: draft }));
    },
    async clearDraft(): Promise<void> {
      setState((s) => ({ ...s, productDraft: null }));
    },
    async create(input: ProductInput, attachments: DocumentFile[]): Promise<Product> {
      await sleep(900);
      const n = getState().products.length + 1;
      const p: Product = {
        id: uid("prd"),
        ref: `DEMO-PRD-${pad(n)}`,
        nameAr: input.nameAr,
        nameEn: input.nameEn,
        category: input.category,
        brand: input.brand,
        model: input.model,
        origin: input.origin,
        manufacturer: input.manufacturer,
        hsCode: input.hsCode || undefined,
        description: input.description,
        status: "pending_review",
        createdAt: now(),
        attachments,
      };
      setState((s) => ({ ...s, products: [p, ...s.products], productDraft: null }));
      pushActivity({ title: bi(`تم تسجيل المنتج «${p.nameAr}» (تجريبي)`, `Product “${p.nameEn}” registered (demo)`), kind: "product" });
      return p;
    },
  },

  applications: {
    list: () => lag<Application[]>(getState().applications),
    async get(id: string): Promise<Application> {
      await sleep(LATENCY);
      const a = getState().applications.find((x) => x.id === id);
      if (!a) throw new ApiError("not_found", "Application not found");
      return a;
    },
    /** Public lookup by reference (works for the demo dataset only). */
    async track(ref: string): Promise<Application | null> {
      await sleep(500);
      const q = ref.trim().toUpperCase();
      return getState().applications.find((a) => a.ref.toUpperCase() === q) ?? null;
    },
    async create(input: ApplicationInput, documents: DocumentFile[], asDraft = false): Promise<Application> {
      await sleep(800);
      const s = getState();
      const product = s.products.find((p) => p.id === input.productId);
      if (!product) throw new ApiError("invalid", "Unknown product");
      const n = s.applications.length + 1;
      const ref = `DEMO-APP-2026-${pad(n)}`;
      const flow: ApplicationStatus[] = asDraft ? ["draft"] : ["submitted"];
      const timeline = buildTimeline(ref, flow, now());
      const app: Application = {
        id: uid("app"),
        ref,
        productId: product.id,
        productName: bi(product.nameAr, product.nameEn),
        type: input.type,
        bodyId: input.bodyId,
        status: flow[0],
        submittedAt: asDraft ? undefined : now(),
        updatedAt: now(),
        notes: input.notes,
        documents,
        actions: [],
        timeline,
      };
      setState((st) => ({ ...st, applications: [app, ...st.applications] }));
      pushActivity({ title: bi(`تم ${asDraft ? "حفظ مسودة" : "تقديم"} الطلب ${ref}`, `Request ${ref} ${asDraft ? "saved as draft" : "submitted"}`), kind: "application" });
      return app;
    },
    /** DEMO ONLY: moves a request along the happy path so the workflow can be explored. */
    async advance(id: string): Promise<Application> {
      await sleep(500);
      const s = getState();
      const app = s.applications.find((a) => a.id === id);
      if (!app) throw new ApiError("not_found", "Application not found");
      const idx = APPLICATION_FLOW.indexOf(app.status);
      const next: ApplicationStatus | undefined = app.status === "draft" ? "submitted" : app.status === "info_required" ? "under_review" : APPLICATION_FLOW[idx + 1];
      if (!next) return app;
      const meta = {
        submitted: bi("تم تقديم الطلب", "Request submitted"),
        under_review: bi("بدأت مراجعة المستندات", "Document review started"),
        under_assessment: bi("انتقل الطلب إلى التقييم", "Moved to assessment"),
        completed: bi("اكتملت الإجراءات (محاكاة)", "Procedure completed (simulated)"),
      } as Record<string, ReturnType<typeof bi>>;
      const updated: Application = {
        ...app,
        status: next,
        submittedAt: app.submittedAt ?? now(),
        updatedAt: now(),
        timeline: [...app.timeline, { id: uid("t"), at: now(), status: next, title: meta[next] ?? APPLICATION_STATUS[next].label, actor: bi("محاكاة العرض", "Demo simulation") }],
      };
      setState((st) => ({ ...st, applications: st.applications.map((a) => (a.id === id ? updated : a)) }));
      pushActivity({ title: bi(`تحديث الطلب ${app.ref}: ${APPLICATION_STATUS[next].label.ar}`, `Request ${app.ref}: ${APPLICATION_STATUS[next].label.en}`), kind: "application" });
      if (next === "completed") {
        pushNotification({ title: bi("اكتمل الطلب (محاكاة)", "Request completed (simulated)"), body: bi(`الطلب ${app.ref} اكتمل في هذا المسار التجريبي.`, `Request ${app.ref} completed in this demo workflow.`), kind: "success", href: `/dashboard/applications/${app.id}` });
      }
      return updated;
    },
    async completeAction(appId: string, actionId: string, file?: DocumentFile): Promise<Application> {
      await sleep(450);
      const app = getState().applications.find((a) => a.id === appId);
      if (!app) throw new ApiError("not_found", "Application not found");
      const actions = app.actions.map((x) => (x.id === actionId ? { ...x, done: true } : x));
      const allDone = actions.every((x) => x.done);
      const updated: Application = {
        ...app,
        actions,
        documents: file ? [...app.documents, file] : app.documents,
        updatedAt: now(),
        status: allDone && app.status === "info_required" ? "under_review" : app.status,
        timeline: allDone && app.status === "info_required"
          ? [...app.timeline, { id: uid("t"), at: now(), status: "under_review", title: bi("تم استكمال البيانات المطلوبة", "Requested information provided"), actor: bi("مقدّم الطلب", "Applicant") }]
          : app.timeline,
      };
      setState((st) => ({ ...st, applications: st.applications.map((a) => (a.id === appId ? updated : a)) }));
      return updated;
    },
  },

  certificates: {
    list: () => lag<Certificate[]>(getState().certificates),
    async get(id: string): Promise<Certificate> {
      await sleep(LATENCY);
      const c = getState().certificates.find((x) => x.id === id);
      if (!c) throw new ApiError("not_found", "Certificate not found");
      return c;
    },
  },

  shipments: {
    list: () => lag<Shipment[]>(getState().shipments),
    async create(input: ShipmentInput, asDraft: boolean): Promise<Shipment> {
      await sleep(600);
      const n = getState().shipments.length + 101;
      const sh: Shipment = {
        id: uid("sh"),
        ref: `DEMO-SHP-0${n}`,
        description: bi(input.description, input.description),
        origin: input.origin,
        port: bi(input.port, input.port),
        items: input.items,
        status: asDraft ? "draft" : "submitted",
        createdAt: now(),
        documents: 0,
      };
      setState((s) => ({ ...s, shipments: [sh, ...s.shipments] }));
      pushActivity({ title: bi(`تم إنشاء ملف الشحنة ${sh.ref}`, `Shipment file ${sh.ref} created`), kind: "document" });
      return sh;
    },
  },

  notifications: {
    list: () => lag<NotificationItem[]>(getState().notifications, 120),
    async markRead(id?: string): Promise<void> {
      setState((s) => ({ ...s, notifications: s.notifications.map((n) => (!id || n.id === id ? { ...n, read: true } : n)) }));
    },
  },

  /** Public catalogue search — runs over configurable reference content. */
  search: {
    async all(q: string) {
      await sleep(180);
      const t = q.trim().toLowerCase();
      const has = (...xs: string[]) => !t || xs.some((x) => x.toLowerCase().includes(t));
      const s = getState();
      return {
        products: s.products.filter((p) => has(p.nameAr, p.nameEn, p.brand, p.model, p.ref, p.hsCode ?? "")),
        categories: CATEGORIES.filter((c) => has(c.title.ar, c.title.en)),
        regulations: REGULATIONS.filter((r) => r.kind === "regulation" && has(r.title.ar, r.title.en, r.code)),
        standards: REGULATIONS.filter((r) => r.kind === "standard" && has(r.title.ar, r.title.en, r.code)),
        hs: HS_CODES.filter((h) => has(h.code, h.title.ar, h.title.en)),
        bodies: ASSESSMENT_BODIES.filter((b) => has(b.name.ar, b.name.en, b.city.ar, b.city.en, ...b.scopes.flatMap((x) => [x.ar, x.en]))),
        applications: s.applications.filter((a) => has(a.ref, a.productName.ar, a.productName.en)),
      };
    },
  },

  contact: {
    async send(): Promise<{ ref: string }> {
      await sleep(700);
      return { ref: `DEMO-MSG-${Math.floor(1000 + Math.random() * 9000)}` };
    },
  },
};
