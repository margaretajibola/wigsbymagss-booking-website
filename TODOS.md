# TODO List

_Last updated: 2026-10-09 — reviewed against actual codebase state._

## 🚀 Features
- Admin summary dashboard ✅
- Cancel and Reschedule appointments ✅
- Notifications ❌ (out of scope for launch)
- Chatbot ❌ (out of scope for launch)

## 🧪 Tests
- API, Database, Security, Perfomance ✅
- Integration tests 🚧
- End-to-end tests ✅

## 📋 Tasks
- Error handling ✅
- Protect routes ✅ (`middleware.ts` + per-route `requireUser`/`requireAdmin` confirmed working)
- Grey out appointment time after booking is complete ✅
- Run new test cases ✅

## 🐛 Bug Fixes
- Fix reviews end-to-end tests ✅
- 🔴 Booking date shifting by a calendar day in timezones ahead of UTC — fixed via `lib/date.ts` (`toDateKey`/`getBookingDateTime` helpers), applied across calendar page, admin dashboard stats, user dashboard upcoming/past split, and booking list date display ✅
- 🔴 Double-booking race condition — conflict check + create now wrapped in a Prisma `Serializable` transaction in both `POST /api/bookings` and the reschedule `PATCH` ✅
- 🟡 `POST /api/reviews` now requires auth (`requireUser`) ✅
- 🟡 `GET /api/availability` now has try/catch + validates the date param (400 instead of unhandled 500) ✅
- 🟡 Booking creation now validates `serviceId` exists before writing (400 instead of raw Prisma error) ✅
- 🟢 Deleting a `Service` with existing bookings now returns a clean 409 via a shared Prisma FK-violation handler in `lib/errors.ts` ✅
- Bonus fix found while patching the timezone bug: today's bookings were being misclassified as "past" almost all day on the user dashboard and reschedule/cancel buttons — date-only comparison was being checked against the full current timestamp instead of combining booking date + time ✅

## 🎨 Visual Polish ✅ (completed this session)
- Consistent Italiana/Julius Sans One type system across all pages (home, auth, services, calendar, reviews, policies, admin, user dashboards)
- Softened homepage hero, added CTA
- Removed photo collage page
- MUI/Tailwind font parity via `ThemeRegistry`
- Mobile nav overlap bug fixed
- Policies page given a heading + card styling (previously had none)

## 📚 Documentation
- `VERCEL_DEPLOYMENT_GUIDE.md` rewritten to match actual stack (JWT auth, single `DATABASE_URL`, no NextAuth/Stripe/Sentry) ✅

## 🔧 Technical Debt
- Redesign DoubleNav ✅
- Redesign SideNav ✅
- Redesign Loading...
- Make website responsive across various devices ✅
- Limit service and appointment list to certain value per page

## 🚢 Production Deploy ✅
1. Production Postgres database (Neon via Vercel Storage) ✅
2. Env vars set on Vercel (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`) ✅
3. Deployed to Vercel — live at `wigsbymagss-booking-website.vercel.app` ✅
4. Patched critical Next.js RCE advisory (bumped to `next@15.5.27`) ✅
5. Seeded production services, promoted admin account ✅
6. Fixed missing `Booking`/`Availability` tables in production (never captured in tracked migrations — added `prisma/migrations/20261009033013_add_booking_and_availability_models`) ✅
7. Hardened dashboard data fetching against API error responses, added missing `/unauthorized` page ✅
8. Post-deploy smoke test ✅
9. Replaced favicon (illegible cursive crop) with bold "W" badge in brand colors ✅

## 🔧 CI/CD
- 🔴 GitHub Actions (`Playwright Tests` workflow) failing on every push — not yet fixed, diagnosis so far:
  - `playwright.config.ts` `baseURL`/`webServer.url` point at `localhost:4000`, but `npm start` (`next start`) has no `-p 4000` and defaults to port 3000 — port mismatch.
  - The workflow's manual "Start application" step backgrounds `npm start &` and immediately moves to the next step; background processes started in one GitHub Actions step are not guaranteed to survive into the next step, so the server is likely dead before tests run.
  - This manual start is also redundant with (and conflicts with) `playwright.config.ts`'s own `webServer` option, which is designed to auto-start and tear down the app itself.
  - The workflow never sets `NODE_ENV=test`, so `webServer.command` in `playwright.config.ts` (`process.env.NODE_ENV === 'test' ? 'npm run start' : 'npm run dev'`) falls through to `npm run dev` instead of a production build.
  - Test Postgres credentials are hardcoded in plaintext in both `.github/workflows/playwright.yml` and `playwright.config.ts` — should move to a GitHub Actions secret even though it's just a throwaway CI DB.
  - Fix plan: simplify the workflow to reuse the existing `npm run test:db:reset` / `npm run test:playwright` scripts, set `NODE_ENV=test` and a matching `PORT`, remove the redundant manual server start/sleep, and move the DB password to a secret.

## 📌 Post-Launch Enhancements
- Add a dedicated confirmation page/screen for appointment reschedules
- Fix admin dashboard "Upcoming (7 days)" stat to exclude cancelled bookings
- Improve loading and error states across booking/calendar/admin pages
- Review mobile responsiveness across booking flow and admin dashboard
- Send booking confirmation email to customer on new booking
- Send appointment reminder email ahead of booking time
- Notify admin by email when a new booking is created
- Add rate limiting to auth endpoints (login/signup)
- Add password reset flow
- Set up automated production database backups
- Add error monitoring/alerting for production (e.g. catch Prisma/API errors like the `P2021` incident)

---

### Priority Levels
- 🔴 High Priority
- 🟡 Medium Priority
- 🟢 Low Priority

### Status
- ✅ Completed
- 🚧 In Progress
- ⏸️ On Hold
- ❌ Cancelled