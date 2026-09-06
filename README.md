# WABE International School, Mianwali Campus — Website

A full-stack, production-ready website for WABE International School, Mianwali Campus ("Do School Differently" / "Working At Basic Education"), built with Node.js, Express, EJS, and Prisma.

10 public pages (Home, About, Academics, Admissions, Fees & Challan, Faculty, Campus Life, Guidance & Development, Careers, Contact), all backed by a real database — plus a lightweight `/admin` area for managing content and reviewing submissions.

## Tech Stack

| Concern | Choice |
|---|---|
| Runtime / routing | Node.js + Express |
| Templating | EJS + `express-ejs-layouts` (server-rendered, no client framework) |
| Database / ORM | Prisma, using **SQLite** for local dev, **PostgreSQL**-ready for production |
| Styling | Plain CSS with custom properties (design tokens), no framework |
| Validation | `express-validator` |
| Email | `nodemailer`, with a console-log fallback when SMTP isn't configured |
| File uploads | `multer` (faculty photos, journal PDFs) |
| Admin auth | `express-session` + `bcrypt` (single seeded admin user) |
| Security | `helmet`, `csurf`, `express-rate-limit` on form routes |

### Why SQLite for local dev?

The brief asked for PostgreSQL via Prisma "or SQLite ... with a clear upgrade path." SQLite needs zero external setup (no Postgres server to install/run), so `npm install && npm run seed && npm run dev` gets a new developer running in minutes. Because Prisma abstracts the SQL dialect and this schema avoids Postgres-only types, moving to Postgres for production is a two-line change:

1. In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Set `DATABASE_URL` in your production `.env` to a Postgres connection string, e.g.
   `postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public`
3. Run `npx prisma migrate deploy` against the new database.

## Project Structure

```
wabe-mianwali-website/
├── prisma/               # schema.prisma, seed.js, generated migrations
├── public/                # static assets: css/, js/, images/, uploads/
├── src/
│   ├── app.js             # Express app entry point
│   ├── config/             # env, prisma client, mailer, syllabus data
│   ├── routes/              # one file per site section
│   ├── controllers/          # request handlers
│   ├── services/               # email/admission/job-application/challan logic
│   ├── middleware/              # validation, admin auth, rate limiting, uploads
│   └── utils/                    # constants, inline SVG icon set
└── views/
    ├── layouts/main.ejs           # public site layout
    ├── partials/                   # header, footer, flash messages, form field
    ├── admin/                       # admin layout + all admin screens
    └── *.ejs                         # the 10 public pages + print view
```

## Prerequisites

- Node.js 18+ and npm
- No external database server required for local dev (SQLite file is created automatically)

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```
   This triggers native builds for `bcrypt` and Prisma's client generation. If your npm environment gates install scripts (some corporate/security-hardened setups do), approve them first — they're required for password hashing and the database client to work:
   ```bash
   npm install-scripts approve @prisma/client bcrypt prisma @prisma/engines
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   The defaults work out of the box for local development (SQLite database, console-logged emails). Fill in real SMTP credentials and school contact details before deploying.

3. **Create the database and load sample data**
   ```bash
   npx prisma migrate dev --name init
   npm run seed
   ```
   (`prisma migrate dev` runs the seed automatically the first time; `npm run seed` re-seeds on demand — note this **clears and repopulates** all tables, so don't run it against data you want to keep.)

   The seed prints the admin login it created, e.g.:
   ```
   Admin login -> email: admin@wabemianwali.edu.pk  password: ChangeMe123!
   ```
   Change `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` in `.env` before seeding if you want different credentials — **change the default password before deploying anywhere public.**

4. **Run locally**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000`. The admin area is at `http://localhost:3000/admin/login`.

## Everyday Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start with nodemon (auto-restart on changes) |
| `npm start` | Start in production mode (`node src/app.js`) |
| `npm run seed` | Reset and re-populate sample data |
| `npx prisma migrate dev` | Create/apply a new migration after editing `schema.prisma` |
| `npx prisma studio` | Browse/edit the database in a GUI |
| `npm run lint` | ESLint over `src/` and `prisma/` |
| `npm run format` | Prettier over JS/EJS/CSS |

## Email Sending

Set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in `.env` to send real email via nodemailer. If any of these are missing, the app **automatically falls back to logging the would-be email to the console** instead of failing — this is intentional so the admissions/careers/contact forms work end-to-end in local dev without a mail provider. Emails are always sent to both the school (office/HR) and a confirmation to the submitter.

## Fee Challan Lookup

The `/fees` page's challan lookup queries the real `Student` and `FeeChallan` tables (class + roll number). The seed data includes 12 students (`WM-1001`–`WM-1012`) across several classes, each with a paid July 2026 challan and an August 2026 challan (a few intentionally unpaid with a fine, to exercise both states). Try roll number `WM-1001`, class `Class 1` for a quick test. The print view is at `/fees/challan/:id/print` and uses a dedicated print stylesheet (`public/css/print.css`) that hides site chrome.

## Admin Area

`/admin/login` — seeded credentials are printed by `npm run seed` (see above). From the dashboard you can:

- Review and update the status of admission applications, job applications, and contact messages
- Manage fee structure rows and create/delete individual student fee challans
- Manage job openings, faculty (with photo upload), events/news, journal issues (with PDF upload), and gallery categories

All `/admin/*` routes are protected by session-based auth middleware and redirect to `/admin/login` when unauthenticated.

## Branding Assets

`public/images/logo.jpg` currently contains a **placeholder monogram**, not the real school crest — replace this file with the actual logo (used in the header, footer, favicon, and printed fee challans) before going live. Keep it roughly square; a small white rounded badge container is used automatically when the logo sits on the navy header/footer background.

## Deployment (Render + PostgreSQL, example)

1. Push this repository to GitHub.
2. Create a PostgreSQL database on Render (or any managed Postgres host) and copy its connection string.
3. In `prisma/schema.prisma`, switch the datasource `provider` to `"postgresql"` (see above).
4. Create a Render **Web Service** from the repo:
   - Build command: `npm install && npx prisma generate`
   - Start command: `npx prisma migrate deploy && npm start`
   - Environment variables: copy everything from `.env.example`, using your real `DATABASE_URL`, SMTP credentials, and school contact details. Set `NODE_ENV=production`.
5. After the first deploy, run the seed once (Render's shell, or a one-off job) if you want the sample data — otherwise start entering real students/faculty/etc. via `/admin`.
6. Point your domain's DNS at the Render service and enable HTTPS (Render provisions this automatically for custom domains).

For a VPS instead: install Node.js + PostgreSQL, clone the repo, follow the same env/migrate/start steps, and run the app under a process manager such as PM2 (`pm2 start src/app.js --name wabe-mianwali`) behind an Nginx reverse proxy for TLS termination.

## Notes on Scope

- **Syllabus content** (`src/config/syllabus.js`) is a static config file rather than a database table, since curriculum data changes at most once a year — promote it to a Prisma model later if it needs to be admin-editable.
- **Testimonials** on the Home page are explicitly labeled illustrative/placeholder pending real, collected quotes.
- **Gallery photos** render as styled placeholder tiles until real campus photography is uploaded via the admin Gallery screen (the `GalleryImage` model is in place for when that happens).
