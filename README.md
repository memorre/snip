# Snip — Short Links with Real Analytics

A short-link platform that shows you what's actually happening: daily trend charts, referrer sources, device and
browser breakdowns, geography, and a live click ticker that updates the dashboard the moment someone clicks.

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router, Turbopack) | Server Components + Server Actions for the CRUD paths, Route Handlers for redirects and streaming. |
| Language | TypeScript | End-to-end types from schema to UI. |
| Styling | Tailwind CSS v4 + hand-rolled Radix UI primitives | Apple-style tokens shared with [yetao.org](https://yetao.org): system font stack, #f5f5f7 grouped backgrounds, frosted nav and menus, pill buttons, light/dark. |
| i18n | Typed dictionaries + a small translator (no framework) | Simplified Chinese, English, French and Spanish; locale from a `lang` cookie shared across yetao.org, then `Accept-Language`. |
| Animation | Motion (Framer Motion) | Page transitions, list reveals, animated chart containers. |
| Charts | Recharts | Daily trend area chart, device donut chart. |
| Data | Prisma ORM 7 + Postgres (Prisma Postgres via Vercel Marketplace) | Same database for local dev and production. |
| Auth | Auth.js (NextAuth v5), credentials + JWT sessions | Single demo account; ownership-based access control (no roles needed — every user only ever sees their own links). |
| Real-time | Server-Sent Events + in-memory pub/sub, with SWR polling as a fallback | Click events push to the dashboard instantly within a single instance; documented upgrade path for horizontal scale below. |
| Geo | Vercel's edge geolocation headers | No third-party GeoIP service or API key — `x-vercel-ip-country`/`x-vercel-ip-city` are free on Vercel. |

## Getting started

```bash
npm install
cp .env.example .env        # then set DATABASE_URL and AUTH_SECRET — see below
npm run db:migrate           # applies schema to your Postgres database
npm run db:seed              # seeds a demo account, 5 links, and ~430 realistic historical clicks
npm run dev
```

`DATABASE_URL` needs a real Postgres connection string. Easiest path: `vercel link`, then
`vercel integration add prisma/prisma-postgres`, then `vercel env pull .env.local` (or copy `DATABASE_URL` into
`.env`) — see [Deployment](#deployment). Generate a real `AUTH_SECRET`:

```bash
openssl rand -base64 32
```

Open http://localhost:3000. The login page has a one-click demo account: `demo@snip.app` / `password123`.

Other scripts: `npm run db:studio`, `npm run db:reset`, `npm run lint`, `npm run build`.

## Architecture and data model

```
User ──< Link ──< Click
          │          │
          │          └─ referrer, browser, os, deviceType, country, city
          └─ slug (unique), targetUrl, disabled, expiresAt
```

- **`/[slug]`** ([`src/app/[slug]/page.tsx`](src/app/[slug]/page.tsx)) is the redirect handler: a Server
  Component that looks up the link, records a `Click` (parsing the user agent and reading Vercel's geo headers),
  publishes a live-update event, then calls `redirect()`. Disabled or expired links, and unknown slugs, render a
  branded 404 instead of redirecting.
- **Click metadata** is parsed with `ua-parser-js` ([`src/lib/click-meta.ts`](src/lib/click-meta.ts)) — browser,
  OS, and device type — plus `x-vercel-ip-country` / `x-vercel-ip-city` for geography. Locally (no Vercel edge),
  geo comes back `null` and renders as "Unknown"; this is expected and resolves once deployed.
- **Analytics** ([`src/lib/data.ts`](src/lib/data.ts)) buckets clicks into a daily series in JS rather than a SQL
  date-trunc, which is simpler and entirely fast enough at this data volume (hundreds to low thousands of clicks
  per link). If a link's click volume grew far beyond that, this is the first place to move to a raw aggregate
  query.

### Real-time updates

Every click (`/[slug]/page.tsx`) calls `publishClick()` in [`src/lib/live.ts`](src/lib/live.ts), which emits on
an in-memory `EventEmitter`. The `/api/live` route streams those events over Server-Sent Events; the
`useLiveClicks` hook ([`src/hooks/use-live-clicks.ts`](src/hooks/use-live-clicks.ts)) revalidates the relevant
SWR cache key and shows a toast on the analytics page. A 15-second SWR poll sits underneath as a safety net.

This works well for a single Node.js instance (this pilot, or a single warm Vercel serverless function) but an
in-memory `EventEmitter` doesn't fan out across multiple serverless instances. For horizontal scale, swap the
backing store in `src/lib/live.ts` for a hosted pub/sub (Pusher, Ably, Supabase Realtime) — only that file's
publish/subscribe implementation changes.

### Languages

The globe menu in the header switches between 简体中文, English, Français and Español. The choice is stored in a
`lang` cookie (`Domain=yetao.org` in production, so the homepage and the other apps share it) and the page
re-renders on the server without a reload. Without a cookie, the locale comes from `Accept-Language`, falling back
to English.

- Dictionaries live in [`src/i18n/dictionaries/`](src/i18n/dictionaries/). `en.ts` is the source of truth; the
  other locales are typed against it, so a missing or extra key fails the build.
- Server Components, Server Actions and Route Handlers use `getT()` from `src/i18n/server.ts`; Client Components use
  `useI18n()` / `useT()` from `src/i18n/client.tsx`. Messages support `{name}` placeholders and plural forms
  (`{ one, other, many }`, picked with `Intl.PluralRules`).
- Dates, relative times, numbers and country names use `Intl` in the active locale.

### Access control

Every dashboard page and mutation checks `requireUser()` ([`src/lib/session.ts`](src/lib/session.ts)) and scopes
queries to `ownerId` — there's no cross-user read path, so ownership is the only access-control primitive this
app needs.

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `DATABASE_URL` | Yes | Postgres connection string. Same value works locally and in every Vercel environment. |
| `AUTH_SECRET` | Yes | Signs session JWTs. Generate with `openssl rand -base64 32`. |

## Deployment

Deployed on **Vercel**, database on **Prisma Postgres** (via the Vercel Marketplace). This is what was actually
run to stand this up:

```bash
npm install -g vercel
vercel login                                   # device-flow login
vercel link --yes
vercel integration add prisma/prisma-postgres  # provisions Postgres, wires DATABASE_URL automatically
vercel env pull .env.local                     # or copy DATABASE_URL into .env for local dev

npm run db:migrate
npm run db:seed
vercel env add AUTH_SECRET production   # paste the output of: openssl rand -base64 32
vercel --prod
```

`vercel integration add` pauses once with a `verification_uri` the first time it's used on an account — open it
in a browser and accept the marketplace terms, then re-run the same command to finish provisioning.

To add a custom domain: Project → Settings → Domains in the Vercel dashboard, then follow the DNS instructions
it gives you (a CNAME at your DNS provider — Vercel's Domain Connect flow can apply it automatically if your DNS
is on Cloudflare).

## Known limitations and future backlog

- **Geo is country/city only** (whatever Vercel's edge network reports) — no ISP, region-level precision, or
  offline geo database. Good enough for a dashboard, not for anything compliance-sensitive.
- **Daily bucketing is done in application code**, not SQL — see the note under Architecture above.
- **No rate limiting on link creation or redirects** — fine for a portfolio demo; a public-facing product would
  want per-user creation limits and abuse detection on the redirect path.
- **No custom domains per link** (branded short domains) — every link is `<your-domain>/<slug>`.
- **No automated test suite** — manually verified end-to-end (auth, link CRUD, redirect + click logging, live
  ticker across two sessions, charts, QR download, light/dark, mobile). Vitest for `src/lib/*` and Playwright for
  the create → click → see-it-live flow would be the natural next addition.

## Project structure

```
prisma/                     schema, migrations, seed script
src/
  app/
    page.tsx                 landing page
    login/                    credentials login + demo account
    dashboard/                link list, create dialog
      [slug]/                 per-link analytics (charts, QR, live ticker)
    [slug]/                   public redirect handler
    api/                      links, per-link stats, SSE live stream, auth
  components/                design system (ui/) + app icon, language menu, qr-code, site-header
  i18n/                       locale config, dictionaries (zh-CN, en, fr, es), server/client helpers
  hooks/                      use-live-clicks (SSE + SWR bridge)
  lib/                        prisma client, data access, click metadata parsing, slug generation
  auth.ts                     Auth.js configuration
```
