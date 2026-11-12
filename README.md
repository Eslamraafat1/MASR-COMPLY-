# MASR COMPLY

[![CI](https://github.com/Eslamraafat1/masr-comply-/actions/workflows/ci.yml/badge.svg)](https://github.com/Eslamraafat1/masr-comply-/actions/workflows/ci.yml)
![License](https://img.shields.io/badge/license-MIT-blue)

A bilingual (EN/AR) product-compliance portal prototype: register facilities and products, submit and track compliance applications, view certificates and shipments, and browse regulations, HS codes, sectors and assessment bodies.

> **Prototype.** Every action runs against a browser-local mock. Nothing here is a real submission, approval, payment or government integration, and the regulatory content is not verified.

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS 4 · Zod 4 · Framer Motion · Vitest

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` + `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run build` | Production build |

## Structure

- `src/app/(public)` – marketing and reference pages (services, regulations, HS codes, FAQ, tracking…)
- `src/app/dashboard` – authenticated area (applications, products, facilities, certificates, shipments…)
- `src/lib/services/api.ts` – the single data-access layer (mock today; swap for `fetch` to go live)
- `docs/BACKEND_HANDOFF.md` – endpoint contract and the checklist for connecting a real backend

## License

MIT © Eslam Raafat
