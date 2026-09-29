<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# EggFarm Agent Instructions

This repository is a bilingual ecommerce storefront and admin dashboard for hatching eggs, built with Next.js 16, Prisma, and next-intl.

## Project overview

- App uses the App Router under `src/app` with locale-prefixed routes (`/en`, `/ar`).
- Storefront flows include home, product listing, product pages, cart, checkout, order tracking, and admin.
- Admin routes are protected by signed cookie auth via `src/lib/admin-auth.ts` and must call `requireAdmin()` before access.
- Product and order data are persisted in SQLite via Prisma, with a generated client under `src/generated/prisma`.
- The app is bilingual: user-facing content is stored in both English and Arabic, and layouts support RTL.

## Architecture and conventions

- Prefer the existing app structure:
  - `src/app/[locale]/` for route pages
  - `src/components/` for reusable UI
  - `src/lib/` for server actions, auth, validation, data access, config, stores
  - `src/i18n/` for locale routing and navigation
  - `src/messages/` for translation JSON files
  - `prisma/` for schema, migrations, and seed
- Use Server Components by default. Only add client-side state when the interaction truly requires browser behavior.
- For any mutation, prefer a Server Action and Prisma transaction when stock, pricing, or order state changes are involved.
- Keep business logic in `src/lib/` rather than embedding it inside page components.
- Respect locale-aware routing; do not hardcode links like `/admin` or `/checkout` without using the locale-aware navigation helpers.
- Treat the app as production-aware: admin auth, stock safety, price recomputation, and order integrity matter.

## Database and data rules

- Prisma is the canonical source of truth for the schema.
- Product, bird, and order models are bilingual; if a user-visible label changes, update both language variants and any relevant translations.
- Orders snapshot key product values (`nameEn`, `nameAr`, `unitPriceCents`) so historical data remains correct.
- Do not bypass Prisma for data writes; if schema changes are required, update `prisma/schema.prisma` and migrate.

## i18n and product content rules

- All user-facing strings should work in both English and Arabic.
- When adding or changing product fields, ensure they are supported in both locales and in any corresponding form logic.
- Keep RTL layout expectations in mind; do not assume left-to-right text flow.
- Use `next-intl` helpers and localized number/currency formatting instead of ad-hoc string formatting.

## Admin rules

- Admin pages are protected; do not expose or bypass the admin guard.
- Keep admin functions aligned with the existing dashboard structure under `src/app/[locale]/admin`.
- Use `requireAdmin()` and the existing auth helpers instead of creating a second authentication pattern.
- Do not add admin-only flows that ignore the session cookie or locale routing.

## Validation before completion

- Run the relevant project checks after changing app logic or schema:
  - `npm run lint`
  - `npm run typecheck`
- If Prisma schema changes, also run the appropriate migration flow (`npm run db:migrate` or equivalent project migration command).
- Prefer small, focused edits that match the established patterns in the repo.

## Avoid

- Hardcoding product or cart logic into page files instead of shared lib modules
- Removing bilingual fields or translation entries without updating both languages
- Taking admin access shortcuts or bypassing locale-aware navigation
- Creating inconsistent patterns that differ from the existing app architecture

## Notes for this project

This app is a real commerce workflow, not a toy demo. Stock, checkout totals, admin access, and order tracking all depend on correct server-side logic and transaction safety.
