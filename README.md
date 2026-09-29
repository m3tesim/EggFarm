# Golden Nest — Hatching Eggs Farm 🥚

A full-stack, bilingual (English / العربية) online store for a farm that sells fertile
**hatching eggs** from domestic birds: chickens, ducks, quails, turkeys, geese, guinea fowl,
pigeons and peafowl.

## Features

- **Shop** with search (matches English *and* Arabic breed names/descriptions), filtering by
  bird type (multi-select) and price range, in-stock toggle, sorting and pagination. All
  filter state lives in the URL, so results are shareable.
- **Real bird photos** loaded from Wikimedia Commons, each credited with a link to its
  Commons page (author & licence). If a photo is missing or fails to load, an SVG egg in the
  breed's shell colour is shown instead. Admins can set any https photo URL per product.
- **Product pages** with fertility rate, incubation period, shell colour, min. order and stock.
- **Cart** (persisted in the browser, re-synced with live prices/stock from the server).
- **Checkout** (cash on delivery) via a Server Action: Zod validation, prices recomputed on
  the server, and stock decremented atomically in a transaction so eggs can't be oversold.
- **Order tracking** by order reference + phone number.
- **Admin dashboard** (`/en/admin`): revenue/pending/low-stock stats, order search & status
  updates (cancelling restocks eggs), and product create/edit/delete with bilingual fields.
- **English & Arabic** with full RTL layout, localized numbers, currency, dates and plurals;
  the language switch keeps the current page and filters.

## Tech stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Turbopack) |
| UI | React 19, Tailwind CSS v4, lucide-react icons |
| i18n | next-intl 4 (locale-prefixed routes `/en`, `/ar`, RTL) |
| Database | Prisma ORM 7 + SQLite (better-sqlite3 driver adapter) |
| Validation | Zod 4 |
| Client state | Zustand (persisted cart) |
| Language | TypeScript (strict) |

## Getting started

Requires Node.js 20.9+.

```bash
npm install
cp .env.example .env      # then change ADMIN_PASSWORD and AUTH_SECRET
npm run setup             # create the database, generate the client, seed sample data
npm run dev               # http://localhost:3000
```

Admin: open `/en/admin` and sign in with `ADMIN_PASSWORD`.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file, e.g. `file:./prisma/dev.db` |
| `ADMIN_PASSWORD` | Password for the admin dashboard |
| `AUTH_SECRET` | Secret (16+ chars) used to sign the admin session cookie |

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop / build / serve |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run db:migrate` | Create & apply a migration after editing `prisma/schema.prisma` |
| `npm run db:seed` | (Re)seed birds and products (idempotent upserts) |
| `npm run db:studio` | Browse the database in Prisma Studio |

## Project structure

```
prisma/               schema, migrations and seed data
src/app/[locale]/     pages: home, eggs, eggs/[slug], cart, checkout, orders/[code], track, admin
src/components/       UI components (EggArt SVG illustration, filters, cart, forms…)
src/lib/              db client, queries, server actions, cart store, config, formatting
src/i18n/             next-intl routing, navigation and request config
src/messages/         en.json / ar.json translations
src/proxy.ts          locale detection & redirects (Next 16 "proxy", formerly middleware)
```

Store settings (currency, shipping fee, free-shipping threshold, contact info) live in
`src/lib/config.ts`.

## Photos

Breed photos are hot-linked from [Wikimedia Commons](https://commons.wikimedia.org) via
`Special:FilePath/<file>?width=800`, which serves a resized copy. The file names live in
`prisma/seed.ts`. They are freely licensed (mostly CC BY / CC BY-SA), which requires
attribution: the product page links each photo to its Commons page, which shows the author
and licence. The Texas A&M quail has no suitable free photo yet, so it shows the egg
illustration.

## Going to production

- SQLite is great for a single server. To use PostgreSQL, change `provider` in
  `prisma/schema.prisma`, swap the adapter in `src/lib/db.ts` for `@prisma/adapter-pg`, and
  re-create migrations.
- Set strong `ADMIN_PASSWORD` / `AUTH_SECRET` values; run `npm run db:deploy` on deploy.
