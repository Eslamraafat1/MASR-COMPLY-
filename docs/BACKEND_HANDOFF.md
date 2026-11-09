# MASR COMPLY — Backend Handoff

Frontend: Next.js 16 (App Router), React 19, TypeScript strict. This is a **prototype**: every action currently runs against a browser-local mock. Nothing here is a real submission, approval, payment or government integration, and none of the regulatory content is verified.

## 1. How to connect

All UI code calls **one file**: `src/lib/services/api.ts` (methods are `async`, return plain data). To go live, re-implement each method with `fetch` — **signatures can stay the same**, so no component changes are needed.

- Mock storage to delete afterwards: `src/lib/services/store.ts` and the `useDemoState` subscription in `src/lib/hooks/use-demo.ts` (replace `useQuery` with TanStack Query or keep it and trigger `refetch` after mutations).
- Suggested config: `NEXT_PUBLIC_API_URL` (none exists yet).
- Reference/catalogue content currently lives in `src/lib/data/*` (services, sectors, regulations, HS codes, bodies, FAQ, announcements). Move to the API/CMS so it can be configured and **officially verified**.

## 2. Authentication (replace first)

Today: any well-formed email + 8-char password "logs in"; the password is never checked or stored; the session is a profile object in `localStorage`; the dashboard guard is client-side only (`components/dashboard/Shell.tsx`).

Needed:
- Real registration, login, logout, email verification, forgot/reset password.
- Secure session (HttpOnly, Secure, SameSite cookie or short-lived JWT + refresh). Rate limiting + lockout. CSRF protection if cookie-based.
- **Server-side authorization on every endpoint** (the client guard is cosmetic). Per-account-type permissions; users see only their own facilities/products/requests.
- Server-side route protection for `/dashboard/*` (middleware) once sessions exist.
- Password rules mirrored from the form: ≥8 chars, at least one letter and one digit.
- Open redirect protection already applied on the client for `?next=` (must start with `/`, not `//`).

## 3. Endpoints the UI expects (mirrors `api.ts`)

| Area | Method (current) | Suggested REST |
|---|---|---|
| auth | `login({email,password})`, `register(RegisterInput)`, `verifyEmail()`, `me()`, `updateProfile()`, `logout()` | `POST /auth/login`, `POST /auth/register`, `POST /auth/verify-email`, `GET /auth/me`, `PATCH /auth/me`, `POST /auth/logout`, `POST /auth/forgot-password`, `POST /auth/reset-password` |
| dashboard | `summary()` | `GET /dashboard/summary` (counts, status distribution, recent applications/activities/notifications, unread) |
| facilities | `list()`, `create(FacilityInput)` | `GET/POST /facilities` |
| products | `list()`, `get(id)`, `create(ProductInput, attachments)`, `getDraft/saveDraft/clearDraft` | `GET/POST /products`, `GET /products/{id}`, `GET/PUT/DELETE /products/draft` |
| applications | `list()`, `get(id)`, `create(input, docs, asDraft)`, `advance(id)`, `completeAction(appId, actionId, file?)`, `track(ref)` | `GET/POST /applications`, `GET /applications/{id}`, `POST /applications/{id}/actions/{actionId}/complete`, **public** `GET /applications/track?ref=` |
| certificates | `list()`, `get(id)` | `GET /certificates`, `GET /certificates/{id}` |
| shipments | `list()`, `create(input, asDraft)` | `GET/POST /shipments` |
| notifications | `list()`, `markRead(id?)` | `GET /notifications`, `POST /notifications/read` |
| search | `all(q)` | `GET /search?q=` (products, categories, regulations, standards, HS, bodies, applications) |
| contact | `send()` | `POST /contact` (currently sends nothing) |

Notes:
- `applications.advance()` is a **DEMO-only** status simulator. In production, status changes must come from reviewers/assessment bodies via their own role-protected endpoints; remove the button in `dashboard/applications/[id]/page.tsx`.
- `applications.track(ref)` is public: return only non-sensitive fields (reference, product name, status, timeline). Consider rate limiting and non-enumerable references.
- `facilities.products` count, `dashboard.summary` aggregates should be computed server-side.
- Reference numbers are currently generated client-side (`DEMO-PRD-0001`, `DEMO-APP-2026-0001`). Generate server-side; the `DEMO-` prefixes must go in production.

## 4. Data model (see `src/lib/types.ts`)

Enums:
- AccountType: `importer | manufacturer | individual | government | assessment_body | inspection_body`
- ApplicationStatus: `draft | submitted | under_review | info_required | under_assessment | completed | rejected`
- ProductStatus: `draft | pending_review | registered | info_required`
- CertificateStatus: `active | expired | pending | revoked`
- ShipmentStatus: `draft | submitted | under_review | info_required | cleared`
- Application type: `conformity | assessment | renewal`

Entities: `DemoUser` (→ User), `Facility`, `Product`, `DocumentFile`, `Application` (with `timeline[]`, `actions[]`, `documents[]`), `Certificate`, `Shipment`, `NotificationItem`, `ActivityItem`.

**Bilingual fields:** many display fields are `{ ar, en }` (type `Bi`). Either store both languages or return the active language via `Accept-Language`/`?lang=`; the UI reads the `Bi` shape today, so keep it or adapt `api.ts` to map.

Status labels/colours are UI concerns in `src/lib/data/status.ts` — the API should return the enum value only.

## 5. Validation (mirror server-side)

Zod schemas: `src/lib/schemas/index.ts` (also covered by `schemas.test.ts`). Server must re-validate everything:
- Registration: required fields depend on account type. Individual → full name only. Importer/manufacturer → establishment, address, commercial registration (4–20 alnum/-/), tax id (6–15 alnum/-), activity, contact person. Gov/assessment/inspection → establishment, address, contact person; commercial/tax optional. Mobile: Egyptian format `^(\+?20|0)?1[0125]\d{8}$`. Terms must be accepted.
- Product: names ≤120, brand/model ≤80, description 20–1000 chars, HS code optional `4|6|8 digits` (dots allowed).
- Application: product, type, body required; notes ≤500.
- Shipment: description ≤160, items integer 1–500.
- Do not collect more personal data than listed.

## 6. File uploads

Currently only metadata (name, size, type) is kept; **no file is uploaded**. Needed: multipart/pre-signed upload, allowed types `pdf, jpeg, png, webp`, max 5 MB, max 8 files per form (constants in `schemas`), server-side MIME sniffing + malware scanning, private storage, signed download URLs, retention policy. `DocumentFile` should carry a storage id/URL.

## 7. Content that must be verified before launch

Regulations (`DEMO-REG-*` are placeholders), standards, HS codes (4-digit headings, guidance only), assessment bodies (fictional), fees/requirements/FAQ answers, announcements, certificate wording, legal pages (privacy/terms need legal review), statistics (homepage figures are demo counts — wire to real data or hide). Remove all "DEMO", "proposed" and "prototype — not affiliated" notices **only** when the owning authority approves; the unofficial-platform disclaimers in the header trust bar, footer, About and Terms must be revisited deliberately.

## 8. Other production gaps

- Locale is a cookie (`masr-locale`), no URL prefix; pages are server-rendered on demand. Consider `/ar` `/en` routes for SEO and caching.
- `robots: noindex` is set in `app/layout.tsx` — remove at launch.
- Email/SMS delivery (verification, reset, notifications) not implemented.
- Audit log, admin/reviewer/assessment-body back-office, payments (none implemented, none to be added without explicit approval), analytics, error monitoring.
- Security headers/CSP, CORS, cookie flags, secrets management; no secrets exist in the repo.
- Accessibility: keyboard + ARIA implemented and checked by automated tests only; run a manual screen-reader audit and Lighthouse before launch.

## 9. Running & testing

```
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
npm run typecheck && npm run lint && npm test
```
Last verified locally: typecheck 0 errors, lint 0 errors (2 React Compiler warnings from react-hook-form), unit tests 8/8, production build OK, scripted browser flow 33/33.

## 10. Suggested order of work

1. Auth + sessions + authorization. 2. Facilities/products CRUD + file storage. 3. Applications + timeline + role-based status changes. 4. Certificates, shipments, notifications. 5. Catalogue content API/CMS with verification workflow. 6. Email, audit log, security hardening, then switch off the demo notices.
