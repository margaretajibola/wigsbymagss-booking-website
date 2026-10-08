# TODO List

_Last updated: 2026-10-07 — reviewed against actual codebase state._

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

## 🚢 Remaining Before Production Deploy
1. Set up production Postgres database (user action required)
2. Set required env vars on Vercel (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`)
3. Deploy to Vercel and smoke-test the live site (signup/login, book an appointment, admin dashboard, cancel/reschedule)

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