# 💇♀️ Wigs by Magss – Booking Website

A modern full-stack booking platform for wig and hair services, built with **Next.js**, **React**, **TypeScript**, **Tailwind CSS**, **Prisma**, and **PostgreSQL**.

## ✨ Overview

Wigs by Magss is a web application that allows clients to easily browse services, select dates, and book appointments online.
It provides an intuitive interface for users and a management dashboard for the business owner to view, update, and manage bookings efficiently.

## 🛠️ Built With

- [React](https://react.dev/)
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/)
- [Playwright](https://playwright.dev/) for end-to-end testing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/margaretajibola/WigsbymagssBookingWebsite.git
   ```

2. Navigate into the project directory:
   ```bash
   cd WigsbymagssBookingWebsite/my-booking-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   ```env
   DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<database>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=7d
   ```

5. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 🧩 Features

- Responsive UI with Tailwind CSS
- Browse services by category (Installations, Sewins, Other Services)
- Select appointment dates and book sessions
- Booked time slots are greyed out to prevent double bookings
- Client dashboard to view bookings
- Admin dashboard to manage services and view all bookings
- Reviews page with optional image upload
- Policies page
- PostgreSQL database with Prisma ORM
- JWT-based authentication with session cookies
- Role-based access (user/admin)
- End-to-end testing with Playwright
- CI/CD pipeline with GitHub Actions
- Built with type safety and scalability in mind

## 📖 Usage

- Browse available wig styling services by category
- Select a service, choose a date/time, and submit a booking
- View and manage your bookings on the client dashboard
- Leave a review with optional image
- Admin: Manage services, view all bookings, and set availability

## 🗂️ Project Structure

```
app/
├── admin/          # Admin dashboard (bookings, services, profile)
├── api/            # API routes (auth, bookings, services, reviews, availability)
├── auth/           # Login and signup pages
├── calendar/       # Booking calendar page
├── reviews/        # Reviews page
├── services/       # Service pages (installations, sewins, other services)
├── user/           # User dashboard and profile
├── booking-complete/
└── policies/

components/         # Reusable UI components
lib/                # Auth, Prisma client, error handling utilities
hooks/              # Custom React hooks
types/              # TypeScript types
prisma/             # Database schema and migrations
tests/              # Playwright tests (e2e, api, security, performance)
```

## 🧪 Testing

### Setup test database
```bash
npm run test:setup
```

### Run all Playwright tests
```bash
npx playwright test
```

### Run specific test suites
```bash
npx playwright test --project=e2e
npx playwright test --project=api
npx playwright test --project=security
npx playwright test --project=performance
```

### View test report
```bash
npx playwright show-report
```

### Reset test database
```bash
npm run test:db:reset
```

## 🔄 CI/CD

This project uses GitHub Actions to automatically run Playwright tests on every push or pull request to `main` and `develop` branches. See `.github/workflows/playwright.yml` for the full configuration.

## 🚢 Deploy on Vercel

The easiest way to deploy this Next.js app is with the [Vercel Platform](https://vercel.com/new).

1. Push your code to GitHub
2. Import your repository on Vercel
3. Add your environment variables (`DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`)
4. Deploy

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
