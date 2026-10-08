# Vercel Deployment Guide — Wigs by Magss Booking App

This guide covers deploying this project as it actually exists today: a Next.js 15 App Router app with Turbopack, Prisma + PostgreSQL, and custom JWT-based auth (no NextAuth, no Stripe, no Sentry, no Redis — none of those are part of this stack).

## 1. What this app actually needs in production

| Concern | How it's handled |
|---|---|
| Database | PostgreSQL via Prisma, single `DATABASE_URL` connection string |
| Auth | Custom JWT signed with `JWT_SECRET`, stored in an HttpOnly `session` cookie (see `lib/auth.ts`) |
| Route protection | `middleware.ts` checks the `session` cookie on `/admin/:path*` and `/user/:path*`, verifies the JWT, and checks the `role` claim |
| Payments | None — not part of the app |
| Email | None — not part of the app |
| File/image uploads | None beyond static assets in `public/` |

There is no `lib/env.ts`, `lib/rate-limit.ts`, `prisma/seed.ts`, or similar helper files — don't add them unless you're building that functionality. Keep the deploy as close to "it just works" as the app already is.

## 2. Environment variables

Exactly three environment variables are required, matching the local `.env`:

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `postgresql://user:password@host:5432/dbname?sslmode=require` | Points at your production Postgres instance. Must allow SSL for most hosted providers (Neon, Supabase, Vercel Postgres, Railway, etc.) |
| `JWT_SECRET` | a long random string | Used to sign/verify session JWTs. **Generate a new one for production** — don't reuse your local dev secret. Run `openssl rand -base64 48` to generate one. |
| `JWT_EXPIRES_IN` | `7d` | Optional — `lib/auth.ts` defaults to `7d` if unset. Only set this if you want a different session lifetime. |

There is no `DIRECT_URL` / connection-pooling variable in `prisma/schema.prisma` — the datasource block only reads `DATABASE_URL`, so you don't need a separate pooled/direct connection pair unless you choose a provider that requires one (in which case point `DATABASE_URL` at the pooled connection string it gives you).

### Setting env vars on Vercel

1. In the Vercel dashboard: **Project → Settings → Environment Variables**.
2. Add `DATABASE_URL`, `JWT_SECRET`, and (optionally) `JWT_EXPIRES_IN`.
3. Apply them to **Production** (and **Preview** if you want preview deployments to hit a real/staging database — otherwise preview builds will fail at runtime when they try to query a database that doesn't exist).

Or via the CLI:

```bash
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
```

## 3. Choosing a production Postgres provider

Pick one you set up yourself (I won't create accounts on your behalf):

- **[Neon](https://neon.tech)** — serverless Postgres, generous free tier, integrates with Vercel via the Neon integration in the Vercel Marketplace (auto-fills `DATABASE_URL` for you).
- **Vercel Postgres** (via Neon under the hood) — set up directly from the Vercel dashboard under **Storage**.
- **Supabase** — also fine, just use the Postgres connection string (not the Supabase client libraries, since this app talks to Postgres directly via Prisma).

Whichever you choose, grab the connection string and make sure it includes `sslmode=require` (most hosted providers require this).

## 4. Running migrations against production

Prisma migrations need to be applied to the production database before (or as part of) your first deploy. From your local machine, with `DATABASE_URL` temporarily pointed at production:

```bash
DATABASE_URL="<your production connection string>" npx prisma migrate deploy
```

This applies the existing migrations in `prisma/migrations/` — it does **not** generate new ones, so run this after your schema is already finalized and migrated locally with `prisma migrate dev`.

If you want to seed initial data (e.g. your real service list), do it manually via a one-off script or `psql`/a DB GUI — there's no `prisma/seed.ts` in this project currently.

## 5. The one real gap: generating the Prisma client on Vercel

Vercel runs `npm install` then your `build` script on a fresh environment each deploy — `node_modules/.prisma/client` won't exist unless `prisma generate` runs first. This project's `package.json` now includes:

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

This was missing before and would have caused the Vercel build to fail with a "Prisma Client not generated" error. With `postinstall` in place, `npm install` automatically triggers `prisma generate`, so no extra Vercel build-command configuration is needed.

## 6. Deploying

### Via the Vercel dashboard (recommended for a first deploy)

1. Push your latest commits to GitHub (`origin/main` on `WigsbymagssBookingWebsite`).
2. In the Vercel dashboard: **Add New → Project**, import the GitHub repo.
3. Framework preset: Vercel auto-detects Next.js — leave build/output settings as default (`npm run build`, Next.js handles the rest).
4. Add the environment variables from step 2 above.
5. Deploy.

### Via the CLI

```bash
npm i -g vercel   # if not already installed
vercel login
vercel link
vercel env add DATABASE_URL production
vercel env add JWT_SECRET production
vercel --prod
```

No `vercel.json` is required — there are no custom regions, redirects, or function configs needed for this app. Don't add one unless you have a specific reason to (e.g. a custom redirect).

## 7. Pre-deploy checklist

Run these locally before pushing, so Vercel's build doesn't surprise you:

```bash
npx tsc --noEmit        # type-check
npm run lint             # eslint
npm run build            # full production build, same as Vercel will run
```

If you want to run the Playwright e2e suite before deploying (optional, requires a local test DB per `TESTING_STRATEGY_GUIDE.md`):

```bash
npm run test:setup
npm run test:playwright
```

## 8. Post-deploy smoke test

Once deployed, manually verify the core flows against the live URL:

- [ ] Sign up a new account
- [ ] Log in / log out
- [ ] Browse services (`/services/installations`, `/services/sewins`, `/services/otherservices`)
- [ ] Book an appointment via `/calendar`
- [ ] View it under `/user` (your bookings list)
- [ ] Cancel a booking
- [ ] Reschedule a booking
- [ ] Promote a test account to `role: "admin"` directly in the production DB, log out and back in (JWT role claims are baked in at login — a DB role change doesn't take effect until re-login), then confirm `/admin` loads the dashboard and `/admin/services` lets you create/edit/delete a service
- [ ] Confirm a non-admin account gets redirected away from `/admin/*` to `/unauthorized`

## 9. Rotating secrets later

If `JWT_SECRET` is ever rotated, every existing session cookie becomes invalid immediately (users will be logged out and need to log back in). That's expected — not a bug to chase down if it happens after a secret rotation.
